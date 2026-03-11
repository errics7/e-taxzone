const sequelizeConf = require("../../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const moment = require("moment-timezone");
moment.locale("id");
moment.tz.setDefault("Asia/Jakarta");

exports.adminmainsummary = async (req, res) => {
  let date_ob = moment().format("YYYY-MM-DD HH:mm:ss");
  const sqluserlogin = `SELECT
            nama, nim, id, timediff(:date_ob, users.lastlogin ) AS lasttime 
            FROM users  WHERE users.role =1 and users.status_active=1 and users.status_delete=0
            ORDER BY users.lastlogin DESC LIMIT 5`;
  var userlogin = await sequelizeConf
    .query(sqluserlogin, {
      replacements: { date_ob: date_ob },
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  userlogin.forEach((e) => {
    if (e?.lasttime) {
      let myArr = e.lasttime.split(":");

      // Ensure the split returns at least two parts (hours and minutes)
      if (myArr.length >= 2) {
        let hours = parseInt(myArr[0]);
        let minutes = parseInt(myArr[1]);

        // Handle case where hours are greater than 24
        if (hours > 24) {
          let hari = hours / 24;
          e.lasttime = Math.ceil(hari) + " day ago";
        }
        // Handle case where hours are greater than 0 but less than or equal to 24
        else if (hours > 0) {
          e.lasttime = hours + " hours ago";
        }
        // Handle case for minutes
        else if (minutes > 0) {
          e.lasttime = minutes + " minute ago";
        } else {
          e.lasttime = "a seconds ago"
        }
      } else {
        console.error('Invalid lasttime format:', e.lasttime);
      }
    } else {
      console.error('lasttime is missing or undefined for user:', e);
    }
  });

  const sqladminlogin = `SELECT
        nama, nim, id, timediff(:date_ob, users.lastlogin ) AS lasttime 
        FROM users 
        WHERE users.role=2 and users.status_active=1 and users.status_delete=0
        ORDER BY users.lastlogin DESC LIMIT 5`;
  var adminlogin = await sequelizeConf
    .query(sqladminlogin, {
      replacements: { date_ob: date_ob },
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
  adminlogin.forEach((e) => {
    let myArr = e.lasttime.split(":");

    if (myArr[0] > 24) {
      let hari = myArr[0] / 24;

      e.lasttime = Math.ceil(hari);
      e.lasttime = e.lasttime + " day ago";
    } else if (myArr[0] > 0) {
      e.lasttime = myArr[0] + " hours ago";
    } else {
      e.lasttime = myArr[1] + " minute ago";
    }
  });

  const sqlcount = `SELECT (SELECT COUNT(nim) as 'total' from users where role =1 ) as student_all,
    (SELECT COUNT(nim) as 'total' from users where role =1 and status_active=1) as student_aktif,
    (SELECT COUNT(nim) as 'total' from users where role =1 and (status_active=2 or status_active=0)) as student_non
    `;
  var count = await sequelizeConf
    .query(sqlcount, {
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  res.json({
    user: userlogin,
    admin: adminlogin,
    count,
  });
};

exports.dosenmainsummary = async (req, res) => {
  let date_ob = moment().format("YYYY-MM-DD HH:mm:ss");
  const sqluserlogin = `SELECT
            nama, nim, id, timediff(:date_ob, users.lastlogin ) AS lasttime 
            FROM users  WHERE users.role =1 and users.status_active=1 and users.status_delete=0
            ORDER BY users.lastlogin DESC LIMIT 5`;
  var userlogin = await sequelizeConf
    .query(sqluserlogin, {
      replacements: { date_ob: date_ob },
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  userlogin.forEach((e) => {
    if (e?.lasttime) {
      let myArr = e.lasttime.split(":");

      if (myArr.length >= 2) {
        let hours = parseInt(myArr[0]);
        let minutes = parseInt(myArr[1]);

        if (hours > 24) {
          let hari = hours / 24;
          e.lasttime = Math.ceil(hari) + " day ago";
        }

        else if (hours > 0) {
          e.lasttime = hours + " hours ago";
        }
        else if (minutes > 0) {
          e.lasttime = minutes + " minute ago";
        } else {
          e.lasttime = "a seconds ago"
        }
      } else {
        console.error('Invalid lasttime format:', e.lasttime);
      }
    } else {
      console.error('lasttime is missing or undefined for user:', e);
    }
  });

  const sqlcount = `SELECT (SELECT COUNT(nim) as 'total' from users where role =1 and status_delete=0 ) as student_all,
    (SELECT COUNT(nim) as 'total' from users where role =1 and status_active=1 and status_delete=0) as student_aktif,
    (SELECT COUNT(nim) as 'total' from users where role =1 and (status_active=2 or status_active=0) and status_delete=0) as student_non
    `;
  var count = await sequelizeConf
    .query(sqlcount, {
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  res.json({
    user: userlogin,
    admin: [],
    count,
  });
};
