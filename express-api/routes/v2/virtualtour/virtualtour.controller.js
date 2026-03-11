const { Sequelize } = require("sequelize");
const sequelizeConf = require("../../../config/sequelizeconf");
const Joi = require("joi");
const gs_virtualtour = require("../../../models/gs_virtualtour.model");
const scenario = require("../../../models/scenario.model");
const vt_area = require("../../../models/vt_area.model");
const vt_items = require("../../../models/vt_items.model");

// Untuk MHS
exports.getCourseVTDataList = async (req, res) => {
  const schema = Joi.object({
    code: Joi.string().min(4).max(10).required().messages({
      "any.required": `"Scenario code" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.params);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  //#region cek validity
  const quer =
    "SELECT*FROM course JOIN scenario ON course.scen_id=scenario.id WHERE course.user_id=:user_id AND scenario.code=:code AND scenario.status_delete=:scendelt";
  const validCourse = await sequelizeConf
    .query(quer, {
      replacements: {
        user_id: req.auth._id,
        code: req.params.code,
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
  //#endregion

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
    await vt_area
      .findAll({
        where: {
          gsvt_id: validCourse.virtualtour_id,
          status_delete: 0,
        },
        raw: true,
      })
      .then((data) => {
        console.log(data);
        res.status(200).json({
          success: true,
          data: data,
          message:
            data.length > 0 ? "" : "Tidak Ada Area Virtual Tour pada kelas ini",
        });
      })
      .catch((error) =>
        res.status(400).json({
          success: false,
          message: error,
        })
      );
  }
};

exports.getgsVtIdData = async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().messages({
      "any.required": `"Scenario id" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.params);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  await gs_virtualtour
    .findOne({
      where: {
        id: req.params.id,
      },
      raw: true,
    })
    .then((data) => {
      const d = {
        ...data,
        list: data ? JSON.parse(data.list) : [],
        virtualtour_id: data.id,
      };

      res.status(200).json({
        success: true,
        data: d,
        message: ``,
      });
    })
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );
};

exports.getdatadosenadmin = async (req, res) => {
  const schema = Joi.object({
    code: Joi.string().min(4).max(10).required(),
  });
  const { error } = schema.validate(req.params);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  const code = req.params.code;
  const isAdm = req.auth.authorize === "admin" ? true : false;

  //#region filter
  const qr = `SELECT  *  FROM scenario   
                    WHERE
                    scenario.code =:code 
                    ${
                      isAdm
                        ? " "
                        : "AND scenario.created_by =:idu AND scenario.status_delete=:dell"
                    }`;
  const result_scn = await sequelizeConf
    .query(qr, {
      replacements: { code: code, idu: req.auth._id, dell: 0 },
      // logging: console.log,
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );
  //#endregion

  console.log(result_scn[0]);
  if (result_scn[0]) {
    const quer = `SELECT *  FROM gs_virtualtour
                    JOIN vt_area ON gs_virtualtour.main_id = vt_area.id 
                    WHERE gs_virtualtour.id =:id`;

    await sequelizeConf
      .query(quer, {
        replacements: { id: result_scn[0].virtualtour_id },
        // logging: console.log,
        plain: false,
        raw: true,
        type: Sequelize.QueryTypes.SELECT,
      })
      .then((data) => {
        const d = {
          ...data[0],
          list: data[0] ? JSON.parse(data[0].list) : [],
          virtualtour_id: result_scn[0].virtualtour_id,
        };

        res.status(200).json({
          success: true,
          data: d,
          message: ``,
        });
      })
      .catch((error) =>
        res.status(400).json({
          success: false,
          message: error,
        })
      );
  } else {
    res.status(400).json({
      success: false,
      message: "Alamat url tidak valid atau anda tidak di ijinkan",
    });
  }
};

exports.areaVTByid = async (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required().messages({
      "any.required": `"Scenario id" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.params);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  console.log("find", req.params.id);
  var querwhr =
    req.auth.authorize === "admin"
      ? {
          id: req.params.id,
          status_delete: 0,
        }
      : {
          id: req.params.id,
          created_by: req.auth._id,
          status_delete: 0,
        };

  //#region filter
  const result_scn = await vt_area
    .findOne({
      where: querwhr,
      raw: true,
    })
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );
  //#endregion
  if (result_scn) {
    await vt_items
      .findAll({
        where: {
          area_id: result_scn.id,
          created_by: req.auth._id,
        },
        raw: true,
      })
      .then((data) => {
        res.status(200).json({
          success: true,
          data: {
            ...result_scn,
            items: data,
          },
          message: ``,
        });
      })
      .catch((error) => {
        res.status(400).json({
          success: false,
          message: "error",
        });
      });
  } else {
    res.status(400).json({
      success: false,
      message: "Anda tidak memiliki akses untuk Area ini.",
    });
  }
};

exports.areaVTBaru = async (req, res) => {
  // console.log("save the file", req.file);
  const schema = Joi.object({
    nama: Joi.string().min(2).max(100).required(),
    gsvt_id: Joi.number().integer().required(),
    list: Joi.required(),
    host: Joi.required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  // req.body.host +
  const crt_area = await vt_area
    .create({
      name: req.body.nama,
      gsvt_id: req.body.gsvt_id,
      vtimg_url: "/" + req.file.path,
      created_by: req.auth._id,
    })
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );

  const list = JSON.parse(req.body.list);

  list.push({
    id: crt_area.id,
    name: crt_area.name,
    show: true,
  });
  const main_id = list.length > 0 ? list[0].id : 0;

  await gs_virtualtour
    .update(
      {
        main_id: main_id,
        list: JSON.stringify(list),
        updated_by: req.auth._id,
      },
      { where: { id: req.body.gsvt_id } }
    )
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );
  await scenario
    .update(
      {
        virtualtour_count: list.length,
        updated_by: req.auth._id,
      },
      { where: { virtualtour_id: req.body.gsvt_id } }
    )
    .then(() => {
      res.status(200).json({
        success: true,
        message: `Merhasil Menambahkan Area 360 Baru`,
      });
    })
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );
};

exports.areaDelete = async (req, res) => {
  const schema = Joi.object({
    idvt: Joi.number().integer().required(),
    idarea: Joi.number().integer().required(),
    name: Joi.string().min(2).max(100).required(),
    list: Joi.required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  const crt_area = await vt_area
    .update(
      {
        status_delete: 1,
        updated_by: req.auth._id,
      },
      {
        where: {
          id: req.body.idarea,
        },
      }
    )
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );

  const list = JSON.parse(req.body.list);
  console.log(list);

  const newlist = list.filter((item) => {
    return item.id !== req.body.idarea;
  });
  const main_id = newlist.length > 0 ? newlist[0].id : 0;

  console.log(newlist);

  await gs_virtualtour
    .update(
      {
        main_id: main_id,
        list: JSON.stringify(newlist),
        updated_by: req.auth._id,
      },
      { where: { id: req.body.idvt } }
    )
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );

  await scenario
    .update(
      {
        virtualtour_count: newlist.length,
        updated_by: req.auth._id,
      },
      { where: { virtualtour_id: req.body.idvt } }
    )
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );

  await vt_items
    .destroy({
      where: { area_id: req.body.idarea },
      force: true,
    })
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );

  res.status(200).json({
    success: true,
    message: `Berhasil Menghapus ${req.body.name}`,
  });
};

exports.areaEdit = async (req, res) => {
  const schema = Joi.object({
    idvt: Joi.number().integer().required(),
    idarea: Joi.number().integer().required(),
    newname: Joi.string().min(2).max(100).required(),
    list: Joi.required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  const crt_area = await vt_area
    .update(
      {
        name: req.body.newname,
        updated_by: req.auth._id,
      },
      {
        where: {
          id: req.body.idarea,
        },
      }
    )
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );

  const list = JSON.parse(req.body.list);
  const newlist = list.map((item) => {
    return item.id !== req.body.idarea
      ? item
      : { ...item, name: req.body.newname };
  });
  const main_id = newlist.length > 0 ? newlist[0].id : 0;

  await gs_virtualtour
    .update(
      {
        main_id: main_id,
        list: JSON.stringify(newlist),
        updated_by: req.auth._id,
      },
      { where: { id: req.body.idvt } }
    )
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );

  res.status(200).json({
    success: true,
    message: `Pembaruhan data berhasil`,
  });
};

//#region Config dosen Admin
exports.getdataareabyidcode = async (req, res) => {
  const schema = Joi.object({
    code: Joi.string().min(4).max(10).required(),
    id: Joi.number().integer().required().messages({
      "any.required": `"Scenario id" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.params);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  const code = req.params.code;
  const _id = req.params.id;
  const isAdm = req.auth.authorize === "admin" ? true : false;

  //#region filter
  const qr = `SELECT  *  FROM scenario join gs_virtualtour on scenario.virtualtour_id=gs_virtualtour.id
                    WHERE
                    scenario.code =:code 
                    ${
                      isAdm
                        ? " "
                        : "AND scenario.created_by =:idu AND scenario.status_delete=:dell"
                    }`;
  const result_scn = await sequelizeConf
    .query(qr, {
      replacements: { code: code, idu: req.auth._id, dell: 0 },
      // logging: console.log,
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((x) => x[0])
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );
  //#endregion
  if (!result_scn) {
    res.status(400).json({
      success: false,
      message:
        "Kelas Virtual Tour tidak ditemukan atau Anda tidak memiliki akses",
    });
  } else {
    // console.log(result_scn);
    const list = JSON.parse(result_scn.list);
    // console.log(_id);
    if (!list.some((e) => Number(e.id) === Number(_id))) {
      res.status(400).json({
        success: false,
        message: "Area tidak ditemukan atau Anda tidak memiliki akses",
      });
    } else {
      const res_area = await vt_area
        .findOne({
          where: {
            id: _id,
          },
          raw: true,
        })
        .catch((error) =>
          res.status(400).json({
            success: false,
            message: error,
          })
        );
      const res_items = await vt_items
        .findAll({
          where: {
            area_id: _id,
          },
          raw: true,
        })
        .catch((error) =>
          res.status(400).json({
            success: false,
            message: error,
          })
        );

      const dat = {
        menu: list,
        area: res_area,
        items_list: res_items ? res_items : [],
      };

      res.status(200).json({
        success: true,
        data: dat,
        message: "",
      });
    }
  }
};

exports.editRotationArea = async (req, res) => {
  const schema = Joi.object({
    idarea: Joi.number().integer().required(),
    pitch: Joi.required(),
    yaw: Joi.required(),
    hfov: Joi.required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  await vt_area
    .update(
      {
        pitch: req.body.pitch,
        yaw: req.body.yaw,
        hfov: req.body.hfov,
        updated_by: req.auth._id,
      },
      {
        where: {
          id: req.body.idarea,
        },
      }
    )
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Berhasil memperbarui data rotasi area",
      });
    })
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );
};

exports.updateAllDatainArea = async (req, res) => {
  const schema = Joi.object({
    idarea: Joi.number().integer().required(),
    gsvt_id: Joi.number().integer().required(),
    list_itemarea: Joi.required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  const list_itemarea = JSON.parse(req.body.list_itemarea);
  var count_itemarea = 0;
  var count_linkarea = 0;
  var count_linkgs = 0;

  list_itemarea.forEach((element) => {
    if (element.type === "itemInfoArea") {
      count_itemarea += 1;
    }
    if (element.type === "itemLinkArea") {
      count_linkarea += 1;
    }
    if (element.type === "itemLinkGS") {
      count_linkgs += 1;
    }
  });

  //#region Updat Area info
  await vt_area
    .update(
      {
        item_count: count_itemarea,
        linkarea_count: count_linkarea,
        linksimulasi_count: count_linkgs,
        updated_by: req.auth._id,
      },
      {
        where: {
          id: req.body.idarea,
        },
      }
    )
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );
  //#endregion
  //#region Update VT Items
  const custData_vt_items = list_itemarea.map((itm) => ({
    ...itm,
    area_id: req.body.idarea,
    gsvt_id: req.body.gsvt_id,
    created_by: req.auth._id,
  }));

  await vt_items
    .destroy({
      where: { area_id: req.body.idarea, gsvt_id: req.body.gsvt_id },
      force: true,
    })
    .then(async () => {
      await vt_items
        .bulkCreate(custData_vt_items)
        .then(() => {
          res.status(200).json({
            success: true,
            message: "Berhasil memperbarui data pada area ini",
          });
        })
        .catch((error) => {
          res.status(400).json({
            success: false,
            message: error,
          });
        });
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
    });
  //#endregion
};

//#region Public Mahasiswa
exports.getdataareabyidcodepublic = async (req, res) => {
  const schema = Joi.object({
    code: Joi.string().min(4).max(10).required(),
    id: Joi.number().integer().required().messages({
      "any.required": `"Scenario id" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.params);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  const code = req.params.code;
  const _id = req.params.id;
  const isAdm =
    req.auth.authorize === "admin" || req.auth.authorize === "dosen"
      ? true
      : false;

  //#region filter
  const qrmhs = `SELECT*FROM course JOIN scenario ON course.scen_id=scenario.id JOIN gs_virtualtour ON scenario.virtualtour_id=gs_virtualtour.id WHERE course.user_id=:uid AND scenario.code=:code AND scenario.status_delete=:dell`;
  const qrdosadm = `SELECT*FROM course JOIN scenario ON course.scen_id=scenario.id JOIN gs_virtualtour ON scenario.virtualtour_id=gs_virtualtour.id WHERE scenario.code=:code AND scenario.status_delete=:dell`;
  const qr = isAdm ? qrdosadm : qrmhs;

  const result_scn = await sequelizeConf
    .query(qr, {
      replacements: { code: code, uid: req.auth._id, dell: 0 },
      // logging: console.log,
      plain: false,
      raw: true,
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((x) => x[0])
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );
  //#endregion
  if (!result_scn) {
    res.status(400).json({
      success: false,
      message:
        "Kelas Virtual Tour tidak ditemukan atau Anda tidak memiliki akses",
    });
  } else {
    // console.log(result_scn);
    const list = JSON.parse(result_scn.list);
    // console.log(_id);
    if (!list.some((e) => Number(e.id) === Number(_id))) {
      res.status(400).json({
        success: false,
        message: "Area tidak ditemukan atau Anda tidak memiliki akses",
      });
    } else {
      const res_area = await vt_area
        .findOne({
          where: {
            id: _id,
          },
          raw: true,
        })
        .catch((error) =>
          res.status(400).json({
            success: false,
            message: error,
          })
        );
      const res_items = await vt_items
        .findAll({
          where: {
            area_id: _id,
          },
          raw: true,
        })
        .catch((error) =>
          res.status(400).json({
            success: false,
            message: error,
          })
        );

      const dat = {
        menu: list,
        area: res_area,
        items_list: res_items ? res_items : [],
      };

      res.status(200).json({
        success: true,
        data: dat,
        message: "",
      });
    }
  }
};
//#endregion

//#region DEFAULT DATA VT SECTION
exports.getdatadefaultAreaByAdmin = async (req, res) => {
  const schema = Joi.object({
    area: Joi.number().integer().required().messages({
      "any.required": `"area id" tidak boleh dikosongi`,
    }),
    id: Joi.number().integer().required().messages({
      "any.required": `"Scenario id" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.params);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  const area = req.params.area;
  const _id = req.params.id;

  //#1 Find Default Area
  const gsvt = await gs_virtualtour
    .findOne({
      where: {
        id: area,
      },
      raw: true,
    })
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );

  if (!gsvt) {
    return res.status(400).json({
      success: false,
      message: "Id Area Tidak Ditemukan",
    });
  }

  console.log(gsvt);
  const list = JSON.parse(gsvt.list);
  // console.log(_id);
  if (!list.some((e) => Number(e.id) === Number(_id))) {
    res.status(400).json({
      success: false,
      message: "Area tidak ditemukan atau Anda tidak memiliki akses",
    });
  } else {
    const res_area = await vt_area
      .findOne({
        where: {
          id: _id,
        },
        raw: true,
      })
      .catch((error) =>
        res.status(400).json({
          success: false,
          message: error,
        })
      );
    const res_items = await vt_items
      .findAll({
        where: {
          area_id: _id,
        },
        raw: true,
      })
      .catch((error) =>
        res.status(400).json({
          success: false,
          message: error,
        })
      );

    const dat = {
      menu: list,
      area: res_area,
      items_list: res_items ? res_items : [],
    };

    res.status(200).json({
      success: true,
      data: dat,
      message: "",
    });
  }
};

exports.setdatadefaultTemplate = async (req, res) => {
  console.log("Start For copy");
  const schema = Joi.object({
    scenid: Joi.number().integer().required().messages({
      "any.required": `"kepada id" tidak boleh dikosongi`,
    }),
    kepada: Joi.number().integer().required().messages({
      "any.required": `"kepada id" tidak boleh dikosongi`,
    }),
    dari: Joi.number().integer().required().messages({
      "any.required": `"dari id" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.message,
    });

  const scenid = req.body.scenid;
  const dari = req.body.dari;
  const to = req.body.kepada;
  //#1 Find Default Area to Copy
  const gsvt = await gs_virtualtour
    .findOne({
      where: {
        id: dari,
      },
      raw: true,
    })
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );

  if (!gsvt) {
    return res.status(400).json({
      success: false,
      message: "Id Area Tidak Ditemukan",
    });
  }
  // data utama
  const newList = [];
  const dictList = [];
  const list = JSON.parse(gsvt.list);
  console.log(list);
  await Promise.all(
    list.map(async (element) => {
      // Area
      // COPY PASTE STEP 1
      let newarea = null;
      await vt_area
        .findOne({ where: { id: element.id }, raw: true })
        .then(async (data) => {
          delete data["id"];
          await vt_area
            .create(
              { ...data, gsvt_id: to, created_by: req.auth._id },
              { raw: true }
            )
            .then((raw) => {
              newList.push({ id: raw.id, name: raw.name, show: true });
              newarea = raw;
            })
            .catch((error) =>
              res.status(400).json({
                success: false,
                message: error,
              })
            );
        })
        .catch((error) =>
          res.status(400).json({
            success: false,
            message: error,
          })
        );
      // ISI Items
      // COPY PASTE STEP 2
      const itemOrigin = await vt_items
        .findAll({
          where: {
            area_id: element.id,
            gsvt_id: dari,
          },
          raw: true,
        })
        .catch((error) =>
          res.status(400).json({
            success: false,
            message: error,
          })
        );
      // paste
      const custItems = itemOrigin.map((itm) => {
        //rm primary key
        delete itm["id"];
        return {
          ...itm,
          area_id: newarea.id,
          gsvt_id: Number(to),
          created_by: req.auth._id,
        };
      });
      // Bulk
      await vt_items.bulkCreate(custItems).catch((error) => {
        res.status(400).json({
          success: false,
          message: error,
        });
      });
      // create temp for rename id source link area
      dictList.push({
        ...element,
        old_id: element.id,
        new_id: newarea.id,
      });
    })
  );

  // recheck  for rename id source link area
  await Promise.all(
    dictList.map(async (el) => {
      const itemnewOrigin = await vt_items
        .findAll({
          where: {
            area_id: el.new_id,
            gsvt_id: Number(to),
          },
          raw: true,
        })
        .catch((error) =>
          res.status(400).json({
            success: false,
            message: error,
          })
        );
      //replacing
      const updatenewItems = itemnewOrigin.map((itm) => {
        if (itm.type === "itemLinkArea") {
          const dict = dictList.find(
            (x) => Number(x.old_id) === Number(itm.to_id)
          );
          console.log(dict);
          console.log("Now Replacing item_id: " + itm.id);
          console.log("old ; " + dict.old_id + " to new: " + dict.new_id);
          //rm primary key
          return {
            ...itm,
            to_id: Number(dict.new_id),
          };
        } else {
          //rm primary key
          return {
            ...itm,
          };
        }
      });
      // update
      console.log("data update bulk");
      console.log(updatenewItems);
      // Bulk
      await vt_items
        .destroy({ where: { area_id: el.new_id, gsvt_id: Number(to) } })
        .then(async () => {
          await vt_items.bulkCreate(updatenewItems).catch((error) => {
            res.status(400).json({
              success: false,
              message: error,
            });
          });
        })
        .catch((error) => {
          res.status(400).json({
            success: false,
            message: error,
          });
        });
    })
  );

  const main_id = newList.length > 0 ? newList[0].id : 0;
  //#2 Paste conf tujuan to
  await gs_virtualtour
    .update(
      {
        main_id: main_id,
        list: JSON.stringify(newList),
        updated_by: req.auth._id,
      },
      {
        where: {
          id: to,
        },
      }
    )
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );

  await scenario
    .update(
      {
        virtualtour_count: newList.length,
        updated_by: req.auth._id,
      },
      {
        where: {
          id: scenid,
        },
      }
    )
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: error,
      })
    );

  res.status(200).json({
    success: true,
    message: "Berhasil Mengatur Template Virtual Tour",
  });
};
//#endregion

// update posisi menu area
exports.updateposisiAreaMenu = async (req, res) => {
  const schema = Joi.object({
    arealist: Joi.required().messages({
      "any.required": `"list area" tidak boleh dikosongi`,
    }),
    id: Joi.number().integer().required().messages({
      "any.required": `"Scenario id" tidak boleh dikosongi`,
    }),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(200).json({
      success: false,
      message: error.message,
    });

  await gs_virtualtour
    .update(
      {
        list: req.body.arealist,
        updated_by: req.auth._id,
      },
      { where: { id: req.body.id } }
    )
    .then(() => {
      res.status(200).json({
        success: true,
        message: "Berhasil memperbarui area menu.",
      });
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
    });
};
