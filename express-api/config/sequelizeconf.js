require("dotenv").config();

const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");

const sequelizeConf = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        timezone: "+07:00",

        dialectOptions: {
            ssl: {
                ca: fs.readFileSync(
                    path.join(__dirname, "../../database/isrgrootx1.pem")
                ),
                rejectUnauthorized: true,
            },
        },

        define: {
            charset: "utf8",
        },

        retry: {
            max: 30,
        },
    }
);

module.exports = sequelizeConf;