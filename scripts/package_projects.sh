#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/react-admin-design-main"
BACKEND_DIR="$ROOT_DIR/iron-management-backend"
OUTPUT_ROOT="${1:-$ROOT_DIR/release}"
TS="$(date +%Y%m%d_%H%M%S)"
OUTPUT_DIR="$OUTPUT_ROOT/$TS"

mkdir -p "$OUTPUT_DIR"

echo "[1/4] Building frontend in $FRONTEND_DIR"
cd "$FRONTEND_DIR"
pnpm install --frozen-lockfile --ignore-scripts
pnpm build

if [[ ! -d "$FRONTEND_DIR/dist" ]]; then
  echo "Frontend build output not found: $FRONTEND_DIR/dist" >&2
  exit 1
fi
cp -a "$FRONTEND_DIR/dist" "$OUTPUT_DIR/frontend-dist"

echo "[2/4] Building backend in $BACKEND_DIR"
cd "$BACKEND_DIR"
mvn -B clean package -DskipTests

BACKEND_JAR="$(ls -1 "$BACKEND_DIR"/target/*.jar | grep -v 'original-' | head -n 1 || true)"
if [[ -z "$BACKEND_JAR" ]]; then
  echo "Backend JAR not found in $BACKEND_DIR/target" >&2
  exit 1
fi
cp -a "$BACKEND_JAR" "$OUTPUT_DIR/"

echo "[3/4] Writing metadata"
cat > "$OUTPUT_DIR/BUILD_INFO.txt" <<META
Build time: $TS
Frontend source: $FRONTEND_DIR
Backend source: $BACKEND_DIR
Backend artifact: $(basename "$BACKEND_JAR")
META

ln -sfn "$OUTPUT_DIR" "$OUTPUT_ROOT/latest"

echo "[4/4] Done"
echo "Frontend artifact: $OUTPUT_DIR/frontend-dist"
echo "Backend artifact: $OUTPUT_DIR/$(basename "$BACKEND_JAR")"
echo "Latest symlink: $OUTPUT_ROOT/latest"
