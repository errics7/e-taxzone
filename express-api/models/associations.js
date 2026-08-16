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

// =========================================================================
// L9–L14 ASSOCIATIONS
// Source of truth: Database Dictionary + Contract FINAL L9-L14 LOCKED,
// Association Matrix LOCKED (task doc), 25 migrations, 25 models.
// Added below the L1-L8 block without modifying any existing line above.
// =========================================================================

const spt_l9 = require("./spt_l9.model");
const spt_l9_asset = require("./spt_l9_asset.model");
const spt_l10a = require("./spt_l10a.model");
const spt_l10b = require("./spt_l10b.model");
const spt_l10c = require("./spt_l10c.model");
const spt_l10d = require("./spt_l10d.model");
const spt_l11a_promotion = require("./spt_l11a_promotion.model");
const spt_l11a_entertainment = require("./spt_l11a_entertainment.model");
const spt_l11a_bad_debt = require("./spt_l11a_bad_debt.model");
const spt_l11a_facility = require("./spt_l11a_facility.model");
const spt_l11a_regional_benefit = require("./spt_l11a_regional_benefit.model");
const spt_l11a_regional_facility = require("./spt_l11a_regional_facility.model");
const spt_l11a_npl = require("./spt_l11a_npl.model");
const spt_l11b = require("./spt_l11b.model");
const spt_l11b_debt_balance = require("./spt_l11b_debt_balance.model");
const spt_l11b_equity_balance = require("./spt_l11b_equity_balance.model");
const spt_l11b_borrowing_cost = require("./spt_l11b_borrowing_cost.model");
const spt_l11c = require("./spt_l11c.model");
const spt_l13a = require("./spt_l13a.model");
const spt_l13b = require("./spt_l13b.model");
const spt_l13b_agreement = require("./spt_l13b_agreement.model");
const spt_l13b_section_b = require("./spt_l13b_section_b.model");
const spt_l13b_rd = require("./spt_l13b_rd.model");
const spt_l13c = require("./spt_l13c.model");
const spt_l14 = require("./spt_l14.model");

// -----------------------------------------------------------------------
// spt_header <-> spt_l9 (1:1)
// -----------------------------------------------------------------------
spt_header.hasOne(spt_l9, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l9",
});
spt_l9.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_l9 <-> spt_l9_asset (1:N)
// -----------------------------------------------------------------------
spt_l9.hasMany(spt_l9_asset, {
  foreignKey: "l9_id",
  sourceKey: "id",
  as: "assets",
});
spt_l9_asset.belongsTo(spt_l9, {
  foreignKey: "l9_id",
  targetKey: "id",
  as: "l9",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l10a (1:N)
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l10a, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l10aEntries",
});
spt_l10a.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l10b (1:1)
// -----------------------------------------------------------------------
spt_header.hasOne(spt_l10b, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l10b",
});
spt_l10b.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l10c (1:N)
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l10c, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l10cEntries",
});
spt_l10c.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l10d (1:1)
// -----------------------------------------------------------------------
spt_header.hasOne(spt_l10d, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l10d",
});
spt_l10d.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l11a_promotion (1:N)
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l11a_promotion, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "promotions",
});
spt_l11a_promotion.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l11a_entertainment (1:N)
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l11a_entertainment, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "entertainments",
});
spt_l11a_entertainment.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l11a_bad_debt (1:N)
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l11a_bad_debt, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "badDebts",
});
spt_l11a_bad_debt.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l11a_facility (1:N)
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l11a_facility, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "facilities",
});
spt_l11a_facility.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l11a_regional_benefit (1:1)
// -----------------------------------------------------------------------
spt_header.hasOne(spt_l11a_regional_benefit, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "regionalBenefit",
});
spt_l11a_regional_benefit.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_l11a_regional_benefit <-> spt_l11a_regional_facility (1:N)
// -----------------------------------------------------------------------
spt_l11a_regional_benefit.hasMany(spt_l11a_regional_facility, {
  foreignKey: "regional_benefit_id",
  sourceKey: "id",
  as: "facilities",
});
spt_l11a_regional_facility.belongsTo(spt_l11a_regional_benefit, {
  foreignKey: "regional_benefit_id",
  targetKey: "id",
  as: "regionalBenefit",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l11a_npl (1:N)
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l11a_npl, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "npls",
});
spt_l11a_npl.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l11b (1:1)
// -----------------------------------------------------------------------
spt_header.hasOne(spt_l11b, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l11b",
});
spt_l11b.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_l11b <-> spt_l11b_debt_balance (1:N)
// -----------------------------------------------------------------------
spt_l11b.hasMany(spt_l11b_debt_balance, {
  foreignKey: "l11b_id",
  sourceKey: "id",
  as: "debtBalances",
});
spt_l11b_debt_balance.belongsTo(spt_l11b, {
  foreignKey: "l11b_id",
  targetKey: "id",
  as: "l11b",
});

