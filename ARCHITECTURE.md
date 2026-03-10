# Ironman Architecture

## Goals
- Keep the current frontend and backend stacks.
- Make new features land in predictable modules.
- Separate business logic from transport and infrastructure concerns.
- Standardize local development and deployment around Docker Compose.

## Repository Layout
- `react-admin-design-main/`: Vite + React frontend.
- `iron-management-backend/`: Spring Boot + MyBatis backend.
- `word-template/`: shared document templates used by backend export flows.
- `docker-compose.yml`: default local and deployment baseline.

## Frontend Conventions
- `src/app`: app bootstrapping, runtime env, global providers.
- `src/modules/<domain>`: domain-specific APIs, state, and view helpers.
- `src/shared`: reusable infrastructure such as the HTTP client.
- `src/api`: compatibility exports only; new APIs should live under `src/modules`.
- Do not add new source-of-truth `.js` mirrors for TypeScript source files.

## Backend Conventions
- `com.example.common`: shared config, exception handling, file/template services.
- `com.example.<domain>.application`: business orchestration for each domain.
- `com.example.controller`: thin HTTP controllers only.
- `com.example.service` and `com.example.mapper`: existing persistence/service layer kept for incremental migration.
- New business workflows should move into application services instead of controller classes.

## Deployment Baseline
- Frontend is built into static assets and served by Nginx.
- Backend runs as a Spring Boot jar with environment-driven configuration.
- MySQL is the default datastore for local/dev deployment.
- Template files are mounted as external resources instead of hard-coded absolute paths.
