import { sequelize } from "../db.js";
import { DataTypes, DATE } from "sequelize";


const Standings = sequelize.define(
    "Standings",
    {
        Team: {
            type: DataTypes.STRING,
        },
        Place: {
            type: DataTypes.INTEGER,
        },
        WinSeries: {
            type: DataTypes.INTEGER,
        },
        LossSeries: {
            type: DataTypes.INTEGER,
        },
        Streak: {
            type: DataTypes.INTEGER,
        },
        StreakDirection: {
            type: DataTypes.INTEGER,
        },
        Points: {
            type: DataTypes.INTEGER,
        }
    }
)

export default Standings;