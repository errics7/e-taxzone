const sequelizeConf = require("../../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const moment = require("moment-timezone");
const users_role = require("../../../models/user_role.model");
const users = require("../../../models/users.model");
const { Op } = require("sequelize");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const req = require("express/lib/request");
moment.locale("id");

exports.getusersconfirmall = async (req, res) => {
  const sqlconfirm = `SELECT id,nim,nama,kelas,role,lastlogin FROM users JOIN role_permission ON users.role=role_permission.role_id WHERE role_permission.role_name=:tp AND users.status_active=:stat and users.status_delete=:dell ORDER BY users.lastlogin DESC`;
  const dataconfirm = await sequelizeConf
    .query(sqlconfirm, {
      replacements: { tp: "mahasiswa", stat: 0, dell: 0 },
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((data) => {
      const dataitems = data.map((item) => {
        const usr = item;
        usr["lastlogin"] = moment(new Date(item.lastlogin)).format(
          // "YYYY-MM-DD HH:mm"
          "HH:mm | DD-MM-YYYY"
        );
        return usr;
      });
      return dataitems;
    })
    .catch((error) => {
      console.log("error1");
      console.log(error);
      return res.status(400).json({
        success: false,
        message: error,
      });
    });

  const sqlreject = `SELECT id,nim,nama,kelas,role,lastlogin FROM users JOIN role_permission ON users.role=role_permission.role_id WHERE role_permission.role_name=:tp AND users.status_active=:stat and users.status_delete=:dell ORDER BY users.lastlogin DESC`;
  const datareject = await sequelizeConf
    .query(sqlreject, {
      replacements: { tp: "mahasiswa", stat: 10, dell: 0 },
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((data) => {
      const dataitems = data.map((item) => {
        const usr = item;
        usr["lastlogin"] = moment(new Date(item.lastlogin)).format(
          // "YYYY-MM-DD HH:mm"
          "HH:mm | DD-MM-YYYY"
        );
        return usr;
      });
      return dataitems;
    })
    .catch((error) => {
      console.log("error 2");
      console.log(error);

      return res.status(400).json({
        success: false,
        message: error,
      });
    });

  res.status(200).json({
    success: true,
    confirm: dataconfirm,
    reject: datareject,
    message: "",
  });
};

exports.confirmRegUserBaru = async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.required(),
    status: Joi.string().min(1).max(15).required().messages({
      "any.required": `"status code" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  console.log(req.body.id);
  console.log(req.body.status);

  var stat = 0;
  var mssg = "";
  if (req.body.status === "deny") {
    stat = 10;
    mssg = `Akun ${req.body.name} telah di Tolak.`;
  }
  if (req.body.status === "allow") {
    stat = 1;
    mssg = `Akun ${req.body.name} Telah aktif.`;
  }
  if (req.body.status === "restore") {
    stat = 0;
    mssg = `Akun ${req.body.name} Telah dikembalikan, dan siap untuk diaktifkan.`;
  }

  if (req.body.status === "deleteforever") {
    mssg = `Akun ${req.body.name} Telah dihapus.`;

    await users
      .destroy({ where: { id: req.body.id }, raw: true })
      .then((data) => {
        console.log(data);

        res.status(200).json({
          success: true,
          message: mssg,
        });
      })
      .catch((error) => {
        res.status(400).json({
          success: false,
          message: error,
        });
      });
  } else {
    await users
      .update(
        { status_active: stat, updated_by: req.auth._id },
        { where: { id: req.body.id }, raw: true }
      )
      .then((data) => {
        console.log(data);

        if (req.body.status === "allow" || req.body.status === "restore") {
          res.status(200).json({
            success: true,
            message: mssg,
          });
        } else {
          res.status(200).json({
            success: false,
            message: mssg,
          });
        }
      })
      .catch((error) => {
        res.status(400).json({
          success: false,
          message: error,
        });
      });
  }
};

exports.getUserdata = async (req, res) => {
  if (req.auth.authorize === "admin" && Number(req.auth._id) === 1) {
    console.log("sadmin call");
    users_role.hasOne(users, { foreignKey: "role" });
    users.belongsTo(users_role, {
      foreignKey: "role",
      targetKey: "role_id",
    });
    await users
      .findAll({
        where: {
          status_active: 1,
          status_delete: 0,
          [Op.or]: [{ role: 1 }, { role: 2 }, { role: 3 }],
          [Op.not]: [{ id: 1 }],
        },
        include: users_role,
        raw: true,
      })
      .then((data) => {
        const dataitems = data.map((item) => {
          const usr = item;
          usr["lastlogin"] = moment(new Date(item.lastlogin)).format(
            // "YYYY-MM-DD HH:mm"
            "HH:mm | DD-MM-YYYY"
          );
          return usr;
        });

        res.status(200).json({
          success: true,
          data: dataitems,
          message: "",
        });
      })
      .catch((error) => {
        res.status(400).json({
          success: false,
          message: error,
        });
      });
  } else if (req.auth.authorize === "admin") {
    users_role.hasOne(users, { foreignKey: "role" });
    users.belongsTo(users_role, {
      foreignKey: "role",
      targetKey: "role_id",
    });
    await users
      .findAll({
        where: {
          status_active: 1,
          status_delete: 0,
          [Op.or]: [{ role: 1 }, { role: 2 }],
        },
        include: users_role,
        raw: true,
      })
      .then((data) => {
        const dataitems = data.map((item) => {
          const usr = item;
          usr["lastlogin"] = moment(new Date(item.lastlogin)).format(
            // "YYYY-MM-DD HH:mm"
            "HH:mm | DD-MM-YYYY"
          );
          return usr;
        });

        res.status(200).json({
          success: true,
          data: dataitems,
          message: "",
        });
      })
      .catch((error) => {
        res.status(400).json({
          success: false,
          message: error,
        });
      });
  } else {
    await users
      .findAll({
        attributes: [
          "id",
          "nim",
          "nama",
          "email",
          "kelas",
          "img_url",
          "lastlogin",
        ],
        where: { role: 1, status_active: 1, status_delete: 0 },
        raw: true,
      })
      .then((data) => {
        const dataitems = data.map((item) => {
          const usr = item;
          usr["lastlogin"] = moment(new Date(item.lastlogin)).format(
            "HH:mm a, DD-MM-YYYY"
          );
          return usr;
        });

        res.status(200).json({
          success: true,
          data: dataitems,
          message: "",
        });
      })
      .catch((error) => {
        res.status(400).json({
          success: false,
          message: error,
        });
      });
  }
};

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.hapusUserDataTemp = async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
    nim: Joi.required(),
    email: Joi.required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  const iddel = makeid(5);

  await users
    .update(
      {
        nim: req.auth._id + "_" + iddel + "_" + req.body.nim,
        email: req.auth._id + "_" + iddel + "_" + req.body.email,
        status_delete: 1,
        updated_by: req.auth._id,
      },
      { where: { id: req.body.id }, raw: true }
    )
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Akun Berhasil dihapus.",
      });
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
    });
};

exports.updateUserData = async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
    nim: Joi.string().min(4).max(25).required().messages({
      "any.required": `"nim" tidak boleh dikosongi`,
    }),
    name: Joi.string().min(4).max(150).required().messages({
      "any.required": `"name" tidak boleh dikosongi`,
    }),
    class: Joi.string().min(1).max(25).required().messages({
      "any.required": `"Kelas" tidak boleh dikosongi`,
    }),
    password: Joi.string().min(1).max(250).required().messages({
      "any.required": `"PWD" tidak boleh dikosongi`,
    }),
    resetpwd: Joi.required().messages({
      "any.required": `"status pwd" tidak boleh dikosongi`,
    }),
    resetnim: Joi.required().messages({
      "any.required": `"status nim" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  //   console.log(req.body);

  //reset nim
  if (req.body.resetnim && req.body.resetpwd) {
    const usr = await users
      .findOne({ where: { nim: req.body.nim }, raw: true })
      .catch((error) => {
        res.status(400).json({
          success: false,
          message: error,
        });
      });
    if (usr) {
      res.status(200).json({
        success: false,
        message: "NIM telah digunakan mahasiswa lain",
      });
    } else {
      // free user
      const salt = await bcrypt.genSalt(10);
      const pwd = await bcrypt.hash(req.body.password, salt);

      await users
        .update(
          {
            nim: req.body.nim,
            nama: req.body.name,
            kelas: req.body.class,
            password: pwd,
            updated_by: req.auth._id,
          },
          { where: { id: req.body.id }, raw: true }
        )
        .then((data) => {
          res.status(200).json({
            success: true,
            message: "Akun Berhasil perbaruhi.",
          });
        })
        .catch((error) => {
          res.status(400).json({
            success: false,
            message: error,
          });
        });
    }
  } else if (req.body.resetnim) {
    const usr = await users
      .findOne({ where: { nim: req.body.nim }, raw: true })
      .catch((error) => {
        res.status(400).json({
          success: false,
          message: error,
        });
      });
    if (usr) {
      res.status(200).json({
        success: false,
        message: "NIM telah digunakan mahasiswa lain",
      });
    } else {
      await users
        .update(
          {
            nim: req.body.nim,
            nama: req.body.name,
            kelas: req.body.class,
            updated_by: req.auth._id,
          },
          { where: { id: req.body.id }, raw: true }
        )
        .then((data) => {
          res.status(200).json({
            success: true,
            message: "Akun Berhasil perbaruhi.",
          });
        })
        .catch((error) => {
          res.status(400).json({
            success: false,
            message: error,
          });
        });
    }
  } else if (req.body.resetpwd) {
    // free user
    const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(req.body.password, salt);

    await users
      .update(
        {
          nama: req.body.name,
          kelas: req.body.class,
          password: pwd,
          updated_by: req.auth._id,
        },
        { where: { id: req.body.id }, raw: true }
      )
      .then((data) => {
        res.status(200).json({
          success: true,
          message: "Akun Berhasil perbaruhi.",
        });
      })
      .catch((error) => {
        res.status(400).json({
          success: false,
          message: error,
        });
      });
  } else {
    await users
      .update(
        {
          nama: req.body.name,
          kelas: req.body.class,
          updated_by: req.auth._id,
        },
        { where: { id: req.body.id }, raw: true }
      )
      .then((data) => {
        res.status(200).json({
          success: true,
          message: "Akun Berhasil perbaruhi.",
        });
      })
      .catch((error) => {
        res.status(400).json({
          success: false,
          message: error,
        });
      });
  }
};

exports.buatUserBaru = async (req, res) => {
  const schema = Joi.object({
    nim: Joi.string().min(3).max(25).required(),
    name: Joi.string().min(3).max(150).required(),
    kelas: Joi.string().min(1).max(35).required(),
    email: Joi.string().max(50).allow(null, ""),
    password: Joi.string().min(1).max(150).required(),
    role: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  console.log(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Terjadi Kesalahan input, " + error.message,
    });
  }

  // check user nim exist
  let usr = await users
    .findOne({
      where: { nim: req.body.nim },
      // logging: console.log,
      raw: true,
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });

  if (!usr) {
    // free user
    const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(req.body.password, salt);
    var rol = 1;
    if (req.body.role === "dosen") {
      rol = 2;
    } else if (req.body.role === "admin") {
      rol = 3;
    } else {
      rol = 1;
    }

    await users
      .create({
        nim: req.body.nim,
        nama: req.body.name,
        kelas: req.body.kelas,
        email: req.body.email,
        status_active: 1,
        role: rol,
        password: pwd,
      })
      .then((data) => {
        // console.log(data);
        res.status(200).json({
          success: true,
          message: `${req.body.name} Berhasil Terdaftar.`,
        });
      })
      .catch((error) => {
        res.status(400).json({
          success: false,
          message: error,
        });
      });
  } else {
    // user existing
    res.status(200).json({
      success: false,
      message: "NIM atau NIP Telah digunakan pada pengguna sebelumnya",
    });
  }
};

exports.getDistinctKelas = async (req, res) => {
  try {
    const kelasList = await users.findAll({
      attributes: ['kelas'],
      where: {
        status_delete: 0, // optional filter
      },
      raw: true,
    });

    // Normalisasi dan filter duplikat
    const kelasMap = new Map();

    for (const item of kelasList) {
      const original = item.kelas?.trim();

      // Skip data yang berisi "-" atau tidak valid
      if (!original || original === '-') continue;

      const key = original.toLowerCase();

      // Pilih yang sudah tersimpan atau simpan versi baru jika lebih "baik"
      if (!kelasMap.has(key)) {
        kelasMap.set(key, original);
      } else {
        const existing = kelasMap.get(key);
        // Simpan yang lebih kompleks, misalnya dengan huruf kapital
        if (original > existing) {
          kelasMap.set(key, original);
        }
      }
    }

    const options = Array.from(kelasMap.values()).map((kelas) => ({
      label: kelas,
      value: kelas,
    }));

    return res.json({ success: true, data: options });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
