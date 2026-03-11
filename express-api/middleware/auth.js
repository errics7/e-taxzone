const db = require("../config/database");
const jwtconf = require("../config/secret");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const ip = require("ip");
const mysql = require("mysql2");
const secretConf = require("../config/secret");
const moment = require("moment-timezone");
moment.locale("id");
moment.tz.setDefault("Asia/Jakarta");

exports.registrasi = function (req, res) {
  if (req.body.nim != null || req.body.nim != "") {
    db.query(`select * from users where nim=${req.body.nim}`, (err, result) => {
      if (err) {
        res.status(400).json({
          message: err,
        });
        return;
      }
      if (result.length) {
        res.status(200).json({
          status: 200,
          success: false,
          message: `NIM : ${req.body.nim} - already registered`,
        });
      } else {
        // post db
        const sql = `insert into users (nim,nama,kelas,role,status,password,img_url) values ('${
          req.body.nim
        }','${req.body.name}', '${req.body.class}', 'student','0','${md5(
          req.body.password
        )}','https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg')`;
        db.query(sql, (err, result) => {
          if (err) {
            console.log(err);
            res.status(400).json({
              message: err,
            });
            return;
          }
          // if no error
          res.status(200).json({
            status: 200,
            success: true,
            message: `${req.body.name} has been registered`,
          });
        });
      }
    });
  } else {
    res.status(400).json({
      success: true,
      message: "parameter error",
    });
  }
};

exports.login = function (req, res) {
  const usr = req.body.email;
  const pwd = md5(req.body.password);
  // console.log(pwd);
  // console.log(usr);
  const sql = `select users.id,users.nim,users.nama,users.email,users.kelas,users.role,users.img_url,users.status from users where email='${usr}' and password='${pwd}'
  OR nim='${usr}' AND password='${pwd}'`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(400).json({
        Error: true,
        message: err,
      });
      return;
    }
    if (rows.length == 1) {
      console.log(moment().format("YYYY-MM-DD HH:mm:ss"));
      if (rows[0].status === 1) {
        const token = jwt.sign({ data: rows[0] }, jwtconf.secret, {
          expiresIn: "5h",
        });
        const uid = rows[0].id;
        const nim = rows[0].nim;
        const name = rows[0].nama;
        const lasttimes = moment().format("YYYY-MM-DD HH:mm:ss");
        const data = {
          id_user: uid,
          access_token: token,
          ip_address: ip.address(),
          lasttime: lasttimes,
        };

        var query = "INSERT INTO ?? SET ?";
        const table = ["akses_token"];

        var q = mysql.format(query, table);
        db.query(q, data, function (error, rows) {
          if (error) {
            console.log(error);
          } else {
            // Update loastlogin at table users
            var upd = `UPDATE users SET lastlogin='${lasttimes}' WHERE email='${usr}' OR nim='${usr}'`;
            db.query(upd, (err, result) => {
              if (err) {
                console.log(err);
              } else {
              }
            });
            // console.log(nim, ` ${name} Logined`);
            return res.status(200).json({
              Error: false,
              token: token,
              currUser: uid,
              nim: nim,
              message: `Welcome ${name}`,
            });
          }
        });
      } else if (rows[0].status === 0) {
        console.log(rows[0].nim, "Belum Aktif");

        res.status(200).json({
          Error: true,
          message: `Akun (${rows[0].nim}) belum aktif, Hubungi dosen anda untuk mengaktifkan.`,
        });
      } else if (rows[0].status === 10) {
        console.log(rows[0].nim, "Rejected user");

        res.status(200).json({
          Error: true,
          message: `Akun (${rows[0].nim}) ditolak, Hubungi dosen anda untuk mengaktifkan.`,
        });
      }
    } else {
      res.status(200).json({
        Error: true,
        message:
          "Sorry, your nim or password was incorrect. Please double-check your nim or password.",
      });
    }
  });
};

exports.jwtvalidation = function (req, rest) {
  const tokewithBearer = req.headers.authorization;

  if (tokewithBearer) {
    const token = tokewithBearer.split(" ")[1];
    //verif
    jwt.verify(token, secretConf.secret, function (err, decoded) {
      if (err)
        return rest.status(401).send({
          auth: false,
          message: "Invalid Token",
        });
      else {
        return rest.status(200).send({
          auth: true,
          message: "Authorization success",
        });
      }
    });
  } else {
    return rest.status(401).send({
      auth: false,
      message: "Token is required to request this operation",
    });
  }
};

// tes
exports.halamanrahasia = function (req, res) {
  res.status(200).json({
    success: true,
    message: `Okee`,
  });
};
