from fastapi import FastAPI
from models import *
from services.db import engine

app = FastAPI(
    title="EkadaAPI",
    summary="Backend for Ekada using FastAPI"
)

Base.metadata.create_all(engine)


from routes import team_routes, image_routes, league_routes

app.include_router(league_routes.router)
app.include_router(team_routes.router)
app.include_router(image_routes.router)