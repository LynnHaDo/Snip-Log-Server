ARG JAVA_VERSION=21-alpine
FROM eclipse-temurin:${JAVA_VERSION}
RUN adduser -D appuser
USER appuser
WORKDIR /app
COPY ./execute-java.sh ../execute.sh
ENTRYPOINT ["sh", "execute.sh"]