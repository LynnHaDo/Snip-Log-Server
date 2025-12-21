import sys
import subprocess

# Your constant is 10000ms
TIMEOUT_SECONDS = 10 

try:
    # Read all code from standard input
    user_code = sys.stdin.read()
    
    # Execute the code as a new process
    result = subprocess.run(
        ['python3', '-c', user_code],
        capture_output=True,
        text=True,
        timeout=TIMEOUT_SECONDS
    )

    # Print stdout or stderr to the container's output
    if result.stderr:
        print(result.stderr, file=sys.stderr)
    else:
        print(result.stdout)

except subprocess.TimeoutExpired:
    print("Execution timed out (10 seconds)", file=sys.stderr)
except Exception as e:
    print(e, file=sys.stderr)