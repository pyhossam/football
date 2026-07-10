FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY FootballTournament.sln ./
COPY src/FootballTournament.Domain/FootballTournament.Domain.csproj src/FootballTournament.Domain/
COPY src/FootballTournament.Application/FootballTournament.Application.csproj src/FootballTournament.Application/
COPY src/FootballTournament.Infrastructure/FootballTournament.Infrastructure.csproj src/FootballTournament.Infrastructure/
COPY src/FootballTournament.Api/FootballTournament.Api.csproj src/FootballTournament.Api/
RUN dotnet restore src/FootballTournament.Api/FootballTournament.Api.csproj
COPY . .
RUN dotnet publish src/FootballTournament.Api/FootballTournament.Api.csproj -c Release -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "FootballTournament.Api.dll"]
