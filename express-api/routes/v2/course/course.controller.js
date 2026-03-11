const Joi = require("joi");
const { Sequelize } = require("sequelize");
const sequelizeConf = require("../../../config/sequelizeconf");
const db = require("../../../config/database");
const course = require("../../../models/course.model");
const scenario = require("../../../models/scenario.model");
const gs_worksheet = require("../../../models/gs_worksheet.model");
const worksheet = require("../../../models/worksheet.model");

exports.datakelasuser = async (req, res) => {
  const quer =
    "SELECT course.scen_id,scenario.nama,scenario.code,scenario.worksheet_id,scenario.virtualtour_id,course.created_date AS tanggal_masuk FROM course JOIN scenario ON course.scen_id=scenario.id WHERE course.user_id=:id AND course.STATUS=:stc AND scenario.status_delete=:stds";

  const cours = await sequelizeConf
    .query(quer, {
      replacements: { id: req.auth._id, stc: 1, stds: 0 },
      // logging: console.log,
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        success: false,
        message: "Terjadi kesalahan Server silakan ulangi beberapa saat lagi",
      });
    });

  res.status(200).json({
    success: true,
    data: cours,
    message: cours.length > 0 ? "" : "Anda Belum memiliki kelas.",
  });
};

exports.cariKelasScenMhs = async (req, res) => {
  const schema = Joi.object({
    kode: Joi.string().min(4).max(10).required().messages({
      "string.empty": `"Kode" harus diisi`,
      "string.min": `"kode" Tidak valid`,
      "string.max": `"kode" Tidak valid`,
      "any.required": `"kode" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  await scenario
    .findOne({
      where: { code: req.body.kode, status_delete: 0 },
    })
    .then((data) => {
      res.status(200).json({
        success: true,
        data: data,
        message: data ? "" : "Kode Tidak Valid",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        success: false,
        message: "Terjadi kesalahan silakan ulangi beberapa saat lagi",
      });
    });
};

exports.enrollKelasScenMhs = async (req, res) => {
  const schema = Joi.object({
    kelas_id: Joi.required().messages({
      "string.empty": `"kelas id" harus diisi`,
      "any.required": `"kelas id" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  const courses = await course
    .findAll({
      where: {
        user_id: req.auth._id,
        scen_id: req.body.kelas_id,
      },
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        success: false,
        message: "Terjadi kesalahan silakan ulangi beberapa saat lagi",
      });
    });

  console.log(courses);
  if (courses.length > 0) {
    if (courses[0].status === 1) {
      res.status(200).json({
        success: false,
        message: "Anda sudah masuk kedalam kelas ini",
      });
    } else if (courses[0].status === 0) {
      res.status(200).json({
        success: false,
        message: "Anda dikeluarkan dari kelas ini, silahkan hubungi dosen.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Terjadi Kesalahan",
      });
    }
  } else {
    await course
      .create({
        user_id: req.auth._id,
        scen_id: req.body.kelas_id,
        created_by: req.auth._id,
      })
      .then(async (data) => {
        await scenario
          .increment(
            { subscriber_count: 1 },
            { where: { id: req.body.kelas_id } }
          )
          .then((da) => {
            // console.log(da);
            res.status(200).json({
              success: true,
              message: "Berhasil menambahkan kelas",
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(400).json({
              success: false,
              message: "Terjadi kesalahan silakan ulangi beberapa saat lagi",
            });
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({
          success: false,
          message: "Terjadi kesalahan silakan ulangi beberapa saat lagi",
        });
      });
  }
};

exports.selectedkelasgamesimulasi = async (req, res) => {
  const schema = Joi.object({
    scen_id: Joi.number().integer().required().messages({
      "any.required": `"Scenario id" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  // Success Fileter Input
  const quer =
    "SELECT*FROM course JOIN scenario ON course.scen_id=scenario.id WHERE course.user_id=:user_id AND scen_id=:scen_id AND scenario.status_delete=:scendelt";
  const validCourse = await sequelizeConf
    .query(quer, {
      replacements: {
        user_id: req.auth._id,
        scen_id: req.body.scen_id,
        scendelt: 0,
      },
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((x) => x[0])
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        success: false,
        message: "Terjadi kesalahan silakan ulangi beberapa saat lagi",
      });
    });
  console.log(validCourse);
  if (!validCourse) {
    return res.status(200).json({
      success: false,
      data: null,
      message: "Anda belum terdaftar dalam kelas ini",
    });
  }
  if (validCourse.status === 0) {
    return res.status(200).json({
      success: false,
      data: null,
      message: "Anda Telah dikeluarkan dalam kelas ini",
    });
  } else {

    const query = `
    SELECT 
      w.*, 
      ws.class_id, 
      ws.start_time, 
      ws.end_time, 
      ws.question_count,
      CASE WHEN sr.id IS NOT NULL THEN true ELSE false END AS is_completed
    FROM 
      worksheet w
    LEFT JOIN 
      worksheet_schedules ws 
    ON 
      ws.worksheet_id = w.id
    LEFT JOIN
      student_results sr
    ON
      sr.worksheet_id = w.id AND sr.student_id = :studentId
    WHERE 
      w.status_delete = 0
      AND w.scenario_id = :scenarioId
      AND w.status = 1
    `;

    await sequelizeConf
      .query(query, {
        replacements: {
          scenarioId: req.body.scen_id,
          studentId: req.auth._id,
        },
        plain: false,
        raw: true,
        type: Sequelize.QueryTypes.SELECT,
      })
      .then((result) => {
          const uniqueData = result.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.id === item.id)
          );
        res.status(200).json({
          success: true,
          data: uniqueData,
          message: "",
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).json({
          success: false,
          message: "Terjadi kesalahan silakan ulangi beberapa saat lagi",
        });
      });
  }
};