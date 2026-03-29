#!/bin/sh
cd /tmp
cat > Main.java
timeout 10s java Main.java
EXIT_CODE=$?

if [ $EXIT_CODE -eq 143 ] || [ $EXIT_CODE -eq 124 ]; then
    echo "Execution timed out (10 seconds)" >&2
fi