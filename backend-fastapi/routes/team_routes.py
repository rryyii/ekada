from fastapi import APIRouter, Depends
from typing import Annotated
from services.db_helper import Query
from services.db import check_cache, set_cache

router = APIRouter(prefix="/teams")

@router.get("/{team}/{tournament}")
async def team_info(team: str, tournament: str, db: Annotated[Query, Depends(Query)]):
    resource = await check_cache(f"team-{team}-{tournament}")
    if resource is None:
        response = await db.get_team(tournament, team)
        await set_cache(f"team={team}-{tournament}", response)
        return response
    return resource