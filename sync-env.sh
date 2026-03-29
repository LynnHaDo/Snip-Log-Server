#!/bin/bash

# Get the current Git commit hash of your local repository
LATEST_SHA=$(git rev-parse HEAD)

# Update the .env file (macOS requires the '' after -i for sed)
sed -i '' "s/^CURRENT_RUNNER_TAG=.*/CURRENT_RUNNER_TAG=${LATEST_SHA}/" .env

echo "✅ Local .env updated to CURRENT_RUNNER_TAG=${LATEST_SHA}"
echo "🔄 Please restart your Node.js worker process."