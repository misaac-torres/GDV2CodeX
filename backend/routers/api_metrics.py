from __future__ import annotations

from fastapi import APIRouter, HTTPException

from .. import excel_core
from ..schemas import MetricsResponse

router = APIRouter(prefix="/metrics", tags=["metrics"])


def _handle_excel_error(exc: Exception):
    if isinstance(exc, FileNotFoundError):
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    if isinstance(exc, PermissionError):
        raise HTTPException(status_code=423, detail=str(exc)) from exc
    raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/", response_model=MetricsResponse)
def get_metrics(scope: str = "all", filter: str | None = None):
    try:
        return excel_core.compute_metrics(scope=scope, filter_value=filter)
    except Exception as exc:  # pragma: no cover
        _handle_excel_error(exc)
