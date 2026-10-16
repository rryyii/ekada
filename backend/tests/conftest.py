import datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from ..main import app
from ..models import Base, GameData, MatchData, Series, Split, Standings, Team
from ..services.db import get_db

YEAR = datetime.datetime.now(datetime.timezone.utc).year
SPLIT_NAME = f"LCK {YEAR} Split 1"


def seed(session: Session):
    session.add(Split(OverviewPage=f"LCK/{YEAR} Season/Split 1", Name=SPLIT_NAME))
    session.add(Series(
        SeriesKey=f"{SPLIT_NAME}_1", SplitKey=SPLIT_NAME,
        Team1="T1", Team1Score=2, Team2="Gen.G", Team2Score=1,
        Winner="T1", IsInternational=False,
    ))
    session.add(MatchData(
        SeriesKey=f"{SPLIT_NAME}_1", GameNumber=1, GameId=f"{SPLIT_NAME}_1_1",
        OverviewPage=f"LCK/{YEAR} Season/Split 1", Name="Game 1",
        MatchId=f"LCK/{YEAR} Season/ Split 1_Week 1_1",
        WinTeam="T1", Winner="1", Team1="T1", Team1Bans="", Team1Picks="",
        Team1Score=1, Team1Dragons=3, Team2Dragons=1, Team1Barons=1, Team2Barons=0,
        Team1VoidGrubs=4, Team2VoidGrubs=2, Team1Towers=9, Team2Towers=3,
        Team1RiftHeralds=1, Team2RiftHeralds=0, Team1Gold=60000, Team2Gold=50000,
        Team2="Gen.G", Team2Bans="", Team2Picks="", Team2Score=0,
        Split="Split 1", Patch="16.1", Vod="", GameLength="30:00", IsInternational=False,
    ))
    for name, team, role, champ, win in [
        ("Faker", "T1", "Mid", "Ahri", "Yes"),
        ("Chovy", "Gen.G", "Mid", "Azir", "No"),
    ]:
        session.add(GameData(
            Name=name, MatchId="m1", GameId=f"{SPLIT_NAME}_1_1", Team=team, Side="Blue",
            Role=role, PlayerWin=win, Champion=champ, Items="", Trinket="",
            Kills=5, Deaths=1, Assists=7, Gold=12000, CS=300, VisionScore=40,
            SummonerSpells="", Runes="", DamageToChampions=20000,
        ))
    session.add(Standings(
        LeagueName="LCK", Team="T1", Place=1, WinSeries=10, LossSeries=2,
        Streak="3", StreakDirection="W", Points=10,
    ))
    session.add(Team(
        TeamName="T1", Roles="Top;;Mid", RosterLinks="Doran;;Faker",
        Region="Korea", Split=SPLIT_NAME,
    ))
    session.commit()


@pytest.fixture
def engine():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        seed(session)
    yield engine
    engine.dispose()


@pytest.fixture
def session(engine):
    with Session(engine) as session:
        yield session


@pytest.fixture
def client(engine):
    def override_get_db():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()
