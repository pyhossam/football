# Football Tournament Management Platform

Backend foundation for a football tournament management platform using ASP.NET Core, Clean Architecture, PostgreSQL, Identity, JWT access tokens, refresh-token rotation, role policies, Swagger, FluentValidation, AutoMapper, Serilog, EF Core migrations, and xUnit tests.

## Current Phase

Implemented first backend phase:

- Clean solution: `Api`, `Application`, `Domain`, `Infrastructure`, `UnitTests`
- PostgreSQL EF Core setup with initial migration
- ASP.NET Core Identity with GUID users and roles
- Roles: `GeneralAdmin`, `TournamentSupervisor`, `TeamManager`
- JWT login, refresh token rotation, and refresh-token revocation
- Policy-based authorization
- Tournament entity and CRUD endpoints
- Tournament supervisor assignment endpoint
- Global exception middleware
- Swagger/OpenAPI
- Arabic/English localization pipeline with RTL-ready culture support for frontend integration
- Docker Compose for API + PostgreSQL

## Requirements

- .NET SDK 10
- Docker Desktop for containerized PostgreSQL/API

Node/npm is not currently installed in this machine, so the React frontend phase is intentionally deferred until the backend foundation is stable.

## Configuration

Copy `.env.example` to `.env` and replace the development values:

```powershell
Copy-Item .env.example .env
```

Important environment variables:

- `ConnectionStrings__DefaultConnection`
- `Jwt__SigningKey` with at least 32 characters
- `Seed__AdminEmail`
- `Seed__AdminPassword`
- `Database__AutoMigrate=true` to apply migrations and seed development data on API startup

No production secrets should be committed.

## Run With Docker

```powershell
docker compose up --build
```

API:

- Swagger: `http://localhost:5080/swagger`
- Health: `http://localhost:5080/health`

## Run Locally

Start PostgreSQL, then set the required environment variables and run:

```powershell
dotnet restore .\FootballTournament.sln
dotnet ef database update --project .\src\FootballTournament.Infrastructure\FootballTournament.Infrastructure.csproj --startup-project .\src\FootballTournament.Api\FootballTournament.Api.csproj
dotnet run --project .\src\FootballTournament.Api\FootballTournament.Api.csproj
```

## Main API Routes

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/revoke-refresh-token`
- `GET /api/v1/tournaments`
- `GET /api/v1/tournaments/{id}`
- `POST /api/v1/tournaments`
- `PUT /api/v1/tournaments/{id}`
- `DELETE /api/v1/tournaments/{id}`
- `POST /api/v1/tournaments/{id}/supervisors`

## Tests

```powershell
dotnet test .\FootballTournament.sln
```

## GitHub Remote

The repository remote is intended to be:

```text
https://github.com/pyhossam/football.git
```
