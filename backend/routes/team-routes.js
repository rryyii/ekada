import express from 'express';
import { checkCache, builder } from '../app.js';
const router = express.Router();

router.get("/api/team_info/:team_name/:tournament_name", async (req, res) => {
    const teamName = req.params.team_name;
    const tournamentName = req.params.tournament_name;
    const apiUrl = await builder.fetchTeamData(teamName, tournamentName);
    const clientKey = `team-roster-${encodeURIComponent(teamName)}`;
    const data = await checkCache(apiUrl, clientKey);
    res.json(data);
});

export default router;