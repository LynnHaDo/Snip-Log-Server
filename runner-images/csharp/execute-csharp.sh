#!/bin/sh
cd /tmp
# Map ALL .NET hidden CLI folders to the writable /tmp space
export DOTNET_CLI_HOME=/tmp
export NUGET_PACKAGES=/tmp/nuget

# Kill all background network, extraction, and telemetry tasks
export DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1
export DOTNET_CLI_TELEMETRY_OPTOUT=1
export DOTNET_NOLOGO=1

# Copy the pre-warmed project from the image into our writable memory
cp -r /app/Runner/* /tmp/

# Overwrite the generated Program.cs with the user's incoming code
cat > Program.cs

# Compile the project
dotnet build -c Release -o ./out --no-restore
COMPILATION_CODE=$?

if [ $COMPILATION_CODE -ne 0 ]; then
    exit $COMPILATION_CODE
fi

# Execute the compiled binary
timeout 10s ./out/Runner
EXIT_CODE=$?

if [ $EXIT_CODE -eq 143 ] || [ $EXIT_CODE -eq 124 ]; then
    echo "Execution timed out (10 seconds)" >&2
fi

exit $EXIT_CODE