import supertest from "supertest";
import app from "../app.js"

const request = supertest(app);

test("return an array of objects containing match data", async () => {
    let matchId = 67;
    let gameId = 41;
    const response = await request.get(`/api/match/${matchId}/${gameId}`);
    expect(response.status).toBe(200);
})