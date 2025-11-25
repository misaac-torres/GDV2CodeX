from __future__ import annotations

from typing import List

from fastapi import APIRouter, HTTPException, status

from .. import excel_core
from ..schemas import (
    Dependency,
    ProjectCreateRequest,
    ProjectDetail,
    ProjectSummary,
    ProjectUpdateRequest,
)

router = APIRouter(prefix="/projects", tags=["projects"])


def _handle_excel_error(exc: Exception):
    if isinstance(exc, FileNotFoundError):
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    if isinstance(exc, PermissionError):
        raise HTTPException(status_code=status.HTTP_423_LOCKED, detail=str(exc)) from exc
    raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/", response_model=List[ProjectSummary])
def list_projects():
    try:
        wb = excel_core.load_workbook()
        ws = excel_core.get_ws_proyectos(wb)
        id_idx = excel_core.column_index_from_string(excel_core.COLS["ID"])
        name_idx = excel_core.column_index_from_string(excel_core.COLS["NOMBRE_PROYECTO"])
        estado_idx = excel_core.column_index_from_string(excel_core.COLS["ESTADO_PROYECTO"])
        q_idx = excel_core.column_index_from_string(excel_core.COLS["Q_RADICADO"])
        avance_idx = excel_core.column_index_from_string(excel_core.COLS["AVANCE"])
        estimado_idx = excel_core.column_index_from_string(excel_core.COLS["ESTIMADO_AVANCE"])
        linea_base_idx = excel_core.column_index_from_string(excel_core.COLS["LINEA_BASE"])
        lb_q_idx = excel_core.column_index_from_string(excel_core.COLS["LINEA_BASE_Q_GESTION"])
        pri_idx = excel_core.column_index_from_string(excel_core.COLS["PRIORIZADO"])
        pct_idx = excel_core.column_index_from_string(excel_core.COLS["PORC_CUMPLIMIENTO"])
        total_dep_idx = excel_core.column_index_from_string(excel_core.COLS["TOTAL_DEP"])
        total_L_idx = excel_core.column_index_from_string(excel_core.COLS["TOTAL_L"])
        total_P_idx = excel_core.column_index_from_string(excel_core.COLS["TOTAL_P"])
        cub_idx = excel_core.column_index_from_string(excel_core.COLS["CUBRIMIENTO_DEP"])

        projects: List[ProjectSummary] = []
        for row in range(excel_core.START_ROW_PROYECTOS, ws.max_row + 1):
            id_val = ws.cell(row=row, column=id_idx).value
            name_val = ws.cell(row=row, column=name_idx).value
            if id_val in (None, "") and name_val in (None, ""):
                continue

            project = ProjectSummary(
                id=id_val,
                nombre=name_val,
                estado=ws.cell(row=row, column=estado_idx).value,
                q_rad=ws.cell(row=row, column=q_idx).value,
                avance=excel_core.to_num_cell(ws.cell(row=row, column=avance_idx).value),
                estimado=excel_core.to_num_cell(ws.cell(row=row, column=estimado_idx).value),
                linea_base=excel_core.to_num_cell(ws.cell(row=row, column=linea_base_idx).value),
                priorizado=(
                    str(ws.cell(row=row, column=pri_idx).value).strip().upper()
                    if ws.cell(row=row, column=pri_idx).value not in (None, "")
                    else ""
                ),
                linea_base_q_gestion=ws.cell(row=row, column=lb_q_idx).value,
                porc_cumplimiento=excel_core.to_num_cell(ws.cell(row=row, column=pct_idx).value),
                total_dep=excel_core.to_num_cell(ws.cell(row=row, column=total_dep_idx).value),
                total_L=excel_core.to_num_cell(ws.cell(row=row, column=total_L_idx).value),
                total_P=excel_core.to_num_cell(ws.cell(row=row, column=total_P_idx).value),
                cubrimiento=excel_core.to_num_cell(ws.cell(row=row, column=cub_idx).value),
            )
            projects.append(project)

        return projects
    except Exception as exc:  # pragma: no cover - delega en handle
        _handle_excel_error(exc)


@router.get("/{project_id}", response_model=ProjectDetail)
def get_project(project_id: str):
    try:
        row = excel_core.find_project_row_by_id(project_id)
        if not row:
            raise HTTPException(status_code=404, detail=f"Proyecto {project_id} no encontrado")
        summary = excel_core.summarize_project_by_row(row)
        return ProjectDetail(
            project=summary["project"],
            dependencias=[Dependency(**d) for d in summary["dependencias"]],
            total_dep=summary["total_dep"],
            total_L=summary["total_L"],
            total_P=summary["total_P"],
            cubrimiento=summary["cubrimiento"],
        )
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover
        _handle_excel_error(exc)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreateRequest):
    try:
        row, pid = excel_core.write_project_with_dependencies(
            payload.project.model_dump(), [d.model_dump() for d in payload.dep_list]
        )
        return {"row": row, "id": pid}
    except Exception as exc:  # pragma: no cover
        _handle_excel_error(exc)


@router.patch("/{project_id}")
def update_project(project_id: str, payload: ProjectUpdateRequest):
    try:
        row = excel_core.find_project_row_by_id(project_id)
        if not row:
            raise HTTPException(status_code=404, detail=f"Proyecto {project_id} no encontrado")
        result = excel_core.update_project_row_and_dependencies(
            row,
            payload.avance,
            payload.estimado,
            [d.model_dump() for d in payload.dep_list],
        )
        return result
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover
        _handle_excel_error(exc)
