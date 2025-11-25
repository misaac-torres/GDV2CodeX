from __future__ import annotations

from typing import Any, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class Dependency(BaseModel):
    equipo: str
    codigo: str = Field(..., description="P o L")
    descripcion: Optional[str] = ""


class ProjectData(BaseModel):
    model_config = ConfigDict(extra="allow")

    ID: Optional[int] = None
    Q_RADICADO: Optional[str] = None
    PRIORIZADO: Optional[str] = None
    ESTADO_PROYECTO: Optional[str] = None
    NOMBRE_PROYECTO: Optional[str] = None
    DESCRIPCION_PROYECTO: Optional[str] = None
    RESPONSABLE_PROYECTO: Optional[str] = None
    AREA_SOLICITANTE: Optional[str] = None
    FECHA_INICIO: Optional[Any] = None
    FECHA_ESTIMADA_CIERRE: Optional[Any] = None
    LINEA_BASE: Optional[float] = None
    LINEA_BASE_Q_GESTION: Optional[float] = None
    AVANCE: Optional[float] = None
    ESTIMADO_AVANCE: Optional[float] = None
    PORC_CUMPLIMIENTO: Optional[float] = None
    CONTRIBUCION: Optional[float] = None
    INICIATIVA_ESTRATEGICA: Optional[str] = None
    TOTAL_DEP: Optional[float] = None
    TOTAL_L: Optional[float] = None
    TOTAL_P: Optional[float] = None
    CUBRIMIENTO_DEP: Optional[float] = None
    RATING_PO_SYNC: Optional[float] = None


class ProjectCreateRequest(BaseModel):
    project: ProjectData
    dep_list: List[Dependency] = []


class ProjectUpdateRequest(BaseModel):
    avance: Optional[float] = None
    estimado: Optional[float] = None
    dep_list: List[Dependency] = []


class ProjectSummary(BaseModel):
    id: Any
    nombre: Optional[str]
    estado: Optional[str]
    q_rad: Optional[str]
    avance: float
    estimado: float
    linea_base: float
    priorizado: Optional[str]
    linea_base_q_gestion: Optional[Any]
    porc_cumplimiento: float
    total_dep: float
    total_L: float
    total_P: float
    cubrimiento: float


class ProjectDetail(BaseModel):
    project: ProjectData
    dependencias: List[Dependency]
    total_dep: float
    total_L: float
    total_P: float
    cubrimiento: float


class MetricsResponse(BaseModel):
    total_projects: int
    total_dep: float
    total_L: float
    total_P: float
    cobertura_pct: float
    avg_avance: float
    avg_pri: float
    avg_no_pri: float
    num_pri: int


class ExpertBoardProject(BaseModel):
    row: int
    id: Any
    q_rad: Optional[str]
    estado: Optional[str]
    priorizado: Optional[str]
    nombre: Optional[str]
    descripcion_corta: Optional[str]
    contribucion: float
    inic_estrategica: Optional[str]
    total_dep: float
    total_L: float
    total_P: float
    cub: float
    rating_po: float
    pendientes_list: List[str]
    negociadas_list: List[str]


class RatingRequest(BaseModel):
    rating: int


class PrioritizationRequest(BaseModel):
    priorizado: str


class FeedbackCreate(BaseModel):
    usuario: str
    texto: str


class FeedbackEntry(BaseModel):
    usuario: str
    texto: str
