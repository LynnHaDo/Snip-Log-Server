import 'dotenv/config';
import {
  DEFAULT_DOCKER_ARGS,
  DEFAULT_DOCKER_COMMAND,
  CODE_EXECUTION_TIMEOUT_IN_MILLIS,
  REDIS_JOB_COMPLETED_FLAG,
  REDIS_JOB_FAILED_FLAG,
  DOCKER_GHCR_ORIGIN,
  FORCEFUL_TERMINATE_PROCESS_FLAG,
  DEFAULT_MAX_JOBS_EXECUTION_IN_QUEUE_PER_SECOND
} from "../constants.js";
import { Worker } from "bullmq";
import { spawn } from "child_process";

export class CodeExecutionWorker {
  constructor(name, connection, concurrency) {
    this.worker = new Worker(name, this.processJob, {
      connection: connection,
      concurrency: concurrency,
      limiter: {
        max: DEFAULT_MAX_JOBS_EXECUTION_IN_QUEUE_PER_SECOND,
        duration: 1000 // process max 2 jobs per 1000ms
      }
    });

    this.setupWorker();
  }

  setupWorker() {
    this.worker.on(REDIS_JOB_COMPLETED_FLAG, (job, result) => {
      console.log(`Job ${job.id} completed. Result length: ${result.length}`);
    });

    this.worker.on(REDIS_JOB_FAILED_FLAG, (job, err) => {
      console.log(`Job ${job.id} failed with error: ${err.message}`);
    });
  }

  processJob = (job) => {
    return new Promise((resolve, reject) => {
      const { code, runtimeConfig } = job.data;
      const language = runtimeConfig?.language || 'python'
      const version = runtimeConfig?.version || '3.10.0'
      const registry_owner = process.env.GITHUB_USERNAME.toLowerCase();
      const dockerImage = `${DOCKER_GHCR_ORIGIN}/${registry_owner}/${language}-runner:${version}`;

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
