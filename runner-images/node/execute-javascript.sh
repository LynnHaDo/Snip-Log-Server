#!/bin/sh
cd /tmp
cat > index.js
timeout 10s node index.js
EXIT_CODE=$?

if [ $EXIT_CODE -eq 143 ] || [ $EXIT_CODE -eq 124 ]; then
    echo "Execution timed out (10 seconds)" >&2
fi

# Explicitly exit with the program's code so your Node worker captures it
exit $EXIT_CODE