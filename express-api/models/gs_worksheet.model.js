const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema
const gs_worksheet = sequelizeConf.define(
  "gs_worksheet",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    //
    gs1: {
      type: DataTypes.INTEGER,
    },
    gs1_title: {
      type: DataTypes.STRING,
    },
    gs1_deskripsi: {
      type: DataTypes.STRING,
    },
    gs1_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs2: {
      type: DataTypes.INTEGER,
    },
    gs2_title: {
      type: DataTypes.STRING,
    },
    gs2_deskripsi: {
      type: DataTypes.STRING,
    },
    gs2_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs3: {
      type: DataTypes.INTEGER,
    },
    gs3_title: {
      type: DataTypes.STRING,
    },
    gs3_deskripsi: {
      type: DataTypes.STRING,
    },
    gs3_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs4: {
      type: DataTypes.INTEGER,
    },
    gs4_title: {
      type: DataTypes.STRING,
    },
    gs4_deskripsi: {
      type: DataTypes.STRING,
    },
    gs4_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs5: {
      type: DataTypes.INTEGER,
    },
    gs5_title: {
      type: DataTypes.STRING,
    },
    gs5_deskripsi: {
      type: DataTypes.STRING,
    },
    gs5_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs6: {
      type: DataTypes.INTEGER,
    },
    gs6_title: {
      type: DataTypes.STRING,
    },
    gs6_deskripsi: {
      type: DataTypes.STRING,
    },
    gs6_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs7: {
      type: DataTypes.INTEGER,
    },
    gs7_title: {
      type: DataTypes.STRING,
    },
    gs7_deskripsi: {
      type: DataTypes.STRING,
    },
    gs7_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs8: {
      type: DataTypes.INTEGER,
    },
    gs8_title: {
      type: DataTypes.STRING,
    },
    gs8_deskripsi: {
      type: DataTypes.STRING,
    },
    gs8_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs9: {
      type: DataTypes.INTEGER,
    },
    gs9_title: {
      type: DataTypes.STRING,
    },
    gs9_deskripsi: {
      type: DataTypes.STRING,
    },
    gs9_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs10: {
      type: DataTypes.INTEGER,
    },
    gs10_title: {
      type: DataTypes.STRING,
    },
    gs10_deskripsi: {
      type: DataTypes.STRING,
    },
    gs10_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs11: {
      type: DataTypes.INTEGER,
    },
    gs11_title: {
      type: DataTypes.STRING,
    },
    gs11_deskripsi: {
      type: DataTypes.STRING,
    },
    gs11_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs12: {
      type: DataTypes.INTEGER,
    },
    gs12_title: {
      type: DataTypes.STRING,
    },
    gs12_deskripsi: {
      type: DataTypes.STRING,
    },
    gs12_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs13: {
      type: DataTypes.INTEGER,
    },
    gs13_title: {
      type: DataTypes.STRING,
    },
    gs13_deskripsi: {
      type: DataTypes.STRING,
    },
    gs13_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs14: {
      type: DataTypes.INTEGER,
    },
    gs14_title: {
      type: DataTypes.STRING,
    },
    gs14_deskripsi: {
      type: DataTypes.STRING,
    },
    gs14_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs15: {
      type: DataTypes.INTEGER,
    },
    gs15_title: {
      type: DataTypes.STRING,
    },
    gs15_deskripsi: {
      type: DataTypes.STRING,
    },
    gs15_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs16: {
      type: DataTypes.INTEGER,
    },
    gs16_title: {
      type: DataTypes.STRING,
    },
    gs16_deskripsi: {
      type: DataTypes.STRING,
    },
    gs16_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs17: {
      type: DataTypes.INTEGER,
    },
    gs17_title: {
      type: DataTypes.STRING,
    },
    gs17_deskripsi: {
      type: DataTypes.STRING,
    },
    gs17_img_path: {
      type: DataTypes.STRING,
    },
    //
    gs18: {
      type: DataTypes.INTEGER,
    },
    gs18_title: {
      type: DataTypes.STRING,
    },
    gs18_deskripsi: {
      type: DataTypes.STRING,
    },
    gs18_img_path: {
      type: DataTypes.STRING,
    },
    //
    // PERDAGANGAN SECTION
    //
    prdg1: {
      type: DataTypes.INTEGER,
    },
    prdg1_title: {
      type: DataTypes.STRING,
    },
    prdg1_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg1_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg2: {
      type: DataTypes.INTEGER,
    },
    prdg2_title: {
      type: DataTypes.STRING,
    },
    prdg2_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg2_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg3: {
      type: DataTypes.INTEGER,
    },
    prdg3_title: {
      type: DataTypes.STRING,
    },
    prdg3_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg3_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg4: {
      type: DataTypes.INTEGER,
    },
    prdg4_title: {
      type: DataTypes.STRING,
    },
    prdg4_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg4_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg5: {
      type: DataTypes.INTEGER,
    },
    prdg5_title: {
      type: DataTypes.STRING,
    },
    prdg5_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg5_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg6: {
      type: DataTypes.INTEGER,
    },
    prdg6_title: {
      type: DataTypes.STRING,
    },
    prdg6_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg6_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg7: {
      type: DataTypes.INTEGER,
    },
    prdg7_title: {
      type: DataTypes.STRING,
    },
    prdg7_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg7_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg8: {
      type: DataTypes.INTEGER,
    },
    prdg8_title: {
      type: DataTypes.STRING,
    },
    prdg8_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg8_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg9: {
      type: DataTypes.INTEGER,
    },
    prdg9_title: {
      type: DataTypes.STRING,
    },
    prdg9_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg9_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg10: {
      type: DataTypes.INTEGER,
    },
    prdg10_title: {
      type: DataTypes.STRING,
    },
    prdg10_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg10_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg11: {
      type: DataTypes.INTEGER,
    },
    prdg11_title: {
      type: DataTypes.STRING,
    },
    prdg11_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg11_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg12: {
      type: DataTypes.INTEGER,
    },
    prdg12_title: {
      type: DataTypes.STRING,
    },
    prdg12_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg12_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg13: {
      type: DataTypes.INTEGER,
    },
    prdg13_title: {
      type: DataTypes.STRING,
    },
    prdg13_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg13_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg14: {
      type: DataTypes.INTEGER,
    },
    prdg14_title: {
      type: DataTypes.STRING,
    },
    prdg14_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg14_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg15: {
      type: DataTypes.INTEGER,
    },
    prdg15_title: {
      type: DataTypes.STRING,
    },
    prdg15_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg15_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg16: {
      type: DataTypes.INTEGER,
    },
    prdg16_title: {
      type: DataTypes.STRING,
    },
    prdg16_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg16_img_path: {
      type: DataTypes.STRING,
    },
    //
    prdg17: {
      type: DataTypes.INTEGER,
    },
    prdg17_title: {
      type: DataTypes.STRING,
    },
    prdg17_deskripsi: {
      type: DataTypes.STRING,
    },
    prdg17_img_path: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    //
    created_by: {
      type: DataTypes.INTEGER,
    },
    updated_by: {
      type: DataTypes.INTEGER,
    },
    created_date: {
      type: DataTypes.DATE(6),
    },
    updated_date: {
      type: DataTypes.DATE(6),
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_date",
    updatedAt: "updated_date",
  }
);

// Export model
module.exports = gs_worksheet;
