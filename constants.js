import 'dotenv/config';

export const CODE_SUBMISSION_QUEUE_NAME = "code-submission";
export const CODE_SUBMISSION_JOB_NAME = "run-code";

export const POST_CODE_SUBMISSION_ENDPOINT = "/submit";
export const GET_CODE_SUBMISSION_RESULT_ENDPOINT = "/results/:jobId";

export const REDIS_JOB_COMPLETED_FLAG = "completed";
export const REDIS_JOB_FAILED_FLAG = "failed";
export const REDIS_JOB_PENDING_FLAG = "pending";
export const REDIS_CONNECTION = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT)
}

export const CODE_EXECUTION_TIMEOUT_IN_MILLIS = 10000;
export const DEFAULT_DOCKER_ARGS = [
  "run",
  "--rm", // Automatically remove the container when it exits
  "--network=none", // **SECURITY**: Disable all networking
  "--read-only", // **SECURITY**: Mount container's filesystem as read-only
  "--cpus=0.5", // **RESOURCE**: Limit to 50% of a CPU core
  "--memory=100m", // **RESOURCE**: Limit to 100MB of RAM
  "-i", // Keep STDIN open to pipe code into it
];
export const DEFAULT_DOCKER_COMMAND = 'docker'
export const FORCEFUL_TERMINATE_PROCESS_FLAG = 'SIGKILL'
export const PROCESS_SUCCESS_EXIT_CODE = 0
export const DEFAULT_MAX_CONCURRENT_JOBS_PER_WORKER = 5

export const DOCKER_GHCR_ORIGIN = "ghcr.io"