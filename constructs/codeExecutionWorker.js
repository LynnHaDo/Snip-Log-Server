import 'dotenv/config';
import {
  DEFAULT_DOCKER_ARGS,
  DEFAULT_DOCKER_COMMAND,
  CODE_EXECUTION_TIMEOUT_IN_MILLIS,
  REDIS_JOB_COMPLETED_FLAG,
  REDIS_JOB_FAILED_FLAG,
  DOCKER_GHCR_ORIGIN,
  DOCKER_REGISTRY_OWNER_NAME,
  FORCEFUL_TERMINATE_PROCESS_FLAG,
  DEFAULT_MAX_JOBS_EXECUTION_IN_QUEUE_PER_SECOND,
  SUPPORTED_LANGUAGES
} from "../constants.js";
import { Worker } from "bullmq";
import { spawn, exec } from "child_process";
import util from "util"

const execAsync = util.promisify(exec); // promisify exec to use async/await

export class CodeExecutionWorker {
  constructor(name, connection, concurrency) {
    this.worker = new Worker(name, this.processJob, {
      connection: connection,
      concurrency: concurrency,
      autorun: false, // pause pulling jobs
      limiter: {
        max: DEFAULT_MAX_JOBS_EXECUTION_IN_QUEUE_PER_SECOND,
        duration: 1000 // process max 2 jobs per 1000ms
      }
    });

    this.setupWorker();
  }

  async setupWorker() {
    // Pre-warm the environment based on the current tag
    const imageTag = process.env.CURRENT_RUNNER_TAG || "latest";

    console.log(`Pre-pulling ${SUPPORTED_LANGUAGES.length} execution environments...`);
    // Docker pull all environments concurrently
    const pullPromises = SUPPORTED_LANGUAGES.map(async (lang) => {
        const dockerImage = `${DOCKER_GHCR_ORIGIN}/${DOCKER_REGISTRY_OWNER_NAME}/${lang}-runner:${imageTag}`;
        try {
            await execAsync(`${process.env.DOCKER_BINARY_PATH} pull ${dockerImage}`);
            console.log(`✅ Ready: ${lang}-runner`)
        } catch (e) {
            console.error(`⚠️ Failed to pull ${lang}-runner: ${e.message}`)
        }
    })

    // Wait for all images to finish downloading
    await Promise.all(pullPromises);
    console.log("✅ All runner images ready");

    // Attach event listeners
    this.worker.on(REDIS_JOB_COMPLETED_FLAG, (job, result) => {
      console.log(`Job ${job.id} completed. Result length: ${result.length}`);
    });

    this.worker.on(REDIS_JOB_FAILED_FLAG, (job, err) => {
      console.log(`Job ${job.id} failed with error: ${err.message}`);
    });

    console.log("✅ Worker is now accepting jobs from the queue.");
    this.worker.run();
  }

  processJob = (job) => {
    return new Promise((resolve, reject) => {
      const { code, runtimeConfig } = job.data;
      const language = runtimeConfig?.language;
      const version = runtimeConfig?.version;

      if (language == undefined || version == undefined) {
        reject(new Error(`Request must include language and version (language = ${language}, version = ${version})`));
      }

      const imageTag = process.env.CURRENT_RUNNER_TAG || version;
      const dockerImage = `${DOCKER_GHCR_ORIGIN}/${DOCKER_REGISTRY_OWNER_NAME}/${language}-runner:${imageTag}`;

      console.log(`Processing job ${job.id}...`);

      const dockerArgs = [...DEFAULT_DOCKER_ARGS, dockerImage];
      const child = spawn(DEFAULT_DOCKER_COMMAND, dockerArgs);

      let output = "", error = "";

      const timeout = setTimeout(() => {
        child.kill(FORCEFUL_TERMINATE_PROCESS_FLAG);
        console.log(`Job ${job.id} timed out.`);
        reject(
          new Error(
            `Execution timed out after ${
              CODE_EXECUTION_TIMEOUT_IN_MILLIS / 1000
            } seconds.`
          )
        );
      }, CODE_EXECUTION_TIMEOUT_IN_MILLIS);

      // Listen for data from the container's stdout
      child.stdout.on("data", (data) => {
        output += data.toString();
      });

      // Listen for error from the container's stderr
      child.stderr.on("data", (data) => {
        error += data.toString();
      });

      // Handle process exit
      child.on("close", (exitCode) => {
        clearTimeout(timeout);

        // Returns output and error (if any)
        resolve({
            stdout: output.trim(),
            stderr: error.trim(),
            exitCode: exitCode
        })
      });

      // If process fails to start
      child.on("error", (err) => {
        clearTimeout(timeout);
        console.log(`Job ${job.id} failed to start.`);
        reject(new Error(`Failed to start container: ${err.message}`));
      });

      // Write the code to container's stdin
      child.stdin.write(code);
      child.stdin.end();
    });
  }
}
