import {
  REDIS_CONNECTION,
  CODE_EXECUTION_WORKER_NAME,
  DEFAULT_MAX_CONCURRENT_JOBS_PER_WORKER,
} from "./constants";
import { CodeExecutionWorker } from "./constructs/codeExecutionWorker";

console.log("Worker is starting...")

const codeExecutionWorker = new CodeExecutionWorker(
  CODE_EXECUTION_WORKER_NAME,
  REDIS_CONNECTION,
  DEFAULT_MAX_CONCURRENT_JOBS_PER_WORKER
);
