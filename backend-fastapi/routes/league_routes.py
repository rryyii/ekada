from fastapi import APIRouter, Depends
from typing import Annotated
import datetime
import json
from services.db_helper import Query
from services.db import check_cache, set_cache

router = APIRouter(prefix="/leagues")


@router.get("/match_schedule/{league}")
async def match_schedule(league: str, db: Annotated[Query, Depends(Query)]):
    current_date = datetime.datetime.now(datetime.timezone.utc)
    date_string = current_date.strftime('%Y-%m-%d')
    resource = await check_cache(f"match-schedule-{league}-{date_string}")
    if resource is None:
        response = db.get_matches(league, current_date.year)
        await set_cache(f"match-schedule-{league}-{date_string}", json.dumps(response))
        return response
    return resource

@router.get("/standings/{league:path}")
async def standings(league: str, db: Annotated[Query, Depends(Query)]):
    resource = await check_cache(f"standings-{league}")
    if resource is None:
        response = await db.get_standings(league)
        await set_cache(f"standings-{league}", json.dumps(response))
        return response
    return resource

@router.get("/match_data/{match:path}/{game}")
async def match_data(match: str, game: int, db: Annotated[Query, Depends(Query)]):
    resource = await check_cache(f"match-data-{match}-{game}")
    if resource is None:
        response = await db.get_match_data(match, game)
        await set_cache(f"match-data-{match}-{game}", json.dumps(response))
        return response
    return resource