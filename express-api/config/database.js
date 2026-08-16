require("dotenv").config();

const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf8",

    ssl: {
        ca: fs.readFileSync(
            path.join(__dirname, "../../database/isrgrootx1.pem")
        ),
        rejectUnauthorized: true,
    },
});

module.exports = pool;