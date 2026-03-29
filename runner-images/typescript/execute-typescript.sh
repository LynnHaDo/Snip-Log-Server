#!/bin/sh
cd /tmp
# Read from stdin into index.ts
cat > index.ts

# Execute using tsx with a 10s timeout
timeout 10s tsx index.ts
EXIT_CODE=$?

if [ $EXIT_CODE -eq 143 ] || [ $EXIT_CODE -eq 124 ]; then
    echo "Execution timed out (10 seconds)" >&2
fi

# Explicitly exit with the program's code
exit $EXIT_CODE