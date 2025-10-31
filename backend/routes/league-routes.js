import express from 'express';
import { api } from "../app.js"
import Standings from '../models/Standings.js';
import { getEntries } from '../util/database-helper.js';
import MatchSchedule from '../models/MatchSchedule.js';
import MatchData from '../models/MatchData.js';
import { sequelize } from '../util/database.js';
import { Op } from 'sequelize';
const router = express.Router();

/**
 * Endpoint for match schedule of the given league.
 */
router.get("/api/match_schedule/:league_name", async (req, res) => {
    let leagueName = req.params.league_name;
    const currentDate = new Date();
    const dateString = currentDate.toISOString().slice(0, 10);
    if (isInternational(leagueName)) {
        const internationalName = leagueName.split(" ");
        let clause = "";
        if (internationalName[0] == "Worlds") {
            clause = `${internationalName[1]} Season World Championship`;
        } else if (internationalName[0] == "MSI") {
            clause = `${internationalName[1]} Mid-Season Invitational`;
        } else if (internationalName[0] == "First Stand") {
            clause = `${internationalName[1]} First Stand`;
        }
        const current = await MatchSchedule.findAll({
            where: {
                OverviewPage: {
                    [Op.like]: `${clause}%`,
                },
                isInternational: true,
            }
        })
        if (current.length != 0) {
            return res.json(await getEntries("international-schedule", clause, ""))
        }
        const data = await api.request({
            action: "cargoquery",
            format: "json",
            tables: "MatchSchedule=MS,Tournaments=TS,ScoreboardGames=SG",
            fields: "SG.WinTeam,MS.Winner,TS.Name,MS.Team1,SG.Team1Bans,SG.Team1Picks,MS.Team1Score,SG.Team1Dragons,SG.Team2Dragons,SG.Team1Barons,SG.Team2Barons,SG.Team1VoidGrubs,SG.Team2VoidGrubs,SG.Team1Towers,SG.Team2Towers,SG.Team1RiftHeralds,SG.Team2RiftHeralds,TS.OverviewPage,SG.Team1Atakhans,SG.Team2Atakhans,SG.Team1Gold,SG.Team2Gold,MS.Team2,SG.Team2Bans,SG.Team2Picks,MS.Team2Score,SG.Team2Dragons,TS.Split,MS.DateTime_UTC,SG.Gamelength,SG.Patch,SG.VOD,MS.MatchId",
            where: `TS.Name LIKE "${internationalName[0]}%" AND MS.DateTime_UTC BETWEEN '${currentDate.getFullYear() - 1}-01-01' AND '${dateString}'`,
            join_on: "MS.OverviewPage=TS.OverviewPage,MS.MatchId=SG.MatchId",
            order_by: 'MS.DateTime_UTC DESC',
            limit: '500',
        });
        if (data.error) {
            return res.status(404).json({ error: "International Match schedule not found" })
        }
        for (const item of data.cargoquery) {
            const t = item.title ?? "";
            await MatchSchedule.create({
                WinTeam: t.WinTeam ?? '',
                Winner: t.Winner ?? '',
                Name: t.Name ?? '',
                Team1: t.Team1 ?? '',
                Team1Bans: t.Team1Bans ?? '',
                Team1Picks: t.Team1Picks ?? '',
                Team1Score: t.Team1Score ? parseInt(t.Team1Score, 10) : null,
                Team1Dragons: t.Team1Dragons ? parseInt(t.Team1Dragons, 10) : null,
                Team2Dragons: t.Team2Dragons ? parseInt(t.Team2Dragons, 10) : null,
                Team1Barons: t.Team1Barons ? parseInt(t.Team1Barons, 10) : null,
                Team2Barons: t.Team2Barons ? parseInt(t.Team2Barons, 10) : null,
                Team1VoidGrubs: t.Team1VoidGrubs ? parseInt(t.Team1VoidGrubs, 10) : null,
                Team2VoidGrubs: t.Team2VoidGrubs ? parseInt(t.Team2VoidGrubs, 10) : null,
                Team1Towers: t.Team1Towers ? parseInt(t.Team1Towers, 10) : null,
                Team2Towers: t.Team2Towers ? parseInt(t.Team2Towers, 10) : null,
                Team1RiftHeralds: t.Team1RiftHeralds ? parseInt(t.Team1RiftHeralds, 10) : null,
                Team2RiftHeralds: t.Team2RiftHeralds ? parseInt(t.Team2RiftHeralds, 10) : null,
                OverviewPage: t.OverviewPage ?? '',
                Team1Atakhans: t.Team1Atakhans ? parseInt(t.Team1Atakhans, 10) : null,
                Team2Atakhans: t.Team2Atakhans ? parseInt(t.Team2Atakhans, 10) : null,
                Team1Gold: t.Team1Gold ? parseInt(t.Team1Gold, 10) : null,
                Team2Gold: t.Team2Gold ? parseInt(t.Team2Gold, 10) : null,
                Team2: t.Team2 ?? '',
                Team2Bans: t.Team2Bans ?? '',
                Team2Picks: t.Team2Picks ?? '',
                Team2Score: t.Team2Score ? parseInt(t.Team2Score, 10) : null,
                Split: t.Split ?? '',
                DateTime_UTC: t["DateTime UTC"]
                    ? new Date(t["DateTime UTC"].replace(" ", "T") + "Z")
                    : null, Gamelength: t.Gamelength ? parseFloat(t.Gamelength) : null, Gamelength: t.Gamelength ? parseFloat(t.Gamelength) : null,
                Patch: t.Patch ?? '',
                VOD: t.VOD ?? '',
                MatchId: t.MatchId ?? '',
                isInternational: true,
            });
        }
        return res.json(await getEntries("international-schedule", clause, ""));
    } else {
        const regularName = leagueName.split(" ");
        const clause = `${regularName[0]}/${regularName[1]} Season/`;
        const current = await MatchSchedule.findAll({
            where: {
                OverviewPage: {
                    [Op.like]: `${clause}%`,
                },
                isInternational: true,
            }
        })
        if (current.length != 0) {
            return res.json(await getEntries("regular-schedule", clause, ""))
        }
        const data = await api.request({
            action: "cargoquery",
            format: "json",
            tables: "MatchSchedule=MS,Tournaments=TS,ScoreboardGames=SG",
            fields: "SG.WinTeam,MS.Winner,TS.Name,MS.Team1,SG.Team1Bans,SG.Team1Picks,MS.Team1Score,SG.Team1Dragons,SG.Team2Dragons,SG.Team1Barons,SG.Team2Barons,SG.Team1VoidGrubs,SG.Team2VoidGrubs,SG.Team1Towers,SG.Team2Towers,SG.Team1RiftHeralds,SG.Team2RiftHeralds,TS.OverviewPage,SG.Team1Atakhans,SG.Team2Atakhans,SG.Team1Gold,SG.Team2Gold,MS.Team2,SG.Team2Bans,SG.Team2Picks,MS.Team2Score,SG.Team2Dragons,TS.Split,MS.DateTime_UTC,SG.Gamelength,SG.Patch,SG.VOD,MS.MatchId",
            where: `TS.Name LIKE "${leagueName}%" AND MS.DateTime_UTC BETWEEN '${dateString.slice(0, 4)}-01-01' AND '${dateString}'`,
            join_on: "MS.OverviewPage=TS.OverviewPage,MS.MatchId=SG.MatchId",
            order_by: 'MS.DateTime_UTC DESC',
            limit: '500',
        });
        if (data.error) {
            return res.status(404).json({ error: "Regular Match schedule not found" })
        }
        for (const item of data.cargoquery) {
            const t = item.title ?? "";
            await MatchSchedule.create({
                WinTeam: t.WinTeam ?? '',
                Winner: t.Winner ?? '',
                Name: t.Name ?? '',
                Team1: t.Team1 ?? '',
                Team1Bans: t.Team1Bans ?? '',
                Team1Picks: t.Team1Picks ?? '',
                Team1Score: t.Team1Score ? parseInt(t.Team1Score, 10) : null,
                Team1Dragons: t.Team1Dragons ? parseInt(t.Team1Dragons, 10) : null,
                Team2Dragons: t.Team2Dragons ? parseInt(t.Team2Dragons, 10) : null,
                Team1Barons: t.Team1Barons ? parseInt(t.Team1Barons, 10) : null,
                Team2Barons: t.Team2Barons ? parseInt(t.Team2Barons, 10) : null,
                Team1VoidGrubs: t.Team1VoidGrubs ? parseInt(t.Team1VoidGrubs, 10) : null,
                Team2VoidGrubs: t.Team2VoidGrubs ? parseInt(t.Team2VoidGrubs, 10) : null,
                Team1Towers: t.Team1Towers ? parseInt(t.Team1Towers, 10) : null,
                Team2Towers: t.Team2Towers ? parseInt(t.Team2Towers, 10) : null,
                Team1RiftHeralds: t.Team1RiftHeralds ? parseInt(t.Team1RiftHeralds, 10) : null,
                Team2RiftHeralds: t.Team2RiftHeralds ? parseInt(t.Team2RiftHeralds, 10) : null,
                OverviewPage: t.OverviewPage ?? '',
                Team1Atakhans: t.Team1Atakhans ? parseInt(t.Team1Atakhans, 10) : null,
                Team2Atakhans: t.Team2Atakhans ? parseInt(t.Team2Atakhans, 10) : null,
                Team1Gold: t.Team1Gold ? parseInt(t.Team1Gold, 10) : null,
                Team2Gold: t.Team2Gold ? parseInt(t.Team2Gold, 10) : null,
                Team2: t.Team2 ?? '',
                Team2Bans: t.Team2Bans ?? '',
                Team2Picks: t.Team2Picks ?? '',
                Team2Score: t.Team2Score ? parseInt(t.Team2Score, 10) : null,
                Split: t.Split ?? '',
                DateTime_UTC: t["DateTime UTC"]
                    ? new Date(t["DateTime UTC"].replace(" ", "T") + "Z")
                    : null, Gamelength: t.Gamelength ? parseFloat(t.Gamelength) : null,
                Patch: t.Patch ?? '',
                VOD: t.VOD ?? '',
                MatchId: t.MatchId ?? '',
                isInternational: false,
            });
        }
        return res.json(await getEntries("regular-schedule", clause, ""))
    }

});

