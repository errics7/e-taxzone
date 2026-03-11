const sequelizeConf = require("../../config/sequelizeconf");
const { Sequelize } = require("sequelize");

const { DataTypes } = Sequelize;

const perdagangan7_jurnal = sequelizeConf.define(
  "perdagangan7_jurnal",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
    uid: {
      type: DataTypes.STRING,
    },
    tgl: {
      type: DataTypes.STRING,
    },
    keterangan: {
      type: DataTypes.STRING,
    },
    no: {
      type: DataTypes.STRING,
    },
    persediaan: {
      type: DataTypes.BIGINT,
    },
    ppnmasukan: {
      type: DataTypes.BIGINT,
    },
    hutangdagang: {
     type: DataTypes.BIGINT,
    },
    kas: {
     type: DataTypes.BIGINT,
    },
    type: {
      type: DataTypes.STRING,
    },
    
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan7_jurnal;
