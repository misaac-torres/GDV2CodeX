#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

BACK_CMD=(uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000)
FRONT_CMD=(npm run dev -- --host 0.0.0.0 --port 5173)

cleanup() {
  if [[ -n "${BACK_PID:-}" ]] && kill -0 "$BACK_PID" 2>/dev/null; then
    kill "$BACK_PID" 2>/dev/null || true
  fi
  if [[ -n "${FRONT_PID:-}" ]] && kill -0 "$FRONT_PID" 2>/dev/null; then
    kill "$FRONT_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

cd "$ROOT_DIR/backend"
"${BACK_CMD[@]}" &
BACK_PID=$!

cd "$ROOT_DIR/frontend"
"${FRONT_CMD[@]}" &
FRONT_PID=$!

cd "$ROOT_DIR"
echo "Backend listo en http://localhost:8000 (PID $BACK_PID)"
echo "Frontend listo en http://localhost:5173 (PID $FRONT_PID)"
echo "Presiona Ctrl+C para detener ambos servicios"

wait -n
