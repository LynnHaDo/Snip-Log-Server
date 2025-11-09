import { Queue } from "bullmq";
import { CODE_SUBMISSION_JOB_NAME } from '../constants'

export class CodeSubmissionQueue {
    constructor(name, connection) {
        this.queue = new Queue(name, {
            connection: connection
        })
    }

    async addSubmission(code, runtimeConfig) {
        try {
            const job = await this.queue.add(CODE_SUBMISSION_JOB_NAME, {
                code, 
                runtimeConfig
            })
            return job
        } catch (err) {
            console.error("Failed to add job to queue: ", err)
            return null
        }
    }

    async getJob(jobId) {
        try {
            const job = await this.queue.getJob(jobId);
            return job
        } catch (err) {
            console.error("Failed to get job with given id: ", err)
            return null
        }
    }
}