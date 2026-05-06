from fastapi import APIRouter, Depends
from typing import Annotated
from services.db_helper import Query

router = APIRouter(prefix="/images")

@router.get("/summoner_spell/{spell:path}")
async def get_summoner_spell(spell: str, db: Annotated[Query, Depends(Query)]):
    return await db.get_spell(spell)


@router.get("/item/{item:path}")
async def get_item(item: str, db: Annotated[Query, Depends(Query)]):
    return await db.get_item(item)