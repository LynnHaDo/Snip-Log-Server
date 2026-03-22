# 1. Use an argument for the Python version to match your YAML
ARG PYTHON_VERSION=3.10.0-slim
FROM python:${PYTHON_VERSION}

# 2. Create a secure, non-root user (Debian syntax)
RUN useradd -m appuser
USER appuser
WORKDIR /app

# 3. Copy the shell script and rename it to execute.sh
COPY ./execute-python.sh ../execute.sh

# 4. Set the entrypoint to run the shell script
ENTRYPOINT ["sh", "execute.sh"]