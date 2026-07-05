import { sequelize } from "../util/database.js";
import { DataTypes, DATE } from "sequelize";


const Standings = sequelize.define(
    "Standings",
    {
        LeagueName: {
            type: DataTypes.STRING,
        },
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
            type: DataTypes.STRING,
        },
        Points: {
            type: DataTypes.INTEGER,
        }
    }
)

export default Standings;