/**
 * Endpoint for the standings of the given league.
 */
router.get("/api/leagues/standings/:league_name", async (req, res) => {
    const leagueName = req.params.league_name;
    const current = await Standings.findAll({
        where: {
            LeagueName: leagueName,
        }
    });
    if (current.length != 0) {
        return res.json(await getEntries("standings", leagueName, ""));
    }
    const data = await api.request({
        action: "cargoquery",
        format: "json",
        tables: "Standings",
        fields: "Standings.Team,Standings.Place,Standings.WinSeries,Standings.LossSeries,Standings.Streak,Standings.StreakDirection,Standings.Points",
        where: `Standings.OverviewPage="${leagueName}"`,
        order_by: "Standings.Place",
    });
    if (data.error) {
        return res.status(404).json({ error: "Standings not found" })
    }
    for (const item of data.cargoquery) {
        await Standings.create({
            LeagueName: leagueName, Team: item.title.Team, Place: item.title.Place, WinSeries: item.title.WinSeries, LossSeries: item.title.LossSeries,
            Streak: item.title.Streak, StreakDirection: item.title.StreakDirection, Points: item.title.Points
        });
    }
    return res.json(await getEntries("standings", leagueName, ""));
});

router.get("/api/leagues/data/:league_name", async (req, res) => {
    const leagueName = req.params.league_name;
    const result = await MatchData.findAll({
        attributes: [
            'Role',
            'Champion',
            'PlayerWin',
            [sequelize.fn('COUNT', sequelize.col('Champion')), 'champion_count'],
            [sequelize.fn('COUNT', sequelize.col('*')), 'win_count']
        ],
        group: ['Role', 'Champion', 'PlayerWin'],
        where: {
            MatchId: {
                [Op.like]: `${leagueName}_%`,
            },
        },
        order: [[sequelize.literal('champion_count'), 'DESC']],
        limit: 5,
    })
    return res.json(result);
});


function isInternational(leagueName) {
    return (leagueName.includes("Worlds") || leagueName.includes("MSI") || leagueName.includes("First Stand")) ? true : false;
}

export default router;