require("dotenv").config();

const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";

const sequelizeOptions = {
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
};

// SSL hanya digunakan saat production / Vercel
if (isProduction) {
    sequelizeOptions.dialectOptions = {
        ssl: {
            ca: fs.readFileSync(
                path.join(__dirname, "../../database/isrgrootx1.pem")
            ),
            rejectUnauthorized: true,
        },
    };
}

const sequelizeConf = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    sequelizeOptions
);

module.exports = sequelizeConf;