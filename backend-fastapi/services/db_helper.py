from .db import engine
from sqlalchemy import select
from sqlalchemy.orm import Session
from models import *

class Query():
    
    def __init__(self):
        self.session = Session(engine)
    
    def get_matches(self, league: str, year: int): 
        clause = f"{league}/{year} Season/"
        statement = select(MatchSchedule).where(MatchSchedule.Id.like(clause))
        return self.session.scalars(statement).all()
    
    def get_standings(self, league: str):
        statement = select(Standings).where(Standings.LeagueName.is_(league))
        return self.session.scalars(statement).all()
    
    def get_match_data(self, match: str, game: int):
        statement = select(MatchData).where(MatchData.MatchId.is_(match)).where(MatchData.GameId.is_(game))
        return self.session.scalars(statement).all()
    
    def get_team(self, team: str, tournament: str):
        statement = select(Team).where(Team.TeamName.is_(team)).where(Team.Tournament.is_(tournament))
        return self.session.scalars(statement).all()