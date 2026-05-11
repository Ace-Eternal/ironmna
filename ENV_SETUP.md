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
$env:DB_USERNAME="iron_app"
$env:DB_PASSWORD="replace_with_local_password"
$env:APP_AUTH_ALLOW_LEGACY_PLAINTEXT_PASSWORDS="false"
```

Admin passwords must be stored as BCrypt hashes. If an old local database still has plaintext admin passwords, start the backend once with `APP_AUTH_ALLOW_LEGACY_PLAINTEXT_PASSWORDS=true`, log in successfully to let the backend upgrade that user's password hash, then restart with the flag set back to `false`.

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
- GitHub Actions publishes Docker images to `ghcr.io/<github-owner>/ironman-backend` and `ghcr.io/<github-owner>/ironman-frontend`
- Set `BACKEND_IMAGE` and `FRONTEND_IMAGE` when the server should pull GitHub Container Registry images instead of using local compose build tags
- Rotate any database password that was previously committed to the repository
- Do not expose MySQL `3306` or backend `8888` directly on a public server; publish only the reverse proxy entrypoint
