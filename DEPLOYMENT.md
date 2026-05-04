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

## Production Server Deployment

> **必须先在本地打包，不要在服务器上打包。服务器内存不足，禁止在服务器上执行 `mvn package`、`pnpm build`、`docker compose up --build` 等构建命令。**

Current production layout:

- Server: `106.54.35.68`
- Deploy directory: `/home/ubuntu/ironman/react`
- Backend jar: `/home/ubuntu/ironman/react/Iron_Management_Backend-0.0.1-SNAPSHOT.jar`
- Frontend static files: `/home/ubuntu/ironman/react/dist`
- Nginx serves `/home/ubuntu/ironman/react/dist` and proxies `/iron/` to `http://127.0.0.1:8888/iron/`
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
  DB_USERNAME=root \
  DB_PASSWORD='CHANGE_ME_ON_SERVER' \
  APP_TEMPLATE_PATH="$APP_DIR/template.docx" \
  APP_EXPORT_DIR=/tmp/ironman-exports \
  APP_CORS_ALLOWED_ORIGINS='http://106.54.35.68,http://localhost:8201,http://127.0.0.1:8201' \
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
curl -fsS http://127.0.0.1:8888/iron/dashboard/home
curl -fsS http://127.0.0.1/
curl -fsS http://106.54.35.68/iron/dashboard/home
```

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
- Avoid embedding host-specific absolute paths in backend code.
- For production, replace default passwords and mount persistent database storage.
