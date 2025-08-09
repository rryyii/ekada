import express from 'express';
import { checkCache, builder } from "../app.js"
const router = express.Router();

router.get("/api/match_schedule/:league_name", async (req, res) => {
    let leagueName = req.params.league_name;
    if (isInternational(leagueName)) {
        let internationalName = leagueName.split(" ");
        const apiUrl = await builder.fetchInternationalMatchSchedule(internationalName);
        const clientKey = `match-schedule-${encodeURIComponent(leagueName)}`;
        const data = await checkCache(apiUrl, clientKey);
        res.json(data);
    } else {
        const apiUrl = await builder.fetchMatchSchedule(leagueName);
        const clientKey = `match-schedule-${encodeURIComponent(leagueName)}`;
        const data = await checkCache(apiUrl, clientKey);
        res.json(data);
    }

});

router.get("/api/leagues/standings/:league_name", async (req, res) => {
    const leagueName = req.params.league_name;
    const apiUrl = await builder.fetchStandings(leagueName);
    const clientKey = `standings-data-${encodeURIComponent(leagueName)}`;
    const data = await checkCache(apiUrl, clientKey);
    res.json(data);
});

function isInternational(leagueName) { 
    return (leagueName.includes("Worlds") || leagueName.includes("MSI")) ? true : false;
}

export default router;