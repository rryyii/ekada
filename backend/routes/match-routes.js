import express from 'express';
import { checkCache, builder } from '../app.js';
const router = express.Router();

/**
 * Endpoint for getting match data given the match id and game id.
 */
router.get("/api/match/:match_id/:game_id", async (req, res) => {
    const matchId = req.params.match_id;
    const gameId = req.params.game_id;
    const apiUrl = await builder.fetchMatchData(matchId, gameId);
    const clientKey = `game-data-${encodeURIComponent(gameId)}-${encodeURIComponent(matchId)}}`;
    const data = await checkCache(apiUrl, clientKey);
    if (data.error) {
        res.status(404).json({ error: "Match data not found"});
        return;
    }
    res.json(data);
});



export default router;