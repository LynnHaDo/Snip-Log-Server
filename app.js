import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import { CodeSubmissionQueue } from './constructs/codeSubmissionQueue.js'
import { CODE_SUBMISSION_QUEUE_NAME, 
        POST_CODE_SUBMISSION_ENDPOINT,
        GET_CODE_SUBMISSION_RESULT_ENDPOINT, 
        REDIS_JOB_COMPLETED_FLAG, 
        REDIS_JOB_FAILED_FLAG, 
        REDIS_JOB_PENDING_FLAG,
        REDIS_CONNECTION } from './constants.js'
import Redis from 'ioredis';

const app = express() 
const PORT = parseInt(process.env.SERVER_PORT)
const CLIENT_ORIGIN = process.env.DEV_CLIENT_ORIGIN

const redisTest = new Redis(REDIS_CONNECTION);
redisTest.ping((err, result) => {
  if (err) {
    console.error("🔴 FAILED TO CONNECT TO REDIS:", err);
  } else {
    console.log("✅ Successfully pinged Redis:", result);
  }
  redisTest.quit();
});

const corsOptions = {
    origin: CLIENT_ORIGIN
}

const codeSubmissionQueue = new CodeSubmissionQueue(
    CODE_SUBMISSION_QUEUE_NAME, 
    REDIS_CONNECTION
)

app.use((req, res, next) => {
    console.log(`✅ Request received: ${req.method} ${req.path}`);
    next();
});

app.use(cors(corsOptions));
app.use(express.json());

/**
 * Endpoint to submit a code run request to the execution queue
 */
app.post(POST_CODE_SUBMISSION_ENDPOINT, async (req, res) => {
    console.log(req.body)
    const { code, runtimeConfig } = req.body;
    
    if (!code || !runtimeConfig) {
        return res.status(400).json({
            error: "Code and runtime configs are required."
        })
    }

    try {
        const job = await codeSubmissionQueue.addSubmission(code, runtimeConfig);

        if (!job) {
            // This will now catch errors from addSubmission (like if Redis is down)
            return res.status(500).json({ error: 'Failed to submit job to execution queue.' });
        } 
        else {
            res.status(200).json({ jobId: job.id });
        }
    } catch (err) {
        // This will catch any unexpected crash
        console.error("Critical error in /submit handler:", err);
        res.status(500).json({ error: 'Internal server error.' });
    }
})

/**
 * Endpoint to get a job output by id
 */
app.get(GET_CODE_SUBMISSION_RESULT_ENDPOINT, async (req, res) => {
    const { jobId } = req.params;

    const job = await codeSubmissionQueue.getJob(jobId)

    if (!job) {
        return res.status(404).json({ error: "Job not found."})
    }

    try {
        const jobState = await job.getState();

        switch (jobState) {
            case REDIS_JOB_COMPLETED_FLAG:
                res.status(200).json({ status: REDIS_JOB_COMPLETED_FLAG, output: job.returnValue });
                break;
            case REDIS_JOB_FAILED_FLAG:
                res.status(200).json({ status: REDIS_JOB_FAILED_FLAG, output: job.failedReason });
                break;
            default:
                res.status(200).json({ status: REDIS_JOB_PENDING_FLAG });
        } 
    } catch (err) {
        console.error("Failed to get job status: ", err);
        res.status(500).json({ error: "Failed to get job status."})
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})