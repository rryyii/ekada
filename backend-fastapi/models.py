from datetime import datetime
from sqlalchemy import String, Integer, Boolean, Float, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class MatchData(Base):
    __tablename__ = "match_data"
    
    MatchId: Mapped[int] = mapped_column(primary_key=True)
    GameId: Mapped[str] = mapped_column(String(255))
    Team: Mapped[str] = mapped_column(String(255))
    Side: Mapped[str] = mapped_column(String(30))
    Name: Mapped[str] = mapped_column(String(255))
    Role: Mapped[str] = mapped_column(String(30))
    PlayerWin: Mapped[str] = mapped_column(String(5))
    Champion: Mapped[str] = mapped_column(String(20))
    Items: Mapped[str] = mapped_column(String(255))
    Trinket: Mapped[str] = mapped_column(String(255))
    Kills: Mapped[int] = mapped_column(Integer)
    Deaths: Mapped[int] = mapped_column(Integer)
    Assists: Mapped[int] = mapped_column(Integer)
    Gold: Mapped[int] = mapped_column(Integer)
    VisionScore: Mapped[int] = mapped_column(Integer)
    SummonerSpells: Mapped[str] = mapped_column(String(255))
    Runes: Mapped[str] = mapped_column(String(255))
    DamageToChampions: Mapped[int] = mapped_column(Integer)


class Standings(Base):
    __tablename__ = "standings"

    Id: Mapped[int] = mapped_column(primary_key=True)
    LeagueName: Mapped[str] = mapped_column(String(255))
    Team: Mapped[str] = mapped_column(String(255))
    Place: Mapped[int] = mapped_column(Integer)
    WinSeries: Mapped[int] = mapped_column(Integer)
    LossSeries: Mapped[int] = mapped_column(Integer)
    Streak: Mapped[str] = mapped_column(String(5))
    Points: Mapped[int] = mapped_column(Integer)


class MatchSchedule(Base):
    __tablename__ = "match_schedule"
    
    Id: Mapped[int] = mapped_column(primary_key=True)
    OverviewPage: Mapped[str] = mapped_column(String(255))
    Name: Mapped[str] = mapped_column(String(255))
    MatchId: Mapped[str] = mapped_column(String(255))
    WinTeam: Mapped[str] = mapped_column(String(255))
    Winner: Mapped[str] = mapped_column(String(255))
    Team1: Mapped[str] = mapped_column(String(255))
    Team1Bans: Mapped[str] = mapped_column(String(255))
    Team1Picks: Mapped[str] = mapped_column(String(255))
    Team1Score: Mapped[int] = mapped_column(Integer)
    Team1Dragons: Mapped[int] = mapped_column(Integer)
    Team2Dragons: Mapped[int] = mapped_column(Integer)
    Team1Barons: Mapped[int] = mapped_column(Integer)
    Team2Barons: Mapped[int] = mapped_column(Integer)
    Team1VoidGrubs: Mapped[int] = mapped_column(Integer)
    Team2VoidGrubs: Mapped[int] = mapped_column(Integer)
    Team1Towers: Mapped[int] = mapped_column(Integer)
    Team2Towers: Mapped[int] = mapped_column(Integer)
    Team1RiftHeralds: Mapped[int] = mapped_column(Integer)
    Team2RiftHeralds: Mapped[int] = mapped_column(Integer)
    Team1Atakhans: Mapped[int] = mapped_column(Integer)
    Team2Atakhans: Mapped[int] = mapped_column(Integer)
    Team1Gold: Mapped[int] = mapped_column(Integer)
    Team2Gold: Mapped[int] = mapped_column(Integer)
    Team2: Mapped[str] = mapped_column(String(255))
    Team2Bans: Mapped[str] = mapped_column(String(255))
    Team2Picks: Mapped[str] = mapped_column(String(255))
    Team2Score: Mapped[int] = mapped_column(Integer)
    Split: Mapped[str] = mapped_column(String(255))
    DateTime_UTC: Mapped[datetime] = mapped_column(DateTime)
    Gamelength: Mapped[float] = mapped_column(Float)
    Patch: Mapped[str] = mapped_column(String(255))
    Vod: Mapped[str] = mapped_column(String(255))
    IsInternational: Mapped[bool] = mapped_column(Boolean)


class Team(Base):
    __tablename__ = "team"
    
    Id: Mapped[int] = mapped_column(primary_key=True)
    TeamName: Mapped[str] = mapped_column(String(255))
    Roles: Mapped[str] = mapped_column(String(20))
    RosterLinks: Mapped[str] = mapped_column(String(255))
    Region: Mapped[str] = mapped_column(String(20))
    Tournament: Mapped[str] = mapped_column(String(255))
