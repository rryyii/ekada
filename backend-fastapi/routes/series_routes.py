from fastapi import APIRouter
from fastapi import Depends
from datetime import datetime
from ..services.db import get_db
from ..services.db_helper import Query
from sqlalchemy.orm import Session

router = APIRouter(prefix="/series")

@router.get("/tournament/{tournament:path}")
async def tournament(tournament: str, db: Session = Depends(get_db)):
    current_date = datetime.datetime.now(datetime.timezone.utc)
    query = Query(db)
    response = query.get_tournament(tournament, current_date.year)
    return response

@router.get("/champion_stats/{split:path}")
async def champion_stats(split: str, db: Session = Depends(get_db)):
    query = Query(db)
    response = query.get_champ_stats(split)
    return response