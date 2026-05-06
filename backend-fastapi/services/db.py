from sqlalchemy import create_engine
from redis.asyncio import Redis

engine = create_engine(
    url="mysql+pymysql://root@127.0.0.1:3306/ekada",
    echo=True
)

client = Redis(
    host="localhost",
    port=6379,
    db=0,
    decode_responses=True
)

async def check_cache(key: str):
    item = await client.get(key)
    if item != None:
        return item

async def set_cache(key: str, item: any):
    await client.set(key, item)
