const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "etaxzone_db",
  charset: "utf8",
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Database connected successfully");
  connection.release();
});

module.exports = pool;