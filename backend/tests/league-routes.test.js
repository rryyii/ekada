import supertest from "supertest";
import app from "../app.js";

const request = supertest(app);

let leagueName = "LCK 2025";

test("returns an array of objects containing data for the specific league", async () => {
    const response = await request.get(`/api/match_schedule/${leagueName}`);
    expect(response.status).toBe(200);
})



test("returns an array of objects containg data for the league's standings", async () => {
    const response = await request.get(`/api/match_schedule/${leagueName}`);
    expect(response.status).toBe(200);
});