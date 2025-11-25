from __future__ import annotations

import os
from pathlib import Path

try:  # python-dotenv es opcional para entornos sin dependencia instalada
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover - fallback para entornos mínimos
    def load_dotenv(*args, **kwargs):
        return None

load_dotenv()

ROOT_DIR = Path(__file__).resolve().parent.parent
DEFAULT_EXCEL_PATH = ROOT_DIR / "data" / "GD_v1.xlsx"


def get_excel_path() -> Path:
    env_path = os.getenv("GD_EXCEL_PATH")
    if env_path:
        return Path(env_path).expanduser()
    return DEFAULT_EXCEL_PATH


EXCEL_PATH = get_excel_path()
