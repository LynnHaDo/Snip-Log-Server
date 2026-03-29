#!/bin/sh
cd /tmp
# Initialize an empty console project
# We send the setup output to /dev/null so it doesn't pollute the user's terminal
dotnet new console -n App -o . > /dev/null 2>&1

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