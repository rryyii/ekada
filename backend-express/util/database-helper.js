import { Op } from "sequelize";
import MatchData from "../models/MatchData.js";
import MatchSchedule from "../models/MatchSchedule.js";
import Standings from "../models/Standings.js";
import Teams from "../models/Teams.js";


export async function getEntries(type, where, test) {
    let result = null;
    switch (type) {
        case "standings":
            result = await Standings.findAll({
                where: {
                    LeagueName: where,
                }
            })
            return result;
        case "regular-schedule":
            result = await MatchSchedule.findAll({
                where: {
                    MatchId: {
                        [Op.like]: `${where}%`
                    },
                    isInternational: false,
                }
            })
            return result;
        case "international-schedule":
            result = await MatchSchedule.findAll({
                where: {
                    MatchId: {
                        [Op.like]: `${where}%`
                    },
                    isInternational: true,
                }
            })
            return result;
        case "match-data":
            result = await MatchData.findAll({
                where: {
                    MatchId: where,
                    GameId: test,
                }
            })
            return result;
        case "team":
            result = await Teams.findAll({
                where: {
                    Team: where,
                    Tournament: test,
                }
            })
            return result;
        default:
            return;
    }
}