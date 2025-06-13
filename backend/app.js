import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config({ path: '../frontend/.env' });
import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import NodeCache from 'node-cache';
import leagueImagesRouter from './routes/images-routes.js';
import leagueDetailsRouter from './routes/league-routes.js';
import leagueTeamRouter from './routes/team-routes.js';
import leagueMatchDetailsRouter from './routes/match-routes.js';

const cache = new NodeCache();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const REACT_PORT = process.env.VITE_FRONT_PORT;
const PORT = process.env.VITE_APP_PORT;
const client = createClient();
export const baseUrl = "https://lol.fandom.com/api.php?action=cargoquery&format=json";
export const latestVersion = "15.11.1";

client.on('error', (err) => console.error('Redis Client Error', err));

app.use(cors({
    origin: `http://localhost:${REACT_PORT}`,
    credentials: true,
}));

app.use(express.static(path.join(__dirname)));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
    res.status(err.status ?? 500).send({ error: err.message })
})

async function connectRedis() {
    if (!client.isOpen) {
        await client.connect();
    }
}

export async function getFromPandaScore(apiUrl, clientKey) {
    const currentclient = await cache.get(clientKey);
    if (currentclient) {
        return currentclient;
    }
    const response = await fetch(apiUrl, {
        method: "GET",
    });
    const data = await response.json();
    cache.set(clientKey, data);
    return data;
}

app.use(leagueImagesRouter);
app.use(leagueDetailsRouter);
app.use(leagueTeamRouter);
app.use(leagueMatchDetailsRouter);
