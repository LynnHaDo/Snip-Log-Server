#!/bin/sh
cd /tmp
cat > Program.cs
timeout 10s dotnet run --no-launch-profile
EXIT_CODE=$?

if [ $EXIT_CODE -eq 143 ] || [ $EXIT_CODE -eq 124 ]; then
    echo "Execution timed out (10 seconds)" >&2
fi