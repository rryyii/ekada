from fastapi import APIRouter
from fastapi import Depends
from typing import Annotated
import datetime
import json
from ..services.db import get_db
from ..services.db_helper import Query
from sqlalchemy.orm import Session
from ..services.db import check_cache

router = APIRouter(prefix="/leagues")

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
async def series(series: str,db: Session = Depends(get_db)):
    current_date = datetime.datetime.now(datetime.timezone.utc)
    query = Query(db)
    response = query.get_series(series)
    return response

@router.get("/split/{split}")
async def split(split: str, db: Session = Depends(get_db)):
    current_date = datetime.datetime.now(datetime.timezone.utc)
    query = Query(db)
    response = query.get_split(split, current_date.year)
    return response

@router.get("/tournament/{tournament:path}")
async def tournament(tournament: str, db: Session = Depends(get_db)):
    current_date = datetime.datetime.now(datetime.timezone.utc)
    query = Query(db)
    response = query.get_tournament(tournament, current_date.year)
    return response

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