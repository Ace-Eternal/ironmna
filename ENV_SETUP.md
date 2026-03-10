# Environment Setup

## Backend

- Development profile is enabled by default: `SPRING_PROFILES_ACTIVE=dev`
- Shared server settings live in `iron-management-backend/src/main/resources/application.yaml`
- Database settings live in:
  - `iron-management-backend/src/main/resources/application-dev.yaml`
  - `iron-management-backend/src/main/resources/application-prod.yaml`
- Copy `iron-management-backend/.env.example` and export the variables in your shell or IDE run configuration before starting Spring Boot

Example development variables:

```powershell
$env:SPRING_PROFILES_ACTIVE="dev"
$env:DB_HOST="127.0.0.1"
$env:DB_PORT="3306"
$env:DB_NAME="iron_management"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="root"
```

## Frontend

- Base API URL is read from Vite env files
- Development uses `/iron` and proxies it to `http://localhost:8888`
- Production also defaults to `/iron`, which works behind Nginx or another reverse proxy

Example local frontend startup:

```powershell
cd react-admin-design-main
pnpm install
pnpm dev
```

## Deployment

- Serve the frontend statically with Nginx
- Reverse proxy `/iron` to the Spring Boot service
- Inject production database variables through the process manager, container runtime, or deployment platform
- Rotate any database password that was previously committed to the repository
