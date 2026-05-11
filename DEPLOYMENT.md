# Deployment Guide

## Local Development
- Frontend: `pnpm serve` in `react-admin-design-main/`
- Backend: `mvn spring-boot:run` in `iron-management-backend/`
- Required backend envs are documented in `iron-management-backend/.env.example`.

## Docker Compose
1. Ensure `word-template/template.docx` exists.
2. Copy `.env.example` to `.env` and replace every password/origin placeholder.
3. Run `docker compose up --build`.
4. Frontend will be available at `http://localhost:8201`.
5. Backend and MySQL are only reachable on the private Compose network; do not publish `8888` or `3306` on an internet-facing server.

## GitHub Actions Docker Images

The workflow `.github/workflows/docker-images.yml` builds the backend and frontend Docker images on GitHub Actions and pushes them to GitHub Container Registry.

- Backend image: `ghcr.io/<github-owner>/ironman-backend`
- Frontend image: `ghcr.io/<github-owner>/ironman-frontend`
- Pushes to `main` publish the `main`, `latest`, and `sha-<commit>` tags.
- Git tags matching `v*.*.*` publish the matching version tag.
- Other branches and pull requests do not run the Docker image workflow.

Repository requirements:

- In GitHub, keep Actions enabled and allow the workflow `GITHUB_TOKEN` to write packages.
- For private repositories or private packages, log in on the server with a token that has `read:packages`.

Server pull example:

```bash
echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GITHUB_USER" --password-stdin

export BACKEND_IMAGE=ghcr.io/<github-owner>/ironman-backend:latest
export FRONTEND_IMAGE=ghcr.io/<github-owner>/ironman-frontend:latest
docker compose pull backend frontend
docker compose up -d
```

## Runtime Configuration
- Frontend API base URL is injected by `VITE_API_BASE_URL`.
- Backend datasource settings use `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD`.
- Backend document export uses `APP_TEMPLATE_PATH` and `APP_EXPORT_DIR`.
- Cross-origin policy is controlled by `APP_CORS_ALLOWED_ORIGINS`.
- Authentication requires BCrypt-hashed admin passwords. `APP_AUTH_ALLOW_LEGACY_PLAINTEXT_PASSWORDS=true` is only for a short, one-time migration window; keep it `false` in production.
- `MYSQL_ROOT_PASSWORD` and `DB_PASSWORD` must be unique strong values. Rotate any value that has ever appeared in source code, logs, screenshots, or chat.

## Production Security Baseline

- Expose only the public Nginx/frontend port, normally `80` or `443`.
- Keep MySQL inside the Docker network. Do not map `3306:3306` unless it is bound to localhost for emergency maintenance.
- Keep the Spring Boot service inside the Docker network. The frontend Nginx container proxies `/iron/` to `backend:8888`.
- Use the `DB_USERNAME` application account, not MySQL `root`, for backend connections.
- Store `.env` only on the server and never commit it.
- After deployment, verify unauthenticated API calls return `401`, for example `curl -i http://localhost:8201/iron/customer/getCustomerList?current=1&pageSize=10`.
- Delete old `artifacts/` and `runtime-logs/` directories from source control history or rotate every secret that appeared there before sharing the repository.

## Production Server Deployment

> **必须先在本地打包，不要在服务器上打包。服务器内存不足，禁止在服务器上执行 `mvn package`、`pnpm build`、`docker compose up --build` 等构建命令。**

Current production layout:

- Server: `106.54.35.68`
- Deploy directory: `/home/ubuntu/ironman/react`
- Backend jar: `/home/ubuntu/ironman/react/Iron_Management_Backend-0.0.1-SNAPSHOT.jar`
- Frontend static files: `/home/ubuntu/ironman/react/dist`
- Nginx serves `/home/ubuntu/ironman/react/dist` and proxies `/iron/` to `http://127.0.0.1:8888/iron/`
- Nginx redirects root `/` to `/login#/login` so users who enter `http://106.54.35.68/` land on the login page.
- Word template: `/home/ubuntu/ironman/react/template.docx`
- Backend export directory: `/tmp/ironman-exports`

### 1. Build Artifacts Locally

Run from the repository root on the local machine:

```powershell
cd iron-management-backend
mvn clean package -DskipTests

cd ..\react-admin-design-main
pnpm build

cd ..
New-Item -ItemType Directory -Force artifacts | Out-Null
Copy-Item iron-management-backend\target\Iron_Management_Backend-0.0.1-SNAPSHOT.jar artifacts\Iron_Management_Backend-0.0.1-SNAPSHOT.jar
tar -czf artifacts\frontend-dist.tar.gz -C react-admin-design-main\dist .
```

Expected local artifacts:

- `artifacts/Iron_Management_Backend-0.0.1-SNAPSHOT.jar`
- `artifacts/frontend-dist.tar.gz`

### 2. Upload Artifacts Only

Upload the two local artifacts to a temporary server directory such as:

```bash
/tmp/ironman-deploy-YYYYMMDDHHMMSS/
```

Do not upload source code for server-side building. The server should only receive already-built artifacts.

### 3. Replace Files on Server

Create a backup before replacing files:

```bash
APP_DIR=/home/ubuntu/ironman/react
TS=$(date +%Y%m%d%H%M%S)
BACKUP_DIR="$APP_DIR/backups/$TS"
mkdir -p "$BACKUP_DIR"

cp "$APP_DIR/Iron_Management_Backend-0.0.1-SNAPSHOT.jar" "$BACKUP_DIR/"
tar -czf "$BACKUP_DIR/dist.tar.gz" -C "$APP_DIR/dist" .
```

