ARG ALPINE_VERSION=3.19
FROM alpine:${ALPINE_VERSION}
RUN apk add --no-cache g++
RUN adduser -D appuser
USER appuser
WORKDIR /app
COPY ./execute-cpp.sh ../execute.sh
ENTRYPOINT ["sh", "execute.sh"]