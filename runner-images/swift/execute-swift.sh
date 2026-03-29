#!/bin/bash
cd /tmp
cat > main.swift
# Compilation Phase
swiftc -O main.swift -o main
COMPILATION_CODE=$?

if [ $COMPILATION_CODE -ne 0 ]; then
    exit $COMPILATION_CODE
fi

# Execution Phase
timeout 10s ./main
EXIT_CODE=$?

if [ $EXIT_CODE -eq 143 ] || [ $EXIT_CODE -eq 124 ]; then
    echo "Execution timed out (10 seconds)" >&2
fi

exit $EXIT_CODE