import pytest
from fastapi import HTTPException

from ..services.db_helper import Query
from .conftest import SPLIT_NAME, YEAR


def test_get_matches_returns_matches_for_league(session):
    result = Query(session).get_matches("LCK", YEAR)
    assert len(result) == 1
    assert result[0].Team1 == "T1"


def test_get_matches_raises_404_for_unknown_league(session):
    with pytest.raises(HTTPException) as exc:
        Query(session).get_matches("LEC", YEAR)
    assert exc.value.status_code == 404


def test_get_split_regional(session):
    result = Query(session).get_split("LCK", YEAR, False)
    assert [s.Name for s in result] == [SPLIT_NAME]


def test_get_split_international_requires_exact_name(session):
    with pytest.raises(HTTPException):
        Query(session).get_split("LCK", YEAR, True)


def test_get_series(session):
    result = Query(session).get_series(SPLIT_NAME)
    assert result[0].Winner == "T1"


def test_get_game_data_matches_series_prefix(session):
    result = Query(session).get_game_data(f"{SPLIT_NAME}_1")
    assert {p.Name for p in result} == {"Faker", "Chovy"}


def test_get_recent(session):
    result = Query(session).get_recent("Gen.G", SPLIT_NAME)
    assert len(result) == 1


def test_get_champ_stats_all_roles(session):
    result = Query(session).get_champ_stats(SPLIT_NAME, "default", "None")
    by_champ = {row["Champion"]: row for row in result}
    assert set(by_champ) == {"Ahri", "Azir"}
    assert by_champ["Ahri"]["win_count"] == 1
    assert by_champ["Azir"]["win_count"] == 0


def test_get_champ_stats_filters_by_team(session):
    result = Query(session).get_champ_stats(SPLIT_NAME, "Mid", "T1")
    assert [row["Champion"] for row in result] == ["Ahri"]
