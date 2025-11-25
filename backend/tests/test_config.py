import importlib
from pathlib import Path

def test_excel_path_env_override(monkeypatch, tmp_path):
    temp_file = tmp_path / "file.xlsx"
    temp_file.write_text("")
    monkeypatch.setenv("GD_EXCEL_PATH", str(temp_file))
    from backend import config as cfg

    importlib.reload(cfg)
    assert cfg.get_excel_path() == Path(str(temp_file))
