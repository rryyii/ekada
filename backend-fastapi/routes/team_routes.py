from fastapi import APIRouter
from fastapi import Depends
from typing import Annotated
from sqlalchemy.orm import Session
from..services.db import get_db
from ..services.db_helper import Query
from ..services.db import check_cache

router = APIRouter(prefix="/teams")

@router.get("/recent_matches/{team}/{split:path}")
async def recent_matches(team: str, split: str, db: Session = Depends(get_db)):
    query = Query(db)
    response = query.get_recent(team, split)
    return response

@router.get("/{team}/{split:path}")
async def team_info(team: str, split: str, db: Session = Depends(get_db)):
    query = Query(db)
    response = query.get_team(team, split)
    return response
