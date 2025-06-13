import express from 'express';
import { getFromPandaScore, baseUrl } from "../app.js"
const router = express.Router();

router.get("/api/match_schedule/:league_name", async (req, res) => {
    let leagueName = req.params.league_name;
    if (leagueName.includes("Worlds") || leagueName.includes("MSI")) {
        let test = leagueName.split(" ");
        const currentDate = new Date();
        const dateString = currentDate.toISOString().slice(0, 10);
        console.log(dateString);
        const params = new URLSearchParams({
            tables: "MatchSchedule=MS,Tournaments=TS,ScoreboardGames=SG",
            fields: "SG.WinTeam,MS.Winner,TS.Name,MS.Team1,SG.Team1Bans,SG.Team1Picks,MS.Team1Score,SG.Team1Dragons,SG.Team2Dragons,SG.Team1Barons,SG.Team2Barons,SG.Team1VoidGrubs,SG.Team2VoidGrubs,SG.Team1Towers,SG.Team2Towers,SG.Team1RiftHeralds,SG.Team2RiftHeralds,TS.OverviewPage,SG.Team1Atakhans,SG.Team2Atakhans,SG.Team1Gold,SG.Team2Gold,MS.Team2,SG.Team2Bans,SG.Team2Picks,MS.Team2Score,SG.Team2Dragons,TS.Split,MS.DateTime_UTC,SG.Gamelength,SG.Patch,SG.VOD,MS.MatchId",
            where: `TS.Name LIKE "${test[0]}%" AND MS.DateTime_UTC BETWEEN '${currentDate.getFullYear() - 1}-01-01' AND '${dateString}'`,
            join_on: "MS.OverviewPage=TS.OverviewPage,MS.MatchId=SG.MatchId",
            order_by: 'MS.DateTime_UTC DESC',
            limit: '500',
        });
        console.log(params.get("where"))
        const apiUrl = `${baseUrl}&${params.toString()}`;
        const clientKey = `match-schedule-${encodeURIComponent(leagueName)}`;
        const data = await getFromPandaScore(apiUrl, clientKey);
        console.log(data);
        res.json(data);
    } else {
        const currentDate = new Date();
        const dateString = currentDate.toISOString().slice(0, 10);
        const params = new URLSearchParams({
            tables: "MatchSchedule=MS,Tournaments=TS,ScoreboardGames=SG",
            fields: "SG.WinTeam,MS.Winner,TS.Name,MS.Team1,SG.Team1Bans,SG.Team1Picks,MS.Team1Score,SG.Team1Dragons,SG.Team2Dragons,SG.Team1Barons,SG.Team2Barons,SG.Team1VoidGrubs,SG.Team2VoidGrubs,SG.Team1Towers,SG.Team2Towers,SG.Team1RiftHeralds,SG.Team2RiftHeralds,TS.OverviewPage,SG.Team1Atakhans,SG.Team2Atakhans,SG.Team1Gold,SG.Team2Gold,MS.Team2,SG.Team2Bans,SG.Team2Picks,MS.Team2Score,SG.Team2Dragons,TS.Split,MS.DateTime_UTC,SG.Gamelength,SG.Patch,SG.VOD,MS.MatchId",
            where: `TS.Name LIKE "${leagueName}%" AND MS.DateTime_UTC BETWEEN '${dateString.slice(0, 4)}-01-01' AND '${dateString}'`,
            join_on: "MS.OverviewPage=TS.OverviewPage,MS.MatchId=SG.MatchId",
            order_by: 'MS.DateTime_UTC DESC',
            limit: '500',
        });
        const apiUrl = `${baseUrl}&${params.toString()}`;
        const clientKey = `match-schedule-${encodeURIComponent(leagueName)}`;
        const data = await getFromPandaScore(apiUrl, clientKey);
        res.json(data);
    }

});


router.get("/api/leagues/standings/:league_name", async (req, res) => {
    const leagueName = req.params.league_name;
    const params = new URLSearchParams({
        tables: "Standings",
        fields: "Standings.Team,Standings.Place,Standings.WinSeries,Standings.LossSeries,Standings.Streak,Standings.StreakDirection,Standings.Points",
        where: `Standings.OverviewPage="${leagueName}"`,
        order_by: "Standings.Place",
    });
    const apiUrl = `${baseUrl}&${params.toString()}`;
    const clientKey = `standings-data-${encodeURIComponent(leagueName)}`;
    const data = await getFromPandaScore(apiUrl, clientKey);
    res.json(data);
});

export default router;