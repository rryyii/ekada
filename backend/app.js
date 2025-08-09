import { createClient } from 'redis';
import assert from 'assert';
import dotenv from 'dotenv';
dotenv.config({ path: '../frontend/.env' });
import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import NodeCache from 'node-cache';
import { RequestBuilder } from './util/RequestBuilder.js';
import leagueImagesRouter from './routes/images-routes.js';
import leagueDetailsRouter from './routes/league-routes.js';
import searchRouter from './routes/search-routes.js';
import leagueTeamRouter from './routes/team-routes.js';
import leagueMatchDetailsRouter from './routes/match-routes.js';

const cache = new NodeCache();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const REACT_PORT = process.env.VITE_FRONT_PORT;
const PORT = process.env.VITE_APP_PORT;
export const baseUrl = "https://lol.fandom.com/api.php?action=cargoquery&format=json";
export const latestVersion = "15.15.1";

const client = createClient();

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


if (!client.isOpen) {
    await client.connect();
}

export const builder = new RequestBuilder(baseUrl);

export async function checkCache(apiUrl, clientKey) {
    assert(apiUrl != null, "apiUrl is null or empty");
    assert(clientKey != null, "clientKey is null or empty");

    const currentclient = await client.get(clientKey);
    const parsedClient = JSON.parse(currentclient);
    if (parsedClient) {
        return parsedClient;
    }
    const response = await fetch(apiUrl, {
        method: "GET",
    });
    const data = await response.json();
    client.set(clientKey, JSON.stringify(data));
    return data;
}

app.use(leagueImagesRouter);
app.use(leagueDetailsRouter);
app.use(leagueTeamRouter);
app.use(leagueMatchDetailsRouter);
app.use(searchRouter);
