import express from 'express';
import { getFromPandaScore, latestVersion } from '../app.js';
const router = express.Router();


router.get("/api/summoner_spell/:spell_name", async (req, res) => {
    const spellName = req.params.spell_name;
    const apiUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/summoner.json`;
    const clientKey = `summoner-spell-data-${encodeURIComponent(spellName)}`;
    const data = await getFromPandaScore(apiUrl, clientKey);
    for (const [id, spell] of Object.entries(data.data)) {
        if (spell.name == spellName) {
            return res.json({ url: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${spell.image.full}` });
        }
    }
});

router.get("/api/item/:item_name/:patch", async (req, res) => {
    const itemName = req.params.item_name;
    const apiUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/item.json`;
    const clientKey = `item-data-${encodeURIComponent(itemName)}`;
    const data = await getFromPandaScore(apiUrl, clientKey);
    for (const [id, item] of Object.entries(data.data)) {
        if (item.name === itemName) {
            return res.json({ url: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/item/${item.image.full}` });
        }
    }
});


export default router;