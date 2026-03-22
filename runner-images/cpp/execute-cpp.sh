#!/bin/sh
cat > main.cpp
g++ -O2 main.cpp -o main
if [ $? -ne 0 ]; then
    exit 1
fi

timeout 10s ./main
EXIT_CODE=$?

if [ $EXIT_CODE -eq 143 ] || [ $EXIT_CODE -eq 124 ]; then
    echo "Execution timed out (10 seconds)" >&2
fi