import pytest

pytest.importorskip("openpyxl")

from backend import excel_core


def test_compute_dep_aggregates_counts():
    dep_list = [
        {"equipo": "Equipo A", "codigo": "P", "descripcion": "desc"},
        {"equipo": "Equipo B", "codigo": "L", "descripcion": "desc"},
        {"equipo": "Equipo C", "codigo": "L", "descripcion": "desc"},
    ]
    total_dep, total_L, total_P, cub = excel_core.compute_dep_aggregates(dep_list)
    assert total_dep == 3
    assert total_L == 2
    assert total_P == 1
    assert cub == total_P / total_dep