// -----------------------------------------------------------------------
// spt_l11b <-> spt_l11b_equity_balance (1:N)
// -----------------------------------------------------------------------
spt_l11b.hasMany(spt_l11b_equity_balance, {
  foreignKey: "l11b_id",
  sourceKey: "id",
  as: "equityBalances",
});
spt_l11b_equity_balance.belongsTo(spt_l11b, {
  foreignKey: "l11b_id",
  targetKey: "id",
  as: "l11b",
});

// -----------------------------------------------------------------------
// spt_l11b <-> spt_l11b_borrowing_cost (1:N)
// -----------------------------------------------------------------------
spt_l11b.hasMany(spt_l11b_borrowing_cost, {
  foreignKey: "l11b_id",
  sourceKey: "id",
  as: "borrowingCosts",
});
spt_l11b_borrowing_cost.belongsTo(spt_l11b, {
  foreignKey: "l11b_id",
  targetKey: "id",
  as: "l11b",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l11c (1:N)
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l11c, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l11cEntries",
});
spt_l11c.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l13a (1:N)
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l13a, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l13aEntries",
});
spt_l13a.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l13b (1:1)
// -----------------------------------------------------------------------
spt_header.hasOne(spt_l13b, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l13b",
});
spt_l13b.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_l13b <-> spt_l13b_agreement (1:N)
// -----------------------------------------------------------------------
spt_l13b.hasMany(spt_l13b_agreement, {
  foreignKey: "l13b_id",
  sourceKey: "id",
  as: "agreements",
});
spt_l13b_agreement.belongsTo(spt_l13b, {
  foreignKey: "l13b_id",
  targetKey: "id",
  as: "l13b",
});

// -----------------------------------------------------------------------
// spt_l13b <-> spt_l13b_section_b (1:N)
// NOTE: physical uniqueness is UNIQUE(l13b_id, category_code), NOT UNIQUE(l13b_id).
// Cardinality is hasMany/belongsTo — LOCKED as NOT hasOne.
// -----------------------------------------------------------------------
spt_l13b.hasMany(spt_l13b_section_b, {
  foreignKey: "l13b_id",
  sourceKey: "id",
  as: "sectionBEntries",
});
spt_l13b_section_b.belongsTo(spt_l13b, {
  foreignKey: "l13b_id",
  targetKey: "id",
  as: "l13b",
});

// -----------------------------------------------------------------------
// spt_l13b <-> spt_l13b_rd (1:N)
// -----------------------------------------------------------------------
spt_l13b.hasMany(spt_l13b_rd, {
  foreignKey: "l13b_id",
  sourceKey: "id",
  as: "rdEntries",
});
spt_l13b_rd.belongsTo(spt_l13b, {
  foreignKey: "l13b_id",
  targetKey: "id",
  as: "l13b",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l13c (1:N)
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l13c, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l13cEntries",
});
spt_l13c.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});

// -----------------------------------------------------------------------
// spt_header <-> spt_l14 (1:N)
// NOTE: spt_l14 UNIQUE is (header_id, tax_year), NOT header_id alone.
// Cardinality is hasMany/belongsTo — LOCKED as NOT hasOne (same principle as spt_l7).
// -----------------------------------------------------------------------
spt_header.hasMany(spt_l14, {
  foreignKey: "header_id",
  sourceKey: "id",
  as: "l14Entries",
});
spt_l14.belongsTo(spt_header, {
  foreignKey: "header_id",
  targetKey: "id",
  as: "header",
});