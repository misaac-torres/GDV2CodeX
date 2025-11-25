.PHONY: dev test prod

DEV_BACKEND=cd backend && uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
DEV_FRONTEND=cd frontend && npm run dev -- --host 0.0.0.0 --port 5173

# Ejecuta backend + frontend en modo desarrollo con recarga en caliente
# Usa CTRL+C para detener ambos procesos.
dev:
	$(DEV_BACKEND) & \
	$(DEV_FRONTEND)

# Ejecuta pruebas de backend (pytest) y frontend (vitest)
test:
	PYTHONPATH=. pytest backend/tests
	cd frontend && npm run test -- --runInBand

# Construye el frontend y levanta el backend apuntando al Excel real
prod:
	cd frontend && npm run build
	cd backend && uvicorn backend.main:app --host 0.0.0.0 --port 8000
