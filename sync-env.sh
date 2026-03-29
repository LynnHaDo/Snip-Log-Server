#!/bin/bash

DOCKER_CMD="${DOCKER_BINARY_PATH:-docker}"

# Get the current Git commit hash of the local repository
LATEST_SHA=$(git rev-parse HEAD)
echo "Syncing local environment to Git hash: $LATEST_SHA"

# Loop through each coding environment
echo "Building local Docker images..."

for dir in ./runner-images/*/; do
    lang=$(basename "$dir")

    echo "--------------------------------"
    echo "🔨 Building $lang-runner..."
    echo "--------------------------------"

    "$DOCKER_CMD" build -t ghcr.io/lynnhado/${lang}-runner:$LATEST_SHA "$dir" --no-cache
done

# Update the .env file (macOS requires the '' after -i for sed)
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/^CURRENT_RUNNER_TAG=.*/CURRENT_RUNNER_TAG=${LATEST_SHA}/" .env
else
  sed -i "s/^CURRENT_RUNNER_TAG=.*/CURRENT_RUNNER_TAG=${LATEST_SHA}/" .env
fi

echo "✅ All runner images built and environment synced"
echo "✅ Local .env updated to CURRENT_RUNNER_TAG=${LATEST_SHA}"
echo "🔄 Please restart your Node.js worker process."