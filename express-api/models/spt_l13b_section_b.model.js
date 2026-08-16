const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_l13b_section_b data
const spt_l13b_section_b = sequelizeConf.define(
  "spt_l13b_section_b",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    l13b_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'spt_l13b',
        key: 'id',
      },
    },
    category_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    category_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_l13b_section_b',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ['l13b_id', 'category_code'],
        name: 'uq_spt_l13b_section_b_l13b_category',
      },
    ],
  }
);

// Export model
module.exports = spt_l13b_section_b;
