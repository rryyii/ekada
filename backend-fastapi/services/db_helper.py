from .db import engine
from sqlalchemy import select, func, case
from sqlalchemy.orm import Session
from fastapi import HTTPException
from ..models import *
import httpx

class Query():
    
    def __init__(self, session: Session):
        self.session = session
        self.latest_version = "16.13.1"
    
    def get_matches(self, league: str, year: int): 
        clause = f"{league}/{year} Season/"
        statement = select(MatchData).where(MatchData.MatchId.like(f"{clause} %"))
        result = self.session.scalars(statement).all()
        if not result:
            raise HTTPException(status_code=404, detail="Match schedules not found")
        return result

    def get_smatches(self, league: str): 
        statement = select(MatchData).where(MatchData.GameId==(league))
        result = self.session.scalars(statement).all()
        if not result:
            raise HTTPException(status_code=404, detail="Match schedules not found")
        return result
    
    def get_series(self, splitKey: str):
        statement = select(Series).where(Series.SplitKey==(splitKey))
        result = self.session.scalars(statement).all()
        if not result:
            raise HTTPException(status_code=404, detail="Series information not found")
        return result
    
    def get_split(self, split: str, year: int):
        clause = f"{split} {year}"
        statement = select(Split).where(Split.Name.like(f"{clause} %"))
        result = self.session.scalars(statement).all()
        if not result:
            raise HTTPException(status_code=404, detail="Split information not found")
        return result
    
    def get_standings(self, league: str):
        statement = select(Standings).where(Standings.LeagueName==(league))
        result = self.session.scalars(statement).all()
        if not result:
            raise HTTPException(status_code=404, detail="League standings not found")
        return result
    
    def get_game_data(self, series: str):
        statement = select(GameData).where(GameData.GameId.startswith(f"{series}_"))
        result = self.session.scalars(statement).all()
        if not result:
            raise HTTPException(status_code=404, detail="Game data not found")
        return result

    def get_team(self, team: str, split: str):
        statement = select(Team).where(Team.TeamName==(team)).where(Team.Split.like(f"{split}"))
        result = self.session.scalars(statement).all()
        if not result:
            raise HTTPException(status_code=404, detail="Team Data not found")
        return result
    
    def get_recent(self, team: str, split: str):
        statement = select(Series).where((Series.Team1==(team)) | (Series.Team2==(team))).where(Series.SeriesKey.startswith(f"{split}_")).limit(5)
        result = self.session.scalars(statement).all()
        if not result:
            raise HTTPException(status_code=404, detail="Failed to get recent matches")
        return result
    
    def get_champ_stats(self, split: str, role: str, team: str):
        statement = select(
                GameData.Champion,
                GameData.Role,
                func.count(GameData.Champion),
                func.sum(case((GameData.PlayerWin=="Yes", 1), else_=0)).label("win_count"),
                func.avg(GameData.Kills).label("avg_kills"),
                func.avg(GameData.Deaths).label("avg_deaths"),
                func.avg(GameData.Assists).label("avg_assists"),
            ).group_by(GameData.Champion, GameData.Role).where(GameData.GameId.startswith(f"{split}_")).order_by(GameData.Role)
        if role != "default":
            statement = statement.where(GameData.Role.like(role)) 
        if team != "None":
            statement = statement.where(GameData.Team.like(team))
        result = self.session.execute(statement).all()
        if not result:
                raise HTTPException(status_code=404, detail="Failed to aggregate champion data")
        return [dict(row._mapping) for row in result]


    def get_spell(self, name):
        request = httpx.get(
            f"https://ddragon.leagueoflegends.com/cdn/{self.latest_version}/data/en_US/summoner.json"
        ).json()
        for spell in request["data"]:
            if spell == name:
                return {
                    "url": f"https://ddragon.leagueoflegends.com/cdn/{self.latest_version}/img/spell/{spell['image']['full']}"
                }

    def get_item(self, name):
        request = httpx.get(
            f"https://ddragon.leagueoflegends.com/cdn/{self.latest_version}/data/en_US/item.json"
        ).json()
        for item in request["data"]:
            if item == name:
                return {
                    "url": f"https://ddragon.leagueoflegends.com/cdn/{self.latest_version}/img/item/{item['image']['full']}"
                }