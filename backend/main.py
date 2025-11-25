from __future__ import annotations

import logging
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import config, excel_core
from .routers import api_boards, api_feedback, api_metrics, api_projects

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="GD_v1 Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def reload_catalogs():
    try:
        excel_core.load_catalogs()
        logger.info("Catálogos cargados correctamente desde %s", config.EXCEL_PATH)
    except Exception as exc:  # pragma: no cover
        logger.warning("No se pudieron cargar catálogos en startup: %s", exc)


app.include_router(api_projects.router)
app.include_router(api_metrics.router)
app.include_router(api_boards.router)
app.include_router(api_feedback.router)


@app.get("/health")
def healthcheck():
    return {"status": "ok"}


_frontend_dist = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if _frontend_dist.exists():
    app.mount("/", StaticFiles(directory=_frontend_dist, html=True), name="frontend")
