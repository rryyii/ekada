import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";

const MatchData = sequelize.define(
    'MatchData',
    {
        MatchId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
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
            type: DataTypes.STRING,
            allowNull: false,
        },
        Deaths: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Assists: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Gold: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        VisionScore: {
            type: DataTypes.STRING,
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
    }
)

export default MatchData;