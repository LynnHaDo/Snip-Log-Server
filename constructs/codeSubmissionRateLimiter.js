import { rateLimit } from 'express-rate-limit'
import { DEFAULT_MAX_CODE_SUBMISSION_PER_IP_PER_MINUTE } from '../constants'

export class CodeSubmissionRateLimiter {
    constructor(redisStore) {
        this.rateLimiter = rateLimit({
            store: redisStore,
            limit: DEFAULT_MAX_CODE_SUBMISSION_PER_IP_PER_MINUTE,
            legacyHeaders: false,
            standardHeaders: true,
            message: {
                error: `Each user is limited to ${DEFAULT_MAX_CODE_SUBMISSION_PER_IP_PER_MINUTE} submissions per minute. Please wait.`,
            },
            keyGenerator: (req) => req.user?.id || req.ip
        })
    }

    getRateLimiter() {
        return this.rateLimiter
    }
}