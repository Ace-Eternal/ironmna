# Deployment Guide

## Local Development
- Frontend: `pnpm serve` in `react-admin-design-main/`
- Backend: `mvn spring-boot:run` in `iron-management-backend/`
- Required backend envs are documented in `iron-management-backend/.env.example`.

## Docker Compose
1. Ensure `word-template/template.docx` exists.
2. Run `docker compose up --build`.
3. Frontend will be available at `http://localhost:8201`.
4. Backend will be available at `http://localhost:8888/iron`.

## Runtime Configuration
- Frontend API base URL is injected by `VITE_API_BASE_URL`.
- Backend datasource settings use `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD`.
- Backend document export uses `APP_TEMPLATE_PATH` and `APP_EXPORT_DIR`.
- Cross-origin policy is controlled by `APP_CORS_ALLOWED_ORIGINS`.

## Delivery Notes
- Keep the frontend proxy at `/iron` so local dev and container deployment share the same API path.
- Avoid embedding host-specific absolute paths in backend code.
- For production, replace default passwords and mount persistent database storage.
