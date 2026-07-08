from api_worker import app
from .db import engine
from sqlalchemy.orm import Session
from mwrogue.esports_client import EsportsClient
from mwrogue.auth_credentials import AuthCredentials
from datetime import datetime
from datetime import timezone
import httpx
from models import *

latest_version = "16.9.1"

credentials = AuthCredentials(user_file="me")
session = Session(engine)
site = EsportsClient("lol", credentials=credentials).cargo_client

def parse_cargo_datetime(value: str | None) -> datetime | None:
    if not value:
        return None
    return datetime.strptime(value, "%Y-%m-%d %H:%M:%S")

@app.task
def match_data(league: str):
    current_date = datetime.now(timezone.utc)
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
            "SG.GameId"
        ],
        where=f"TS.Name LIKE \"{league} %\" AND MS.DateTime_UTC BETWEEN '{current_date.year - 1}-01-01' AND '{date_string}'",
        order_by="MS.DateTime_UTC DESC",
        limit=25,
    )
    for match in response:
        new = MatchData()

        new.MatchId = match["MatchId"]
        new.GameId = match["GameId"]
        new.WinTeam = match["WinTeam"]
        new.Winner = match["Winner"]
        new.Name = match["Name"]
        new.Team1 = match["Team1"]
        new.Team1Bans = match["Team1Bans"]
        new.Team1Picks = match["Team1Picks"]
        new.Team1Score = match["Team1Score"]
        new.Team1Dragons = match["Team1Dragons"]
        new.Team1Barons = match["Team1Barons"]
        new.Team1VoidGrubs = match["Team1VoidGrubs"]
        new.Team1Towers = match["Team1Towers"]
        new.Team1RiftHeralds = match["Team1RiftHeralds"]
        new.Team1Gold = match["Team1Gold"]
        new.IsInternational = False
        new.GameLength = match["Gamelength"]
        new.Team2 = match["Team2"]
        new.Team2Bans = match["Team2Bans"]
        new.Team2Picks = match["Team2Picks"]
        new.Team2Score = match["Team2Score"]
        new.Team2Dragons = match["Team2Dragons"]
        new.Team2Barons = match["Team2Barons"]
        new.Team2VoidGrubs = match["Team2VoidGrubs"]
        new.Team2Towers = match["Team2Towers"]
        new.Team2RiftHeralds = match["Team2RiftHeralds"]
        new.Team2Gold = match["Team2Gold"]

        new.OverviewPage = match["OverviewPage"]
        new.Split = match["Split"]
        new.Patch = match["Patch"]
        new.Date = match["DateTime UTC"]
        new.Vod = match["VOD"]

        _, gameNumber = match["MatchId"].rsplit("_", 1)
        new.SeriesKey = match["MatchId"]
        new.GameNumber = int(gameNumber)
        seriesHandler(new, tournament_name=match["Name"], overview_page=match["OverviewPage"])
        teamHandler(match["OverviewPage"], match["Team1"])
        teamHandler(match["OverviewPage"], match["Team2"])
        session.add(new)
        session.commit()

        game_data(match_id=match["MatchId"], game_id=match["GameId"])


def game_data(match_id: str, game_id: str):
    response = site.query(
        tables=["ScoreboardPlayers=SP"],
        fields=[
            "SP.DamageToChampions",
            "SP.MatchId",
            "SP.GameId",
            "SP.Side",
            "SP.PlayerWin",
            "SP.Team",
            "SP.Name",
            "SP.Role_Number",
            "SP.Role",
            "SP.Items",
            "SP.Trinket",
            "SP.Runes",
            "SP.Kills",
            "SP.Deaths",
            "SP.Assists",
            "SP.Gold",
            "SP.CS",
            "SP.VisionScore",
            "SP.Champion",
            "SP.SummonerSpells",
        ],
        where=f'SP.GameId="{game_id}"',
        order_by="SP.Role_Number ASC",
    )
    for player in response:
        new = GameData(
            Name=player["Name"],
            MatchId=match_id,
            GameId=game_id,
            Team=player["Team"],
            Side=player["Side"],
            Role=player["Role"],
            Runes=player["Runes"],
            Champion=player["Champion"],
            CS=player["CS"],
            PlayerWin=player["PlayerWin"],
            Items=player["Items"],
            Trinket=player["Trinket"],
            Kills=player["Kills"],
            Deaths=player["Deaths"],
            Assists=player["Assists"],
            Gold=player["Gold"],
            VisionScore=player["VisionScore"],
            SummonerSpells=player["SummonerSpells"],
            DamageToChampions=player["DamageToChampions"]
        )
        session.add(new)
    session.commit()

def seriesHandler(match: str, tournament_name: str, overview_page: str):
    existing = session.query(Series).filter_by(SeriesKey=match.SeriesKey).one_or_none()
    if existing:
        return existing

    split = splitHandler(tournament_name=tournament_name, date=match.Date, overview_page=overview_page)
    new = Series(
        SeriesKey=match.SeriesKey,
        Team1=match.Team1,
        Team2=match.Team2,
        Team1Score=match.Team1Score,
        Team2Score=match.Team2Score,
        Winner=match.Winner,
        IsInternational=match.IsInternational,
        Split=split,
        Date=match.Date
    )
    session.add(new)
    session.commit()
    return new


def splitHandler(tournament_name: str, date: datetime, overview_page: str):
    if not tournament_name:
        return None

    existing = session.query(Split).filter_by(Name=tournament_name).one_or_none()
    if existing:
        return existing
    new = Split(
        Name=tournament_name,
        OverviewPage=overview_page,
        Date=date
    )
    handleStandings(overview_page)
    session.add(new)
    session.commit()
    return new

def handleStandings(overview_page):
    response = site.query(
        tables=["Standings"],
        fields=[
            "Standings.PageAndTeam",
            "Standings.OverviewPage",
            "Standings.Team",
            "Standings.Place",
            "Standings.WinSeries",
            "Standings.LossSeries",
            "Standings.Streak",
            "Standings.StreakDirection",
            "Standings.Points",
        ],
        where=f'Standings.OverviewPage="{overview_page}"',
        order_by="Standings.Place",
    )
    for entry in response:
        new = Standings(
            LeagueName=entry["OverviewPage"],
            Team=entry["Team"],
            Place=entry["Place"],
            WinSeries=entry["WinSeries"],
            LossSeries=entry["LossSeries"],
            Streak=entry["Streak"],
            StreakDirection=entry["StreakDirection"],
            Points=entry["Points"]
        )
        session.add(new)
    session.commit()

def teamHandler(name, team):
    existing = session.query(Team).filter_by(TeamName=team, Split=name).one_or_none()
    if existing:
        return existing
    response = site.query(
        tables=["TournamentRosters=TR"],
        fields=["TR.Team", "TR.RosterLinks", "TR.Roles", "TR.Region"],
        where=f'TR.OverviewPage="{name}" AND TR.Team="{team}"',
    )
    for entry in response:
        new = Team(
                TeamName=entry["Team"],
                Roles=entry["Roles"],
                RosterLinks=entry["RosterLinks"],
                Region=entry["Region"],
                Split=name
        )
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
