import express from 'express';
import { checkCache, api } from '../app.js';
import { getEntries } from '../util/database-helper.js';
import Teams from "../models/Teams.js";
const router = express.Router();

/**
 * Endpoint for getting team information given the team and tournament.
 */
router.get("/api/team_info/:team_name/:tournament_name", async (req, res) => {
    const teamName = req.params.team_name;
    const tournamentName = req.params.tournament_name;
    const current = await Teams.findAll({
        where: {
            Team: teamName,
            Tournament: tournamentName,
        }
    })
    if (current.length == 0) {
        const data = await api.request({
            action: "cargoquery",
            format: "json",
            tables: "TournamentRosters=TR",
            fields: "TR.Team,TR.RosterLinks,TR.Roles,TR.Region",
            where: `TR.Tournament="${tournamentName}" AND TR.Team="${teamName}"`,
        });
        if (data.error) {
            res.status(404).json({ error: "Team info not found" })
            return;
        }
        for (const item of data.cargoquery) {
            const t = item.title ?? {};
            await Teams.create({
                Team: t.Team, RosterLinks: t.RosterLinks, Region: t.Region, Tournament: tournamentName, Roles: t.Roles,
            });
        }
        res.json(await getEntries("team", teamName, tournamentName));
    } else {
        res.json(await getEntries("team", teamName, tournamentName));
    }
});

export default router;