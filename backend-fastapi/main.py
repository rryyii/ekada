from fastapi import FastAPI
from .models import Base
from .services.db import engine

app = FastAPI(
    title="EkadaAPI",
    summary="Backend for Ekada using FastAPI"
)


from .routes import team_routes
from .routes import series_routes
from .routes import image_routes
from .routes import league_routes

app.include_router(league_routes.router)
app.include_router(team_routes.router)
app.include_router(image_routes.router)
app.include_router(series_routes.router)