from api_worker import app
from db import engine
from sqlalchemy.orm import Session
from mwrogue.esports_client import EsportsClient
from mwrogue.auth_credentials import AuthCredentials
import datetime
import httpx
from models import *

latest_version = "16.9.1"

credentials = AuthCredentials(user_file="me")
session = Session(engine)
site = EsportsClient("lol", credentials=credentials).cargo_client

@app.task
def match_schedule(league: str) -> list:
    current_date = datetime.datetime.now(datetime.timezone.utc)
    date_string = current_date.strftime("%Y-%m-%d")
    response = site.query(
        tables=["MatchSchedule=MS", "Tournaments=TS", "ScoreboardGames=SG"],
        join_on=["MS.OverviewPage=TS.OverviewPage", "MS.MatchId=SG.MatchId"],
        fields=[
            "SG.WinTeam",
            "MS.Winner",
            "TS.League",
            "TS.Name",
            "MS.Team1",
            "SG.Team1Bans",
            "SG.Team1Picks",
            "MS.Team1Score",
            "SG.Team1Dragons",
            "SG.Team2Dragons",
            "SG.Team1Barons",
            "SG.Team2Barons",
            "SG.Team1VoidGrubs",
            "SG.Team2VoidGrubs",
            "SG.Team1Towers",
            "SG.Team2Towers",
            "SG.Team1RiftHeralds",
            "SG.Team2RiftHeralds",
            "SG.Team1Atakhans",
            "SG.Team2Atakhans",
            "SG.Team1Gold",
            "SG.Team2Gold",
            "MS.Team2",
            "SG.Team2Bans",
            "SG.Team2Picks",
            "MS.Team2Score",
            "TS.Split",
            "TS.OverviewPage",
            "MS.DateTime_UTC",
            "SG.Gamelength",
            "SG.Patch",
            "SG.VOD",
            "MS.MatchId",
        ],
        where=f"TS.Name LIKE \"{league}%\" AND MS.DateTime_UTC BETWEEN '{current_date.year - 1}-01-01' AND '{date_string}'",
        order_by="MS.DateTime_UTC DESC",
        limit=500,
    )
    for match in response:
        new = MatchSchedule(**match)
        session.add(new)
        session.commit()
    


@app.task
def standings(league: str) -> list:
    response = site.query(
        tables=["Standings"],
        fields=[
            "Standings.Team",
            "Standings.Place",
            "Standings.WinSeries",
            "Standings.LossSeries",
            "Standings.Streak",
            "Standings.StreakDirection",
            "Standings.Points",
        ],
        where=f'Standings.OverviewPage="{league}"',
        order_by="Standings.Place",
    )
    for team in response:
        new = Standings(**team)
        session.add(new)
        session.commit()


@app.task
def match_data(match: int, game: int) -> list:
    response = site.query(
        tables=["ScoreboardPlayers=SP"],
        fields=[
            "SP.DamageToChampions",
            "SP.Side",
            "SP.PlayerWin",
            "SP.MatchId",
            "SP.Team",
            "SP.Name",
            "SP.Role",
            "SP.Items",
            "SP.Trinket",
            "SP.CS",
            "SP.Runes",
            "SP.Kills",
            "SP.Deaths",
            "SP.Assists",
            "SP.Gold",
            "SP.VisionScore",
            "SP.Champion",
            "SP.SummonerSpells",
        ],
        where=f'SP.MatchId="{match}" AND SP.GameId="{match}_{game}"',
    )
    for match in response:
        new = MatchData(**match)
        session.add(new)
        session.commit()


@app.task
def team_info(tournament, team) -> list:
    response = site.query(
        tables=["TournamentRosters=TR"],
        fields=["TR.Team", "TR.RosterLinks", "TR.Roles", "TR.Region"],
        where=f'TR.Tournament="{tournament}" AND TR.Team="{team}"',
    )
    for team in response:
        new = Team(**team)
        session.add(new)
        session.commit()


@app.task
def get_spell(name: str) -> object:
    request = httpx.get(
        f"https://ddragon.leagueoflegends.com/cdn/{latest_version}/data/en_US/summoner.json"
    ).json()
    for spell in request["data"]:
        if spell == name:
            return {
                "url": f"https://ddragon.leagueoflegends.com/cdn/{latest_version}/img/spell/{spell['image']['full']}"
            }


@app.task
def get_item(name: str) -> object:
    request = httpx.get(
        f"https://ddragon.leagueoflegends.com/cdn/{latest_version}/data/en_US/item.json"
    ).json()
    for item in request["data"]:
        if item == name:
            return {
                "url": f"https://ddragon.leagueoflegends.com/cdn/{latest_version}/img/item/{item['image']['full']}"
            }
