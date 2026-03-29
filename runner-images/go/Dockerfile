ARG GO_VERSION=1.22-alpine
FROM golang:${GO_VERSION}
RUN adduser -D appuser
USER appuser
WORKDIR /app
COPY ./execute-go.sh ./execute.sh
ENTRYPOINT ["sh", "execute.sh"]