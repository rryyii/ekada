from fastapi import APIRouter
from fastapi import Depends
import datetime
from ..services.db import get_db
from ..services.db_helper import Query
from sqlalchemy.orm import Session

router = APIRouter(prefix="/leagues")

@router.get("/game_data/{series:path}")
async def game_data(series: str, db: Session = Depends(get_db)):
    query = Query(db)
    response = query.get_game_data(series)
    return response

@router.get("/standings/{league:path}")
async def standings(league: str, db: Session = Depends(get_db)):
    query = Query(db)
    response = query.get_standings(league)
    return response 

@router.get("/match_schedule/{league}")
async def match_data(league: str, db: Session = Depends(get_db)):
    current_date = datetime.datetime.now(datetime.timezone.utc)
    query = Query(db)
    response = query.get_matches(league, current_date.year)
    return response

@router.get("/match_data/{league:path}")
async def specific_data(league: str,db: Session = Depends(get_db)):
    query = Query(db)
    response = query.get_smatches(league)
    return response

@router.get("/series/{series:path}")
async def series(series: str, db: Session = Depends(get_db)):
    query = Query(db)
    response = query.get_series(series)
    return response

@router.get("/split/{split}/{isInternational}")
async def split(split: str, isInternational : bool, db: Session = Depends(get_db)):
    current_date = datetime.datetime.now(datetime.timezone.utc)
    query = Query(db)
    response = query.get_split(split, current_date.year, isInternational)
    return response
