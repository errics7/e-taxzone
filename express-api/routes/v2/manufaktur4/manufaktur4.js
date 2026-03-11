const Joi = require("joi");
const gs4_config = require("../../../models/gsak1/gs4_config.model");
const gs4_data = require("../../../models/gsak1/gs4_data.model");

// app.get("/bankakun/selected",
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
  var tagid = Number(req.params.tagId);
  //
  var dataConfig = await gs4_config
    .findOne({
      where: { id: tagid },
      raw: true,
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });
  var listsoal = await gs4_data
    .findAll({
      where: {
        id_config: tagid,
      },
      raw: true,
    })
    .then((result) => {
      if (result.length) {
        const data = result.map((item) => {
          const da = item;
          da["status"] = item.status !== 0 ? true : false;
          da["drag_keterangan"] = item.keperluan;
          da["drag_keluarqty"] = item.keluarqty;
          da["drag_hrgsatuan"] = item.hrgsatuan;
          return da;
        });
        return data;
      } else return [];
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
    });
  //DRAG
  if (!dataConfig) {
    //not found
    res.json({
      success: dataConfig ? true : false,
      message: dataConfig ? "" : "Tidak Ada data pada Game Simulasi ini.",
    });
  } else {
    var soaldrag = await new Promise((resolve, reject) => {
      const dat = [...listsoal].find((el) => el.status === true);
      dat["drag_tglbgudang"] = dataConfig.info_tglbgudang;
      dat["drag_keterangan"] = dat.keperluan;
      dat["drag_nobppb"] = dataConfig.nobppb;
      dat["drag_keluarqty"] = dat.keluarqty;
      dat["drag_hrgsatuan"] = dat.hrgsatuan;

      resolve(dat);
    });

    res.json({
      success: dataConfig ? true : false,
      dataSoal: listsoal,
      config: dataConfig,
      draggable: { ...dataConfig, ...soaldrag },
      message: dataConfig ? "" : "Tidak Ada data pada Game Simulasi ini.",
    });
  }
};

exports.updategsdata = async (req, res) => {
  const schema = Joi.object({
    idc: Joi.required().messages({
      "any.required": `"Data id" tidak boleh dikosongi`,
    }),
    dataconf: Joi.required().messages({
      "any.required": `"Data Config" tidak boleh dikosongi`,
    }),
    data: Joi.required().messages({
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
  //   console.log(req.body.idc);
  const data = req.body.data;
  const dataconf = req.body.dataconf;
  // removing old
  var proc1 = await gs4_data
    .destroy({
      where: { id_config: req.body.idc },
      force: true,
    })
    .then(async () => {
      const cdata = data.map((itm, index) => {
        delete itm["id"];
        return {
          ...itm,
          id_config: req.body.idc,
        };
      });
      //  BAtch
      if (cdata.length > 0) {
        await gs4_data.bulkCreate(cdata).catch((error) => {
          res.status(500).json({
            success: false,
            message: error,
          });
        });
      }
    })
    .catch((error) =>
      res.status(500).json({
        success: false,
        message: error,
      })
    );

  var proc3 = await gs4_config
    .update(
      {
        title: dataconf.title,
        deskripsi: dataconf.deskripsi,
        info: dataconf.info,
        narasisoal: dataconf.narasisoal,
        nobppb: dataconf.nobppb,
        info_tglpbahan: dataconf.info_tglpbahan,
        info_tglbgudang: dataconf.info_tglbgudang,
        info_tglkbagian: dataconf.info_tglkbagian,
        tgl_mutasikeluar: dataconf.tgl_mutasikeluar,
        sal_kwt: dataconf.sal_kwt,
        sal_harga: dataconf.sal_harga,
        sal_jumlah: dataconf.sal_jumlah,
        updated_by: req.auth._id,
      },
      {
        where: { id: req.body.idc },
        raw: true,
      }
    )
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: error,
      });
      return;
    });

  res.status(200).json({
    status: 200,
    success: true,
    message: "Data Berhasil diperbarui",
  });
};
