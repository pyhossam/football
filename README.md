# Football Tournament Management Platform

Football tournament management platform using ASP.NET Core, Clean Architecture, PostgreSQL, Identity, JWT access tokens, refresh-token rotation, role policies, Swagger, FluentValidation, AutoMapper, Serilog, EF Core migrations, React, TypeScript, Material UI, React Query, Zustand, and xUnit tests.

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
- React TypeScript client foundation with Arabic/English language switching
- RTL/LTR layout support
- Responsive login, public portal, dashboard, and tournaments pages
- Sports-themed visual identity with mobile and tablet layouts

## Requirements

- .NET SDK 10
- Node.js 24 or compatible runtime with pnpm
- Docker Desktop for containerized PostgreSQL/API

Codex desktop can use its bundled Node.js and pnpm runtime when Node is not installed globally.

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
- Frontend: `http://localhost:5173`

## Run Locally

Start PostgreSQL, then set the required environment variables and run:

```powershell
dotnet restore .\FootballTournament.sln
dotnet ef database update --project .\src\FootballTournament.Infrastructure\FootballTournament.Infrastructure.csproj --startup-project .\src\FootballTournament.Api\FootballTournament.Api.csproj
dotnet run --project .\src\FootballTournament.Api\FootballTournament.Api.csproj
```

Run the frontend:

```powershell
cd .\src\FootballTournament.Client
pnpm install
pnpm run dev
```

Frontend:

- App: `http://localhost:5173`
- Login: `http://localhost:5173/login`
- Public portal: `http://localhost:5173/public`

Development admin login:

```text
admin@football.local
Admin@123
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
cd .\src\FootballTournament.Client
pnpm run build
```

## GitHub Remote

The repository remote is intended to be:

```text
https://github.com/pyhossam/football.git
```
