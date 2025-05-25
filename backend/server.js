require("dotenv").config({path: '../frontend/.env'});
const express = require("express");
const path = require("path");
const app = express();
const cors = require('cors');
const NodeCache = require("node-cache");
const cache = new NodeCache();
const REACT_PORT = process.env.VITE_FRONT_PORT;
const PORT = process.env.VITE_APP_PORT;

app.use(cors({
    origin: `http://localhost:${REACT_PORT}`,
    credentials: true,
}));

app.use(express.static(path.join(__dirname)));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
    res.status(err.status ?? 500).send({ error: err.message })
})

async function getFromPandaScore(apiUrl, cacheKey) {
    const currentCache = cache.get(cacheKey);
    if (currentCache) {
        return currentCache;
    }
    const response = await fetch(apiUrl, {
        method: "GET",
    });
    const data = await response.json();
    cache.set(cacheKey, data);
    return data;
}

app.get("/api/match_schedule/:league_name", async (req, res) => {
    const leagueName = req.params.league_name;
    const currentDate = new Date();
    const dateString = currentDate.toISOString().slice(0, 10);
    const apiUrl = `https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=MatchSchedule=MS,Tournaments=TS,ScoreboardGames=SG&fields=MS.Team1,SG.Team1Bans,SG.Team1Picks,MS.Team1Score,SG.Team1Dragons,SG.Team2Dragons,SG.Team1Barons,SG.Team2Barons,SG.Team1VoidGrubs,SG.Team2VoidGrubs,SG.Team1Towers,SG.Team2Towers,SG.Team1RiftHeralds,SG.Team2RiftHeralds,TS.OverviewPage,SG.Team1Atakhans,SG.Team2Atakhans,SG.Team1Gold,SG.Team2Gold,MS.Team2,SG.Team2Bans,SG.Team2Picks,MS.Team2Score,SG.Team2Dragons,TS.Split,MS.DateTime_UTC,SG.Gamelength,SG.Patch,SG.VOD,MS.MatchId&join_on=MS.ShownName=TS.Name,MS.MatchId=SG.MatchId&where=TS.Name%20LIKE%20\"${leagueName}%\"%20AND%20\"${dateString}\"BETWEEN%20TS.DateStart%20AND%20TS.Date&order_by=MS.DateTime_UTC&limit=250`;
    const cacheKey = `match-schedule-${encodeURIComponent(leagueName)}`;
    const data = await getFromPandaScore(apiUrl, cacheKey);
    res.json(data);
});

app.get("/api/team_info/:team_name", async (req, res) => {
    const teamName = req.params.team_name;
    const apiUrl = `https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=Teams&fields=Teams.Name,Teams.Image,Teams.Region&where=Teams.name=\"${teamName}\"`;
    const cacheKey = `team-data-${encodeURIComponent(teamName)}`;
    const data = await getFromPandaScore(apiUrl, cacheKey);
    res.json(data);
});

app.get("/api/champions/:champion_name", async (req, res) => {
    const championName = req.params.champion_name;
    const apiUrl = `https://cdn.communitydragon.org/15.7.1/champion/${championName}/square`;
    const cacheKey = `champion-data-${encodeURIComponent(championName)}`;
    const response = await fetch(apiUrl, {
        method: "GET",
    });
    const data = await response.blob();
    res.contentType("image/png");
    res.send(Buffer.from(await data.arrayBuffer()));
});

app.get("/api/leagues/standings/:league_name", async (req, res) => {
    const leagueName = req.params.league_name;
    const apiUrl = `https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=Standings&fields=Standings.Team,Standings.Place,Standings.WinSeries,Standings.LossSeries,Standings.Streak,Standings.StreakDirection&where=Standings.OverviewPage=\"${leagueName}\"&order_by=Place`;
    const cacheKey = `standings-data-${encodeURIComponent(leagueName)}`;
    const data = await getFromPandaScore(apiUrl, cacheKey);
    res.json(data);
});

app.get("/api/match/:match_id/:game_id", async (req, res) => {
    const matchId = req.params.match_id;
    const gameId = req.params.game_id;
    const apiUrl = `https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=ScoreboardPlayers=SP&fields=SP.MatchId,SP.Team,SP.Name,SP.Role,SP.Items,SP.Trinket,SP.CS,SP.Runes,SP.Kills,SP.Deaths,SP.Assists,SP.Gold,SP.VisionScore,SP.Champion,SP.SummonerSpells&where=SP.MatchId=\"${matchId}\"%20AND%20SP.GameId=\"${matchId}_${gameId}\"`;
    const cacheKey = `game-data-${encodeURIComponent(gameId)}-${encodeURIComponent(matchId)}}`;
    const data = await getFromPandaScore(apiUrl, cacheKey);
    res.json(data);
});

app.get("/api/team_info/:tournament_name/:team_name", async (req, res) => {
    const teamName = req.params.team_name;
    const tournamentName = req.params.tournament_name;
    const apiUrl = `https://lol.fandom.com/api.php?action=cargoquery&format=json&tables=TournamentRosters=TR&fields=TR.Team,TR.RosterLinks&where=TR.Team=\"${teamName}\"%20And%20TR.Tournament=\"${tournamentName}\"`;
    const cacheKey = `team-roster-${encodeURIComponent(teamName)}`;
    const data = await getFromPandaScore(apiUrl, cacheKey);
    res.json(data);
});