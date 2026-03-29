ARG DOTNET_VERSION=8.0-alpine
FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_VERSION}
RUN adduser -D appuser
USER appuser
WORKDIR /app
RUN dotnet new console -o Runner --no-restore
WORKDIR /app/Runner
COPY ./execute-csharp.sh ./execute.sh
ENTRYPOINT ["sh", "execute.sh"]