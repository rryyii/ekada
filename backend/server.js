import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config({path: '../frontend/.env'});
import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import NodeCache from 'node-cache';
const cache = new NodeCache();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const REACT_PORT = process.env.VITE_FRONT_PORT;
const PORT = process.env.VITE_APP_PORT;
const client = createClient();
const baseUrl = "https://lol.fandom.com/api.php?action=cargoquery&format=json";
const latestVersion = "15.11.1";

client.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
}

await connectRedis();

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

async function getFromPandaScore(apiUrl, clientKey) {
    const currentclient = await cache.get(clientKey);
    if (currentclient) {
        return currentclient;
    }
    const response = await fetch(apiUrl, {
        method: "GET",
    });
    const data = await response.json();
    cache.set(clientKey, data);
    return data;
}

app.get("/api/match_schedule/:league_name", async (req, res) => {
    const leagueName = req.params.league_name;
    const currentDate = new Date();
    const dateString = currentDate.toISOString().slice(0, 10);
    const params = new URLSearchParams({
        tables: "MatchSchedule=MS,Tournaments=TS,ScoreboardGames=SG",
        fields: "TS.Name,MS.Team1,SG.Team1Bans,SG.Team1Picks,MS.Team1Score,SG.Team1Dragons,SG.Team2Dragons,SG.Team1Barons,SG.Team2Barons,SG.Team1VoidGrubs,SG.Team2VoidGrubs,SG.Team1Towers,SG.Team2Towers,SG.Team1RiftHeralds,SG.Team2RiftHeralds,TS.OverviewPage,SG.Team1Atakhans,SG.Team2Atakhans,SG.Team1Gold,SG.Team2Gold,MS.Team2,SG.Team2Bans,SG.Team2Picks,MS.Team2Score,SG.Team2Dragons,TS.Split,MS.DateTime_UTC,SG.Gamelength,SG.Patch,SG.VOD,MS.MatchId",
        join_on: "MS.ShownName=TS.Name,MS.MatchId=SG.MatchId",
        where: `TS.Name LIKE "${leagueName}%" AND MS.DateTime_UTC BETWEEN '${dateString.slice(0, 4)}-01-01' AND '${dateString}'`,
        order_by: 'MS.DateTime_UTC DESC',
        limit: '500',
    });
    const apiUrl = `${baseUrl}&${params.toString()}`;
    const clientKey = `match-schedule-${encodeURIComponent(leagueName)}`;
    const data = await getFromPandaScore(apiUrl, clientKey);
    res.json(data);
});

app.get("/api/team_info/:team_name/:tournament_name", async (req, res) => {
    const teamName = req.params.team_name;
    const tournamentName = req.params.tournament_name;
    const params = new URLSearchParams({
        tables: "TournamentRosters=TR",
        fields: "TR.Team,TR.RosterLinks,TR.Roles",
        where: `TR.Tournament="${tournamentName}" AND TR.Team="${teamName}"`,
    });
    const apiUrl = `${baseUrl}&${params.toString()}`;
    const clientKey = `team-data-${encodeURIComponent(teamName)}`;
    const data = await getFromPandaScore(apiUrl, clientKey);
    res.json(data);
});

app.get("/api/item/:item_name", async (req, res) => {
    const itemName = req.params.item_name;
    const apiUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/item.json`;
    const clientKey = `item-data-${encodeURIComponent(itemName)}`;
    const data = await getFromPandaScore(apiUrl, clientKey);
    for (const [id, item] of Object.entries(data.data)) {
        if (item.name == itemName) {
            return res.json({url: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/item/${item.image.full}`});
        }
    }
});

app.get("/api/summoner_spell/:spell_name", async (req, res) => {
    const spellName = req.params.spell_name;
    const apiUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/summoner.json`;
    const clientKey = `summoner-spell-data-${encodeURIComponent(spellName)}`;
    const data = await getFromPandaScore(apiUrl, clientKey);
    for (const [id, spell] of Object.entries(data.data)) {
        if (spell.name == spellName) {
            return res.json({url: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${spell.image.full}`});
        }
    }
});

app.get("/api/leagues/standings/:league_name", async (req, res) => {
    const leagueName = req.params.league_name;
    const params = new URLSearchParams({
        tables: "Standings",
        fields: "Standings.Team,Standings.Place,Standings.WinSeries,Standings.LossSeries,Standings.Streak,Standings.StreakDirection",
        where: `Standings.OverviewPage="${leagueName}"`,
        order_by: "Place",
    });
    const apiUrl = `${baseUrl}&${params.toString()}`;
    const clientKey = `standings-data-${encodeURIComponent(leagueName)}`;
    const data = await getFromPandaScore(apiUrl, clientKey);
    res.json(data);
});

app.get("/api/match/:match_id/:game_id", async (req, res) => {
    const matchId = req.params.match_id;
    const gameId = req.params.game_id;
    const params = new URLSearchParams({
        tables: "ScoreboardPlayers=SP",
        fields: "SP.MatchId,SP.Team,SP.Name,SP.Role,SP.Items,SP.Trinket,SP.CS,SP.Runes,SP.Kills,SP.Deaths,SP.Assists,SP.Gold,SP.VisionScore,SP.Champion,SP.SummonerSpells",
        where: `SP.MatchId="${matchId}" AND SP.GameId="${matchId}_${gameId}"`,
    });
    const apiUrl = `${baseUrl}&${params.toString()}`;
    const clientKey = `game-data-${encodeURIComponent(gameId)}-${encodeURIComponent(matchId)}}`;
    const data = await getFromPandaScore(apiUrl, clientKey);
    res.json(data);
});

app.get("/api/team_info/:tournament_name/:team_name", async (req, res) => {
    const teamName = req.params.team_name;
    const tournamentName = req.params.tournament_name;
    const params = new URLSearchParams({
        tables: "TournamentRosters=TR",
        fields: "TR.Team,TR.RosterLinks",
        where: `TR.Team="${teamName}" AND TR.Tournament="${tournamentName}"`,
    });
    const apiUrl = `${baseUrl}&${params.toString()}`;
    const clientKey = `team-roster-${encodeURIComponent(teamName)}`;
    const data = await getFromPandaScore(apiUrl, clientKey);
    res.json(data);
});


app.get("/api/team_client/:team_name/:league_name", async (req, res) => {
    const leagueName = req.params.league_name;
    const matches = client.get(`match-schedule-${encodeURIComponent(leagueName)}`);
    res.json(matches);
});