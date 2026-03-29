ARG RUST_VERSION=1.77-alpine
FROM rust:${RUST_VERSION}
RUN adduser -D appuser
USER appuser
WORKDIR /app
COPY ./execute-rust.sh ./execute.sh
ENTRYPOINT ["sh", "execute.sh"]