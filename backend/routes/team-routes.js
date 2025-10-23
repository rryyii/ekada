import express from 'express';
import { checkCache, api } from '../app.js';
const router = express.Router();

/**
 * Endpoint for getting team information given the team and tournament.
 */
router.get("/api/team_info/:team_name/:tournament_name", async (req, res) => {
    const teamName = req.params.team_name;
    const tournamentName = req.params.tournament_name;
    api.request({
        action: "cargoquery",
        format: "json",
        tables: "TournamentRosters=TR",
        fields: "TR.Team,TR.RosterLinks,TR.Roles,TR.Region",
        where: `TR.Tournament="${tournamentName}" AND TR.Team="${teamName}"`,
    }).then((data) => {
        res.json(data);
    })
});

export default router;