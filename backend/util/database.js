import { Sequelize } from "sequelize";


export const sequelize = new Sequelize(
    {
        dialect: "mysql",
        database: "ekada",
        username: "root",
        password: "",
        host: "localhost",
        port: 3306,
        logging: false,
    }
)
