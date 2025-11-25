from __future__ import annotations

from typing import List

from fastapi import APIRouter, HTTPException, status

from .. import excel_core
from ..schemas import ExpertBoardProject, PrioritizationRequest, RatingRequest

router = APIRouter(prefix="/boards", tags=["boards"])


def _handle_excel_error(exc: Exception):
    if isinstance(exc, FileNotFoundError):
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    if isinstance(exc, PermissionError):
        raise HTTPException(status_code=status.HTTP_423_LOCKED, detail=str(exc)) from exc
    raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/experts", response_model=List[ExpertBoardProject])
def get_expert_board(tren: str | None = None, q: str | None = None, only_active: bool = True):
    try:
        projects = excel_core._collect_board_projects(tren_filter=tren)
        filtered = []
        for p in projects:
            if q and p.get("q_rad") not in (q, str(q)):
                continue
            filtered.append(p)
        return [ExpertBoardProject(**p) for p in filtered]
    except Exception as exc:  # pragma: no cover
        _handle_excel_error(exc)


@router.post("/experts/{project_id}/decision")
def set_expert_decision(project_id: str, payload: PrioritizationRequest):
    try:
        row = excel_core.find_project_row_by_id(project_id)
        if not row:
            raise HTTPException(status_code=404, detail=f"Proyecto {project_id} no encontrado")
        excel_core._update_expert_prioritization(row, payload.priorizado)
        return {"row": row, "priorizado": payload.priorizado}
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover
        _handle_excel_error(exc)


@router.get("/po-sync", response_model=List[ExpertBoardProject])
def get_po_sync_board(tren: str | None = None, q: str | None = None, only_pri: bool = False):
    try:
        projects = excel_core._collect_board_projects(tren_filter=tren)
        filtered = []
        for p in projects:
            if only_pri and (p.get("priorizado") or "").upper() != "SI":
                continue
            if q and p.get("q_rad") not in (q, str(q)):
                continue
            filtered.append(p)
        return [ExpertBoardProject(**p) for p in filtered]
    except Exception as exc:  # pragma: no cover
        _handle_excel_error(exc)


@router.post("/po-sync/{project_id}/rating")
def set_po_rating(project_id: str, payload: RatingRequest):
    try:
        row = excel_core.find_project_row_by_id(project_id)
        if not row:
            raise HTTPException(status_code=404, detail=f"Proyecto {project_id} no encontrado")
        rating = int(payload.rating)
        if rating < 1 or rating > 5:
            raise HTTPException(status_code=400, detail="Rating debe estar entre 1 y 5")
        excel_core._update_po_rating(row, rating)
        return {"row": row, "rating": rating}
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover
        _handle_excel_error(exc)
