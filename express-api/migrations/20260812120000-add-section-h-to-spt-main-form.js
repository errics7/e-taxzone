'use strict';

/**
 * spt_main_form — Section H (Main Form questions 21a-21i).
 *
 * FINAL DECISION (Option A): Section H lives inside spt_main_form, not a
 * new table. 21a-21i are raw user input, persisted as BOOLEAN. 21j is a
 * derived/readonly value (Main Form 21j <- L5 e.15/totalDifference) and is
 * intentionally NOT given a column here — it is never raw input and is
 * always recomputed from spt_l5_transaction on the frontend/service side,
 * never stored.
 *
 * Business naming (confirmed): has_related_party_transactions,
 * has_transfer_pricing_documentation, has_affiliated_capital_investment,
 * has_affiliated_debt_or_receivable, has_fiscal_depreciation_amortization,
 * has_entertainment_promotion_bad_debt_expense, has_investment_tax_facility,
 * has_reinvestment, has_overseas_dividend_income.
 *
 * All columns BOOLEAN, nullable (matches existing spt_main_form flag
 * columns such as has_gr23_income, is_audited, etc). No existing column
 * is touched, no table is dropped, no data is modified.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('spt_main_form', 'has_related_party_transactions', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('spt_main_form', 'has_transfer_pricing_documentation', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('spt_main_form', 'has_affiliated_capital_investment', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('spt_main_form', 'has_affiliated_debt_or_receivable', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('spt_main_form', 'has_fiscal_depreciation_amortization', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('spt_main_form', 'has_entertainment_promotion_bad_debt_expense', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('spt_main_form', 'has_investment_tax_facility', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('spt_main_form', 'has_reinvestment', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('spt_main_form', 'has_overseas_dividend_income', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('spt_main_form', 'has_related_party_transactions');
    await queryInterface.removeColumn('spt_main_form', 'has_transfer_pricing_documentation');
    await queryInterface.removeColumn('spt_main_form', 'has_affiliated_capital_investment');
    await queryInterface.removeColumn('spt_main_form', 'has_affiliated_debt_or_receivable');
    await queryInterface.removeColumn('spt_main_form', 'has_fiscal_depreciation_amortization');
    await queryInterface.removeColumn('spt_main_form', 'has_entertainment_promotion_bad_debt_expense');
    await queryInterface.removeColumn('spt_main_form', 'has_investment_tax_facility');
    await queryInterface.removeColumn('spt_main_form', 'has_reinvestment');
    await queryInterface.removeColumn('spt_main_form', 'has_overseas_dividend_income');
  },
};
