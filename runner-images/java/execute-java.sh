#!/bin/sh
cd /tmp
cat > Main.java

# Compilation Phase
javac Main.java

COMPILATION_CODE=$?

# If compilation fails, exit immediately so the Node worker catches the stderr
if [ $COMPILATION_CODE -ne 0 ]; then
    exit $COMPILATION_CODE
fi

# Execution Phase
timeout 10s java Main
EXIT_CODE=$?

# 5. Handle Timeouts Cleanly
if [ $EXIT_CODE -eq 143 ] || [ $EXIT_CODE -eq 124 ]; then
    echo "Execution timed out (10 seconds)" >&2
fi

exit $EXIT_CODE