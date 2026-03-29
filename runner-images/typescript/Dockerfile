ARG NODE_VERSION=18-alpine
FROM node:${NODE_VERSION}

# Install tsx globally for fast TypeScript execution
RUN npm install -g tsx typescript

# Create a secure, non-root user
RUN adduser -D appuser
USER appuser
WORKDIR /app

# Copy the shell script into the working directory
COPY ./execute-typescript.sh ./execute.sh

# Set the entrypoint
ENTRYPOINT ["sh", "execute.sh"]