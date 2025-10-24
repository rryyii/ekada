import { sequelize } from "../util/database.js";
import { DataTypes } from "sequelize";

const MatchData = sequelize.define(
    'MatchData',
    {
        MatchId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        GameId: {
            type: DataTypes.STRING,
        },
        Team: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Side: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        PlayerWin: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Champion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Items: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Trinket: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Kills: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Deaths: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Assists: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Gold: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        VisionScore: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        SummonerSpells: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Runes: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        DamageToChampions: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }
)

export default MatchData;