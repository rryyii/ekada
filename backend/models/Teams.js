import { sequelize } from "../util/database.js";
import { DataTypes } from "sequelize";

const Teams = sequelize.define(
    "Teams",
    {
        Team: {
            type: DataTypes.STRING,
        },
        Roles: {
            type: DataTypes.STRING,
        },
        RosterLinks: {
            type: DataTypes.STRING,
        },
        Region: {
            type: DataTypes.STRING,
        },
        Tournament: {
            type: DataTypes.STRING,
        }
    }
);

export default Teams;
