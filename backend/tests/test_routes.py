from .conftest import SPLIT_NAME


def test_standings(client):
    response = client.get("/leagues/standings/LCK")
    assert response.status_code == 200
    assert response.json()[0]["Team"] == "T1"


def test_standings_not_found(client):
    response = client.get("/leagues/standings/LEC")
    assert response.status_code == 404


def test_match_schedule(client):
    response = client.get("/leagues/match_schedule/LCK")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_split(client):
    response = client.get("/leagues/split/LCK/false")
    assert response.status_code == 200
    assert response.json()[0]["Name"] == SPLIT_NAME


def test_series(client):
    response = client.get(f"/leagues/series/{SPLIT_NAME}")
    assert response.status_code == 200
    assert response.json()[0]["Team1Score"] == 2


def test_game_data(client):
    response = client.get(f"/leagues/game_data/{SPLIT_NAME}_1")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_team_info(client):
    response = client.get(f"/teams/T1/{SPLIT_NAME}")
    assert response.status_code == 200
    assert response.json()[0]["Region"] == "Korea"


def test_recent_matches(client):
    response = client.get(f"/teams/recent_matches/T1/{SPLIT_NAME}")
    assert response.status_code == 200


def test_champion_stats(client):
    response = client.get(f"/series/champion_stats/{SPLIT_NAME}/Mid/None")
    assert response.status_code == 200
    assert len(response.json()) == 2
