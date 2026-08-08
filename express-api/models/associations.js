/**
 * Association Layer — SPT Tahunan Badan (Form 1771)
 *
 * Source of truth: PRE-ASSOCIATION_VALIDATION_SPT_TAHUNAN_BADAN_V3.
 * This file ONLY defines Sequelize associations (ORM-level metadata).
 * It does NOT create tables, columns, FKs, indexes, or run any
 * schema-mutating operation. Migration remains the sole mechanism for
 * physical schema change.
 *
 * All models here are self-registering on the shared Sequelize
 * instance (config/sequelizeconf.js) as soon as they are require()'d.
 * Requiring them here is sufficient to guarantee both sides of every
 * relationship are defined before association calls run — no central
 * model registry / models/index.js is needed for this project.
 *
 * This module has no exports; it is loaded once for its side effects
 * (association registration) via require("./models/associations") at
 * application startup, before the app begins serving requests.
 */

const spt_header = require("./spt_header.model");
const spt_main_form = require("./spt_main_form.model");
const spt_l1 = require("./spt_l1.model");
const spt_l2 = require("./spt_l2.model");
const spt_l3 = require("./spt_l3.model");
const spt_l4 = require("./spt_l4.model");
const spt_l5_place = require("./spt_l5_place.model");
const spt_l5_transaction = require("./spt_l5_transaction.model");
const spt_l6 = require("./spt_l6.model");
const spt_l7 = require("./spt_l7.model");
const spt_l8 = require("./spt_l8.model");
const users = require("./users.model");

// -----------------------------------------------------------------------
// spt_header <-> spt_main_form (1:1)
// -----------------------------------------------------------------------
spt_header.hasOne(spt_main_form, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "mainForm",
});
spt_main_form.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l1 (1:N)
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l1, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l1Entries",
});
spt_l1.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l2 (1:N)
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l2, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l2Entries",
});
spt_l2.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l3 (1:N)
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l3, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l3Entries",
});
spt_l3.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l4 (1:N)
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l4, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l4Entries",
});
spt_l4.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l5_place (1:N)
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l5_place, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l5Places",
});
spt_l5_place.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_l5_place <-> spt_l5_transaction (1:N)
// NOTE: spt_l5_transaction has NO header_id — its only FK is place_id.
// spt_header <-> spt_l5_transaction association is explicitly PROHIBITED.
// -----------------------------------------------------------------------
spt_l5_place.hasMany(spt_l5_transaction, {
  foreignKey: "place_id",
  sourceKey: "id",
  as: "transactions",
});
spt_l5_transaction.belongsTo(spt_l5_place, {
  foreignKey: "place_id",
  targetKey: "id",
  as: "place",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l6 (1:1)
// -----------------------------------------------------------------------
spt_header.hasOne(spt_l6, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l6",
});
spt_l6.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l7 (1:N)
// NOTE: spt_l7 UNIQUE is (header_id, tax_year), NOT header_id alone.
// Cardinality is hasMany/belongsTo — NOT hasOne.
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l7, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l7Entries",
});
spt_l7.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l8 (1:1)
// -----------------------------------------------------------------------
spt_header.hasOne(spt_l8, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l8",
});
spt_l8.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> users (N:1) via created_by
// NOTE: spt_header <-> companies is explicitly PROHIBITED — company_id
// is a business relationship only, with no physical FK.
// -----------------------------------------------------------------------
spt_header.belongsTo(users, {
  foreignKey: "created_by",
  targetKey: "id",
  as: "creator",
});
users.hasMany(spt_header, {
  foreignKey: "created_by",
  sourceKey: "id",
  as: "createdSptHeaders",
});
