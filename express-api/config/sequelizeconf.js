require("dotenv").config();

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
        define: {
            charset: "utf8",
        },
        retry: {
            max: 30,
        },
    }
);

module.exports = sequelizeConf;