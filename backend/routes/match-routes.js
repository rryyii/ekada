import express from 'express';
import { checkCache, builder } from '../app.js';
const router = express.Router();

router.get("/api/match/:match_id/:game_id", async (req, res) => {
    const matchId = req.params.match_id;
    const gameId = req.params.game_id;
    const apiUrl = await builder.fetchMatchData(matchId, gameId);
    const clientKey = `game-data-${encodeURIComponent(gameId)}-${encodeURIComponent(matchId)}}`;
    const data = await checkCache(apiUrl, clientKey);
    res.json(data);
});

router.get("/api/team_info/:team_name/:tournament_name", async (req, res) => {
    const teamName = req.params.team_name;
    const tournamentName = req.params.tournament_name;
    const apiUrl = await builder.fetchTeamData(teamName, tournamentName);
    const clientKey = `team-data-${encodeURIComponent(teamName)}-${encodeURIComponent(tournamentName)}`;
    const data = await checkCache(apiUrl, clientKey);
    res.json(data);
});

export default router;