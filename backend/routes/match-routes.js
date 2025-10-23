import express from 'express';
import { checkCache, api } from '../app.js';
const router = express.Router();

/**
 * Endpoint for getting match data given the match id and game id.
 */
router.get("/api/match/:match_id/:game_id", async (req, res) => {
    const matchId = req.params.match_id;
    const gameId = req.params.game_id;
    const data = await api.request({
        action: "cargoquery",
        format: "json",
        tables: "ScoreboardPlayers=SP",
        fields: "SP.DamageToChampions,SP.Side,SP.PlayerWin,SP.MatchId,SP.Team,SP.Name,SP.Role,SP.Items,SP.Trinket,SP.CS,SP.Runes,SP.Kills,SP.Deaths,SP.Assists,SP.Gold,SP.VisionScore,SP.Champion,SP.SummonerSpells",
        where: `SP.MatchId="${matchId}" AND SP.GameId="${matchId}_${gameId}"`,
    });
    if (data.error) {
        return;
    }
    res.json(data);

});



export default router;