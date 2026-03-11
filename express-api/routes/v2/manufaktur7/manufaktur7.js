const Joi = require("joi");
const gs7_config = require("../../../models/gsak1/gs7_config.model");

exports.updategsdata = async (req, res) => {
  const schema = Joi.object({
    idc: Joi.number().integer().required().messages({
      "any.required": `"tag id" tidak boleh dikosongi`,
    }),
    dataConf: Joi.required().messages({
      "any.required": `"Data Config" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  //
  const dataConf = req.body.dataConf;
  // UPDATE CONFIG
  await gs7_config
    .update(
      {
        narasisoal: dataConf.narasisoal,
        kp_kelompok: dataConf.kp_kelompok,
        kp_namabarang: dataConf.kp_namabarang,
        kp_tgl1: dataConf.kp_tgl1,
        kp_tgl2: dataConf.kp_tgl2,
        kp_tgl3: dataConf.kp_tgl3,
        kp_keterangan2: dataConf.kp_keterangan2,
        kp_keterangan3: dataConf.kp_keterangan3,
        kp_nobukti2: dataConf.kp_nobukti2,
        kp_nobukti3: dataConf.kp_nobukti3,
        kp_mk3: dataConf.kp_mk3,
        kp_mh3: dataConf.kp_mh3,
        kp_mj3: dataConf.kp_mj3,
        kp_kk2: dataConf.kp_kk2,
        kp_kh2: dataConf.kp_kh2,
        kp_kj2: dataConf.kp_kj2,
        kp_saldok1: dataConf.kp_saldok1,
        kp_saldok2: dataConf.kp_saldok2,
        kp_saldok3: dataConf.kp_saldok3,
        kp_saldoh1: dataConf.kp_saldoh1,
        kp_saldoh2: dataConf.kp_saldoh2,
        kp_saldoh3: dataConf.kp_saldoh3,
        kp_saldoj1: dataConf.kp_saldoj1,
        kp_saldoj2: dataConf.kp_saldoj2,
        kp_saldoj3: dataConf.kp_saldoj3,
        fp_no: dataConf.fp_no,
        fp_nama: dataConf.fp_nama,
        updated_by: req.auth._id,
      },
      {
        where: { id: req.body.idc },
        raw: true,
      }
    )
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Data Berhasil diperbarui",
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });
  // end batch insert
};

exports.selected = async (req, res) => {
  const schema = Joi.object({
    tagId: Joi.number().integer().required().messages({
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
  //
  var tagid = Number(req.params.tagId);

  await gs7_config
    .findOne({
      where: { id: tagid },
      raw: true,
    })
    .then((data) => {
      res.status(200).json({
        success: data ? true : false,
        config: data,
        message: data ? "" : "Tidak Ada data pada Game Simulasi ini.",
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });
};

exports.selectedMahasiswaSoal = async (req, res) => {
  //
  var tagid = Number(req.params.tagId);
  if (Number.isNaN(tagid)) {
    res.status(400).json({
      message: "data tidak valid",
    });
    return;
  }

  var dataConfig = await new Promise((resolve, reject) => {
    const sql = `SELECT * FROM gs7_config where id=${tagid}`;
    db.query(sql, (err, result) => {
      if (err) reject(err);
      if (result.length) {
        resolve(result[0]);
      } else resolve([]);
    });
  });

  res.json({
    config: dataConfig,
  });
};
