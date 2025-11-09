import 'dotenv/config';
import {
  REDIS_CONNECTION,
  CODE_SUBMISSION_QUEUE_NAME,
  DEFAULT_MAX_CONCURRENT_JOBS_PER_WORKER,
} from "./constants.js";
import { CodeExecutionWorker } from "./constructs/codeExecutionWorker.js";

console.log("✅ Worker is starting...")

const codeExecutionWorker = new CodeExecutionWorker(
  CODE_SUBMISSION_QUEUE_NAME,
  REDIS_CONNECTION,
  DEFAULT_MAX_CONCURRENT_JOBS_PER_WORKER
);