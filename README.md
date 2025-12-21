## SnipLog Server

This is the server app to SnipLog application that hosts the code execution engine.

### Prerequisites

- Node.js: v18 or higher (using ES Modules).
- Docker Desktop: Installed and running.
- Postman: For API testing.

### Local Redis Setup

To run the background queue, you need a Redis instance. We use Docker to ensure the environment is consistent.

Pull and Start Redis: Run the following command in your terminal:
```
docker run -d --name redis-server -p 6379:6379 redis
```

Verify Redis is Running:
```
docker ps
```

You should see 'redis' in the list

### Environment Configuration

Create a `.env` file in the root directory and add the following:

```
SERVER_PORT=4001
DEV_CLIENT_ORIGIN=http://localhost:3000
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
GITHUB_USERNAME=your_lowercase_username
```

Note: Always use 127.0.0.1 for the Redis host to avoid IPv6 connection issues (ECONNREFUSED ::1).

### Running the Application

Since the API and Worker are separate processes, you must run them in two different terminals:

Terminal 1 (API): `node app.js`

Terminal 2 (Worker): `node worker.js`

## Testing the System
### Step 1: Sending Code via Postman

To test the submission, send a POST request to your local API.

URL: http://localhost:4001/submit

Method: POST

Headers:

Content-Type: application/json

Origin: http://localhost:3000 (to bypass CORS).

Body (raw JSON):

```
{
  "code": "print('Hello from the Code Runner!')",
  "runtimeConfig": {
    "language": "python",
    "version": "3.10.0"
  }
}
```

### Step 2: Observing the Output
Once you click Send, follow this flow to see the results:

- Check Postman Response: You should receive a 200 Accepted status with a jobId (e.g., {"jobId": "1"}).

- Check Worker Terminal: Look at the terminal running node worker.js. You will see logs indicating the job is being processed:

```
Processing job 1...
Attempting to run image: ghcr.io/lynnhado/python-runner:3.10.0
Job 1 completed successfully.
```

- Fetch the Result: Send a GET request to retrieve the actual output:

URL: http://localhost:4001/results/1 (Replace 1 with your actual jobId).

Response:

```
{
  "status": "completed",
  "output": "Hello from the Code Runner!\n"
}
```