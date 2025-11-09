export const CODE_SUBMISSION_QUEUE_NAME = 'code-submission'
export const CODE_SUBMISSION_JOB_NAME = 'run-code'

export const POST_CODE_SUBMISSION_ENDPOINT = '/submit'
export const GET_CODE_SUBMISSION_RESULT_ENDPOINT = '/results/:jobId'

export const REDIS_JOB_COMPLETED_FLAG = "completed"
export const REDIS_JOB_FAILED_FLAG = "failed"
export const REDIS_JOB_PENDING_FLAG = "pending"