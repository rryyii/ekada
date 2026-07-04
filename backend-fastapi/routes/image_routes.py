from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from ..services.db import get_db
from typing import Annotated
from ..services.db_helper import Query

router = APIRouter(prefix="/images")

@router.get("/summoner_spell/{spell:path}")
async def get_summoner_spell(spell: str, db: Session = Depends(get_db)):
    return db.get_spell(spell)


@router.get("/item/{item:path}")
async def get_item(item: str, db: Session = Depends(get_db)):
    return db.get_item(item)