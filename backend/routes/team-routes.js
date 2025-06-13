import express from 'express';
import { getFromPandaScore, baseUrl } from '../app.js';
const router = express.Router();

router.get("/api/team_info/:tournament_name/:team_name", async (req, res) => {
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


router.get("/api/team_client/:team_name/:league_name", async (req, res) => {
    const leagueName = req.params.league_name;
    const teamName = req.params.team_name;
    res.json(matches);
});

export default router;