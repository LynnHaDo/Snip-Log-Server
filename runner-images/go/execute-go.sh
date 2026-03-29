#!/bin/sh
cd /tmp

# Tell Go to use /tmp for its compilation cache to bypass the read-only file system
export GOCACHE=/tmp/go-cache
export GOMODCACHE=/tmp/go-mod-cache

cat > main.go
# Compilation Phase
go build -o main main.go
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