#!/bin/sh
cd /tmp
cat > main.py
timeout 10s python main.py
EXIT_CODE=$?

if [ $EXIT_CODE -eq 143 ] || [ $EXIT_CODE -eq 124 ]; then
    echo "Execution timed out (10 seconds)" >&2
fi

exit $EXIT_CODE