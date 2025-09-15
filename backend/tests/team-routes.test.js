import supertest from "supertest"
import app from "../app.js"

const request = supertest(app);

test("return an array of objects containing team data", async () => {
    let teamName = "T1";
    let tournamentName = "LCK 2025";
    const response = await request.get(`/api/team_info/${teamName}/${tournamentName}`);
    expect(response.status).toBe(200);
    console.log(response.body);
})