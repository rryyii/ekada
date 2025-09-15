import express from 'express';
import { checkCache, builder } from "../app.js"
const router = express.Router();

/**
 * Endpoint for match schedule of the given league.
 */
router.get("/api/match_schedule/:league_name", async (req, res) => {
    let leagueName = req.params.league_name;
    if (isInternational(leagueName)) {
        let internationalName = leagueName.split(" ");
        const apiUrl = await builder.fetchInternationalMatchSchedule(internationalName);
        const clientKey = `match-schedule-${encodeURIComponent(leagueName)}-${Date.now()}`;
        const data = await checkCache(apiUrl, clientKey);
        if (data.error) {
            res.status(404).json({ error: "International Match schedule not found"})
            return;
        }
        res.json(data);
    } else {
        const apiUrl = await builder.fetchMatchSchedule(leagueName);
        const clientKey = `match-schedule-${encodeURIComponent(leagueName)}-${Date.now()}`;
        const data = await checkCache(apiUrl, clientKey);
        if (data.error) {
            res.status(404).json({ error: "Domestic Match schedule not found"});
            return;
        }
        res.json(data);
    }

});

/**
 * Endpoint for the standings of the given league.
 */
router.get("/api/leagues/standings/:league_name", async (req, res) => {
    const leagueName = req.params.league_name;
    const apiUrl = await builder.fetchStandings(leagueName);
    const clientKey = `standings-data-${encodeURIComponent(leagueName)}`;
    const data = await checkCache(apiUrl, clientKey);
    if (data.error) {
        res.status(404).json({ error: "League not found" });
        return;
    }
    res.json(data);
});

function isInternational(leagueName) { 
    return (leagueName.includes("Worlds") || leagueName.includes("MSI")) ? true : false;
}

export default router;