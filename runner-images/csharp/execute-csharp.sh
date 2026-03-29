#!/bin/sh
cd /tmp
# Map ALL .NET hidden CLI folders to the writable /tmp space
export DOTNET_CLI_HOME=/tmp
export NUGET_PACKAGES=/tmp/nuget

# Kill all background network, extraction, and telemetry tasks
export DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1
export DOTNET_CLI_TELEMETRY_OPTOUT=1
export DOTNET_NOLOGO=1

# Create project WITHOUT trying to reach the network (--no-restore)
dotnet new console -n App -o . --no-restore > /dev/null 2>&1

# Overwrite the auto-generated Program.cs with the user's incoming code
cat > Program.cs

# Compilation Phase (build into an 'out' directory)
dotnet build -c Release -o ./out -nologo
COMPILATION_CODE=$?

if [ $COMPILATION_CODE -ne 0 ]; then
    exit $COMPILATION_CODE
fi

# 4. Execution Phase
timeout 10s ./out/App
EXIT_CODE=$?

if [ $EXIT_CODE -eq 143 ] || [ $EXIT_CODE -eq 124 ]; then
    echo "Execution timed out (10 seconds)" >&2
fi

exit $EXIT_CODE