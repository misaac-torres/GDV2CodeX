from __future__ import annotations

from typing import List

from fastapi import APIRouter, HTTPException, status

from .. import excel_core
from ..schemas import FeedbackCreate, FeedbackEntry

router = APIRouter(prefix="/feedback", tags=["feedback"])


def _handle_excel_error(exc: Exception):
    if isinstance(exc, FileNotFoundError):
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    if isinstance(exc, PermissionError):
        raise HTTPException(status_code=status.HTTP_423_LOCKED, detail=str(exc)) from exc
    raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/", response_model=List[FeedbackEntry])
def get_feedback(limit: int = 8):
    try:
        return [FeedbackEntry(**row) for row in excel_core._get_last_suggestions(limit=limit)]
    except Exception as exc:  # pragma: no cover
        _handle_excel_error(exc)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_feedback(payload: FeedbackCreate):
    try:
        excel_core._append_suggestion(payload.usuario, payload.texto)
        return {"ok": True}
    except Exception as exc:  # pragma: no cover
        _handle_excel_error(exc)