Replace the frontend and backend artifacts:

```bash
APP_DIR=/home/ubuntu/ironman/react
DEPLOY_DIR=/tmp/ironman-deploy-YYYYMMDDHHMMSS

rm -rf "$APP_DIR/dist.new"
mkdir -p "$APP_DIR/dist.new"
tar -xzf "$DEPLOY_DIR/frontend-dist.tar.gz" -C "$APP_DIR/dist.new"
test -f "$APP_DIR/dist.new/index.html"

cp "$DEPLOY_DIR/Iron_Management_Backend-0.0.1-SNAPSHOT.jar" "$APP_DIR/Iron_Management_Backend-0.0.1-SNAPSHOT.jar"

rm -rf "$APP_DIR/dist.old"
mv "$APP_DIR/dist" "$APP_DIR/dist.old"
mv "$APP_DIR/dist.new" "$APP_DIR/dist"
chmod -R a+rX "$APP_DIR/dist"
```

### 4. Restart Backend and Reload Nginx

Restart the Spring Boot jar with production runtime variables:

```bash
APP_DIR=/home/ubuntu/ironman/react
JAR_NAME=Iron_Management_Backend-0.0.1-SNAPSHOT.jar

pkill -f "java -jar $JAR_NAME" || true

cd "$APP_DIR"
nohup env \
  SPRING_PROFILES_ACTIVE=prod \
  SERVER_PORT=8888 \
  SERVER_CONTEXT_PATH=/iron \
  DB_HOST=127.0.0.1 \
  DB_PORT=3306 \
  DB_NAME=iron_management \
  DB_USERNAME=iron_app \
  DB_PASSWORD='CHANGE_ME_ON_SERVER' \
  APP_TEMPLATE_PATH="$APP_DIR/template.docx" \
  APP_EXPORT_DIR=/tmp/ironman-exports \
  APP_CORS_ALLOWED_ORIGINS='https://your-domain.example' \
  APP_AUTH_ALLOW_LEGACY_PLAINTEXT_PASSWORDS=false \
  java -jar "$APP_DIR/$JAR_NAME" > "$APP_DIR/logName.log" 2>&1 &
```

Then reload Nginx:

```bash
nginx -t
systemctl reload nginx
```

### 5. Verify Deployment

Run these checks from the server or local machine:

```bash
curl -I http://106.54.35.68/
curl -i http://127.0.0.1:8888/iron/dashboard/home
curl -fsS http://127.0.0.1/
curl -i http://106.54.35.68/iron/dashboard/home
```

The root check must return `302` with `Location: http://106.54.35.68/login#/login`.
The unauthenticated dashboard checks must return `401`.

Check the backend process and logs:

```bash
ps -ef | grep "java -jar Iron_Management_Backend" | grep -v grep
tail -120 /home/ubuntu/ironman/react/logName.log
```

Rollback uses the latest backup under:

```bash
/home/ubuntu/ironman/react/backups/
```

## Delivery Notes
- Keep the frontend proxy at `/iron` so local dev and container deployment share the same API path.
- Keep Vite `base` as `/` for production. Do not use `./`, because refreshing nested frontend routes such as `/login` or `/home` makes the browser request `/login/assets/...`; Nginx then returns `index.html` instead of JavaScript and the page becomes blank.
- Avoid embedding host-specific absolute paths in backend code.
- For production, replace default passwords, rotate leaked passwords, and mount persistent database storage.

## Production Troubleshooting Notes

### Blank Page After Deployment

Symptom:

- `http://106.54.35.68/` returns HTML or `200 OK`, but the browser page is blank.
- Backend APIs such as `/iron/dashboard/home` still return normally.
- Direct frontend routes such as `/login` or `/home` may return HTML, but JavaScript does not run.

Root cause from the 2026-05-04 incident:

- Vite was built with `base: './'`.
- The generated HTML referenced JavaScript and CSS as `./assets/...`.
- When a user refreshed a nested frontend route, for example `/login`, the browser requested `/login/assets/...`.
- Nginx SPA fallback returned `index.html` for that missing asset path.
- The browser tried to load HTML as a JavaScript module, so React never mounted and the page stayed blank.

Fix:

- Keep `react-admin-design-main/vite.config.ts` production `base` as `/`.
- Rebuild locally with `pnpm build`.
- Upload and replace only the built `dist` on the server.
- Do not build on the server, because server memory is insufficient.

Verification:

```bash
curl -I http://106.54.35.68/assets/<current-entry>.js
curl -I http://106.54.35.68/login
curl -I http://106.54.35.68/home
```

Expected result:

- The asset request returns `Content-Type: application/javascript`.
- `/login` and `/home` return `index.html` that references `/assets/...`, not `./assets/...`.

### Root URL Does Not Open Login

Symptom:

- `http://106.54.35.68/login#/login` works.
- `http://106.54.35.68/` does not show the login page as expected.

Root cause from the 2026-05-04 incident:

- The app uses hash routing.
- The production entry URL expected by users is the bare root `/`.
- Root handling was not explicit enough at the Nginx layer.

Fix:

- Add an exact-match root redirect in Nginx:

```nginx
location = / {
  return 302 /login#/login;
}
```

- Keep this rule before the generic SPA fallback:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Verification:

```bash
curl -I http://106.54.35.68/
curl -I http://106.54.35.68/login
curl -i http://106.54.35.68/iron/dashboard/home
```

Expected result:

- `/` returns `302`.
- `Location` is `http://106.54.35.68/login#/login`.
- `/login` returns `200 OK`.
- `/iron/dashboard/home` returns `401` until a valid `Authorization` token is supplied.
