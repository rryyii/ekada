import express from 'express';
import { checkCache, api } from '../app.js';
import MatchData from '../models/MatchData.js';
import { getEntries } from '../util/database-helper.js';
const router = express.Router();

/**
 * Endpoint for getting match data given the match id and game id.
 */
router.get("/api/match/:match_id/:game_id", async (req, res) => {
    const matchId = req.params.match_id;
    const gameId = req.params.game_id;
    const current = await MatchData.findAll({
        where: {
            MatchId: matchId,
            GameId: gameId,
        }
    });
    if (current.length == 0) {
        const data = await api.request({
            action: "cargoquery",
            format: "json",
            tables: "ScoreboardPlayers=SP",
            fields: "SP.DamageToChampions,SP.Side,SP.PlayerWin,SP.MatchId,SP.Team,SP.Name,SP.Role,SP.Items,SP.Trinket,SP.CS,SP.Runes,SP.Kills,SP.Deaths,SP.Assists,SP.Gold,SP.VisionScore,SP.Champion,SP.SummonerSpells",
            where: `SP.MatchId="${matchId}" AND SP.GameId="${matchId}_${gameId}"`,
        });
        if (data.error) {
            res.status(404).json({ error: "Match data not found" })
            return;
        }
        for (const item of data.cargoquery) {
            const t = item.title ?? {};
            await MatchData.create({
                MatchId: t.MatchId ?? matchId,
                GameId: gameId,
                Team: t.Team ?? '',
                Side: t.Side ?? '',
                Name: t.Name ?? '',
                Role: t.Role ?? '',
                PlayerWin: t.PlayerWin ?? '',
                Champion: t.Champion ?? '',
                Items: t.Items ?? '',
                Trinket: t.Trinket ?? '',
                Kills: parseInt(t.Kills ?? '0', 10),
                Deaths: parseInt(t.Deaths ?? '0', 10),
                Assists: parseInt(t.Assists ?? '0', 10),
                Gold: parseInt(t.Gold ?? '0', 10),
                VisionScore: parseInt(t.VisionScore ?? '0', 10),
                SummonerSpells: t.SummonerSpells ?? '',
                Runes: t.Runes ?? '',
                DamageToChampions: parseInt(t.DamageToChampions ?? '0', 10),
            });
        }
        res.json(await getEntries("match-data", matchId, gameId));
    } else {
        res.json(await getEntries("match-data", matchId, gameId));
    }

});



export default router;