from sqlalchemy import String
from sqlalchemy import Integer
from sqlalchemy import Boolean
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime
from sqlalchemy import Float
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

class Base(DeclarativeBase):
    pass

class GameData(Base):
    __tablename__ = "game_data"
    
    Id: Mapped[int] = mapped_column(primary_key=True)
    Name: Mapped[str] = mapped_column(String(255))
    MatchId: Mapped[str] = mapped_column(String(255))
    Match: Mapped["MatchData"] = relationship(back_populates="Game")
    GameId: Mapped[str] = mapped_column(ForeignKey("match_data.GameId"))
    Team: Mapped[str] = mapped_column(String(255))
    Side: Mapped[str] = mapped_column(String(30))
    Role: Mapped[str] = mapped_column(String(30))
    PlayerWin: Mapped[str] = mapped_column(String(5))
    Champion: Mapped[str] = mapped_column(String(20))
    Items: Mapped[str] = mapped_column(String(255))
    Trinket: Mapped[str] = mapped_column(String(255))
    Kills: Mapped[int] = mapped_column(Integer)
    Deaths: Mapped[int] = mapped_column(Integer)
    Assists: Mapped[int] = mapped_column(Integer)
    Gold: Mapped[int] = mapped_column(Integer)
    CS: Mapped[int] = mapped_column(Integer)
    VisionScore: Mapped[int] = mapped_column(Integer)
    SummonerSpells: Mapped[str] = mapped_column(String(255))
    Runes: Mapped[str] = mapped_column(String(255))
    DamageToChampions: Mapped[int] = mapped_column(Integer)



class MatchData(Base):
    __tablename__ = "match_data"
    
    Id: Mapped[int] = mapped_column(primary_key=True)
    SeriesKey: Mapped[str] = mapped_column(ForeignKey("series.SeriesKey"))
    Series: Mapped["Series"] = relationship(back_populates="Games")
    Game: Mapped[list["GameData"]] = relationship(back_populates="Match")
    GameNumber: Mapped[int] = mapped_column(Integer)
    GameId: Mapped[str] = mapped_column(String(255), unique=True)
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
    Team1Gold: Mapped[int] = mapped_column(Integer)
    Team2Gold: Mapped[int] = mapped_column(Integer)
    Team2: Mapped[str] = mapped_column(String(255))
    Team2Bans: Mapped[str] = mapped_column(String(255))
    Team2Picks: Mapped[str] = mapped_column(String(255))
    Team2Score: Mapped[int] = mapped_column(Integer)
    Split: Mapped[str] = mapped_column(String(255))
    Patch: Mapped[str] = mapped_column(String(255))
    Vod: Mapped[str] = mapped_column(String(255))
    GameLength: Mapped[float] = mapped_column(Float)
    Date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=True)
    IsInternational: Mapped[bool] = mapped_column(Boolean)
    
    
class Series(Base):
    __tablename__ = "series"
    
    Id: Mapped[int] = mapped_column(primary_key=True)
    SeriesKey: Mapped[str] = mapped_column(String(255), unique=True)
    Games: Mapped[list["MatchData"]] = relationship(back_populates="Series")
    SplitKey: Mapped[int] = mapped_column(ForeignKey("split.Name"))
    Split: Mapped["Split"] = relationship(back_populates="SplitSeries")
    Team1: Mapped[str] = mapped_column(String(100))
    Team1Score: Mapped[int] = mapped_column(Integer)
    Team2: Mapped[str] = mapped_column(String(100))
    Team2Score: Mapped[int] = mapped_column(Integer)
    Winner: Mapped[str] = mapped_column(String(100))
    Date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=True)
    IsInternational: Mapped[bool] = mapped_column(Boolean)


class Split(Base):
    __tablename__ = "split"
    
    Id: Mapped[int] = mapped_column(primary_key=True)
    OverviewPage: Mapped[str] = mapped_column(String(255))
    Name: Mapped[str] = mapped_column(String(100), unique=True)
    SplitSeries: Mapped[list["Series"]] = relationship(back_populates="Split")
    Date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=True)


class Standings(Base):
    __tablename__ = "standings"

    Id: Mapped[int] = mapped_column(primary_key=True)
    LeagueName: Mapped[str] = mapped_column(String(255))
    Team: Mapped[str] = mapped_column(String(255))
    Place: Mapped[int] = mapped_column(Integer)
    WinSeries: Mapped[int] = mapped_column(Integer)
    LossSeries: Mapped[int] = mapped_column(Integer)
    Streak: Mapped[str] = mapped_column(String(5))
    StreakDirection: Mapped[str] = mapped_column(String(1))
    Points: Mapped[int] = mapped_column(Integer)


class Team(Base):
    __tablename__ = "team"
    
    Id: Mapped[int] = mapped_column(primary_key=True)
    TeamName: Mapped[str] = mapped_column(String(255))
    Roles: Mapped[str] = mapped_column(String(255))
    RosterLinks: Mapped[str] = mapped_column(String(255))
    Region: Mapped[str] = mapped_column(String(20))
    Split: Mapped[str] = mapped_column(String(255))