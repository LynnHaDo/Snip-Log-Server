ARG SWIFT_VERSION=5.9-focal
FROM swift:${SWIFT_VERSION}
RUN useradd -m appuser
USER appuser
WORKDIR /app
COPY ./execute-swift.sh ./execute.sh
ENTRYPOINT ["bash", "execute.sh"]