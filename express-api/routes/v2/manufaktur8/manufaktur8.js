const Joi = require("joi");
const gs8_config = require("../../../models/gsak1/gs8_config.model");

exports.updategsdata = async (req, res) => {
  const schema = Joi.object({
    idc: Joi.required().messages({
      "any.required": `"Data id" tidak boleh dikosongi`,
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
  await gs8_config
    .update(
      {
        narasisoal: dataConf.narasisoal,
        ktanggal: dataConf.ktanggal,
        knamarek: dataConf.knamarek,
        knobukti: dataConf.knobukti,
        kpbb1: dataConf.kpbb1,
        kpbb2: dataConf.kpbb2,
        kpppn1: dataConf.kpppn1,
        kpppn2: dataConf.kpppn2,
        kkhd1: dataConf.kkhd1,
        kkhd2: dataConf.kkhd2,
        fpnomorf: dataConf.fpnomorf,
        fpno: dataConf.fpno,
        fpnama: dataConf.fpnama,
        fpalamat: dataConf.fpalamat,
        fpnpwp: dataConf.fpnpwp,
        fpskpengukuhan: dataConf.fpskpengukuhan,
        fptglfaktur: dataConf.fptglfaktur,
        fpitmno: dataConf.fpitmno,
        fpitmnama: dataConf.fpitmnama,
        fpitmkuantum: dataConf.fpitmkuantum,
        fpitmsatuan: dataConf.fpitmsatuan,
        fpitmtgl: dataConf.fpitmtgl,
        fpitmpemilik: dataConf.fpitmpemilik,
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

  await gs8_config
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
