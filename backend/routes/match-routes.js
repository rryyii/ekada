import express from 'express';
import { getFromPandaScore, baseUrl } from '../app.js';
const router = express.Router();

router.get("/api/match/:match_id/:game_id", async (req, res) => {
    const matchId = req.params.match_id;
    const gameId = req.params.game_id;
    const params = new URLSearchParams({
        tables: "ScoreboardPlayers=SP",
        fields: "SP.DamageToChampions,SP.Side,SP.PlayerWin,SP.MatchId,SP.Team,SP.Name,SP.Role,SP.Items,SP.Trinket,SP.CS,SP.Runes,SP.Kills,SP.Deaths,SP.Assists,SP.Gold,SP.VisionScore,SP.Champion,SP.SummonerSpells",
        where: `SP.MatchId="${matchId}" AND SP.GameId="${matchId}_${gameId}"`,
    });
    const apiUrl = `${baseUrl}&${params.toString()}`;
    const clientKey = `game-data-${encodeURIComponent(gameId)}-${encodeURIComponent(matchId)}}`;
    const data = await getFromPandaScore(apiUrl, clientKey);
    res.json(data);
});

router.get("/api/team_info/:team_name/:tournament_name", async (req, res) => {
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

export default router;