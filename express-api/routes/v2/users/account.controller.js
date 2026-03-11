const sequelizeConf = require("../../../config/sequelizeconf");
const { Sequelize } = require("sequelize");
const Joi = require("joi");
const users = require("../../../models/users.model");
const users_detail = require("../../../models/users_detail.model");
const bcrypt = require("bcrypt");

exports.showuser = async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().messages({
      "any.required": `"tag id" tidak boleh dikosongi`,
      "number.base": `"tag id" Tidak valid pastikan alamat url sesuai.`,
    }),
  });
  const { error } = schema.validate(req.params);
  if (error)
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  //
  var iduser = req.params.id;
  //
  const sql = `
      SELECT users.nama, users.nim, users.img_url, users.email, users_detail.ttl, users_detail.alamat, users_detail.no_tlfn 
      FROM users 
      LEFT JOIN users_detail on users.id= users_detail.id_user 
      where users.id =:iduser`;
  var data = await sequelizeConf
    .query(sql, {
      replacements: {
        iduser: iduser,
      },
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((result) => {
      res.status(200).json({
        success: result[0] ? true : false,
        akun: result[0],
        message: result[0] ? "" : "Tidak Ada data pada Game Simulasi ini.",
      });
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error,
      })
    );
};

exports.updatedatamyaccount = async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().messages({
      "any.required": `"tag id" tidak boleh dikosongi`,
      "number.base": `"tag id" Tidak valid pastikan alamat url sesuai.`,
    }),
    nim: Joi.string().min(4).max(150).required().messages({
      "any.required": `"nim" tidak boleh dikosongi`,
    }),
    nama: Joi.string().min(4).max(250).required().messages({
      "any.required": `"name" tidak boleh dikosongi`,
    }),
    email: Joi.string().min(3).max(250).required().messages({
      "any.required": `"email" tidak boleh dikosongi`,
    }),
    ttl: Joi.string().min(3).max(25).required().messages({
      "any.required": `"ttl" tidak boleh dikosongi`,
    }),
    alamat: Joi.string().min(10).max(250).required().messages({
      "any.required": `"alamat" tidak boleh dikosongi`,
    }),
    no_tlfn: Joi.string().min(6).max(100).required().messages({
      "any.required": `"no_tlfn" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  //
  await users
    .findOne({ where: { email: req.body.email }, raw: true })
    .then(async (usr) => {
      if (!usr || (usr && usr.id === req.body.id)) {
        await users
          .update(
            {
              nama: req.body.nama,
              email: req.body.email,
              updated_by: req.auth._id,
            },
            { where: { id: req.body.id }, raw: true }
          )
          .then(async (data) => {
            const f = await users_detail.findOne({
              where: { id_user: req.body.id },
              raw: true,
            });
            if (f) {
              await users_detail
                .update(
                  {
                    ttl: req.body.ttl,
                    alamat: req.body.alamat,
                    no_tlfn: req.body.no_tlfn,
                  },
                  {
                    where: { id_user: req.body.id },
                    raw: true,
                  }
                )
                .then(() => {
                  res.status(200).json({
                    success: true,
                    message: "Berhasil memperbaruhi data.",
                  });
                })
                .catch((error) => {
                  res.status(400).json({
                    success: false,
                    message: error,
                  });
                });
            } else {
              await users_detail
                .create(
                  {
                    id_user: req.body.id,
                    ttl: req.body.ttl,
                    alamat: req.body.alamat,
                    no_tlfn: req.body.no_tlfn,
                  },
                  {
                    raw: true,
                  }
                )
                .then(() => {
                  res.status(200).json({
                    success: true,
                    message: "Berhasil memperbaruhi data.",
                  });
                })
                .catch((error) => {
                  res.status(400).json({
                    success: false,
                    message: error,
                  });
                });
            }
          })
          .catch((error) => {
            res.status(400).json({
              success: false,
              message: error,
            });
          });
      } else {
        res.status(200).json({
          success: false,
          message:
            "Email yang anda masukkan telah digunakan pada user lain. mohon gunakan email yang lain.",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
    });
};

exports.updatepassworddata = async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().messages({
      "any.required": `"tag id" tidak boleh dikosongi`,
      "number.base": `"tag id" Tidak valid pastikan alamat url sesuai.`,
    }),
    oldpass: Joi.string().min(4).max(150).required().messages({
      "any.required": `"Password" tidak boleh dikosongi`,
    }),
    newpass: Joi.string().min(4).max(150).required().messages({
      "any.required": `"Password" tidak boleh dikosongi`,
    }),
    repass: Joi.string().min(4).max(150).required().messages({
      "any.required": `"Password" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(200).json({
      success: false,
      message: error.message,
    });

  // #1 Find User
  await users
    .findOne({
      where: { id: req.body.id },
      raw: true,
    })
    .then(async (data) => {
      if (data) {
        //VALID Password
        const cekpwd = await bcrypt.compare(req.body.oldpass, data.password);
        if (!cekpwd) {
          res.status(200).json({
            success: false,
            message: "Password Lama yang anda masukkan salah",
          });
        } else if (cekpwd && req.body.newpass === req.body.oldpass) {
          res.status(200).json({
            success: false,
            message:
              "Tidak ada perubahan password, Pastikan password baru bukan dari password lama.",
          });
        } else {
          //Lulus
          const salt = await bcrypt.genSalt(10);
          const pwd = await bcrypt.hash(req.body.newpass, salt);
          await users
            .update(
              { password: pwd, updated_by: req.auth._id },
              { where: { id: data.id } }
            )
            .catch((error) => {
              res.status(400).json({
                success: false,
                message: error,
              });
            });
          res.status(200).json({
            success: true,
            message: `Password Berhasil diperbarui.`,
          });
        }
      } else {
        res.status(200).json({
          success: false,
          message: "Id User Tidak di temukan",
        });
      }
    })
    .catch((error) => {
      console.log("catch");
      console.log(error);

      res.status(400).json({
        success: false,
        message: "Terjadi kesalahan silakan ulangi beberapa saat lagi",
      });
    });
};
