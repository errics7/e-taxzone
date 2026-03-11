const sequelizeConf = require("../../config/sequelizeconf");
const { DataTypes } = require("sequelize");

const perdagangan11_posting = sequelizeConf.define(
  "perdagangan11_posting",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_config: {
      type: DataTypes.INTEGER,
    },
    id_akun: {
      type: DataTypes.STRING,
    },
    tgl: {
      type: DataTypes.STRING,
    },
    keterangan: {
      type: DataTypes.STRING,
    },
    ref: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    debet: {
      type: DataTypes.BIGINT,
    },
    kredit: {
      type: DataTypes.BIGINT,
    },
    posisi: {
      type: DataTypes.STRING,
    },
    saldototal: {
      type: DataTypes.BIGINT,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = perdagangan11_posting;
