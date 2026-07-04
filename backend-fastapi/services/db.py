from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from redis.asyncio import Redis
from typing import Any

engine = create_engine(
    url="mysql+pymysql://root@127.0.0.1:3306/ekada",
    echo=True,
    pool_pre_ping=True,
)

client = Redis(
    host="localhost",
    port=6379,
    db=0,
    decode_responses=True
)

async def check_cache(key: str, item: any):
    value = await client.set(key, item, nx=True, get=True)
    if value is None:
        value = item
    return value

def get_db():
    with Session(engine) as session:
        yield session