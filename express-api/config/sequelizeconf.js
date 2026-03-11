const { Sequelize } = require("sequelize");

const sequelizeConf = new Sequelize(
  "etaxzone_db", // Nama database yang diubah
  "root",       // Username MySQL
  "",          // Password dikosongkan (default di Windows, ubah jika perlu)
  {
    host: "127.0.0.1",  // Host server
    dialect: "mysql",   // Dialek database
    port: 3306,         // Port default MySQL di Windows
    define: {
      charset: "utf8", // Charset
    },
    timezone: "+07:00", // Timezone database (WIB)
    retry: { max: 30 }, // Retry konfigurasi
  }
);

sequelizeConf
  .authenticate()
  .then(() => console.log("Database connected successfully test"))
  .catch((err) => console.error("Database connection failed:", err));

module.exports = sequelizeConf;