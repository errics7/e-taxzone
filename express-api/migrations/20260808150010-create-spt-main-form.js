'use strict';

/**
 * spt_main_form
 * RAW INPUT Main Form (identitas, neraca, laba-rugi, kalkulasi PPh).
 * spt_header 1:1 spt_main_form.
 * All business fields: Nullable YES, Default NULL, no individual Index/Unique.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spt_main_form', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      header_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        references: {
          model: 'spt_header',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      // Business identity & bookkeeping
      business_name: { type: Sequelize.STRING(255), allowNull: true },
      taxpayer_npwp: { type: Sequelize.STRING(32), allowNull: true },
      company_email: { type: Sequelize.STRING(255), allowNull: true },
      company_phone: { type: Sequelize.STRING(50), allowNull: true },
      business_status: { type: Sequelize.STRING(50), allowNull: true },
      business_classification: { type: Sequelize.STRING(100), allowNull: true },
      bookkeeping_standard: { type: Sequelize.STRING(100), allowNull: true },
      reporting_currency: { type: Sequelize.STRING(10), allowNull: true },
      financial_year_start: { type: Sequelize.STRING(20), allowNull: true },
      financial_year_end: { type: Sequelize.STRING(20), allowNull: true },
      is_audited: { type: Sequelize.BOOLEAN, allowNull: true },
      audit_opinion: { type: Sequelize.STRING(100), allowNull: true },
      kap_npwp: { type: Sequelize.STRING(32), allowNull: true },
      kap_name: { type: Sequelize.STRING(255), allowNull: true },

      // Income facility / obligation flags
      has_gr23_income: { type: Sequelize.BOOLEAN, allowNull: true },
      gr23_income_solely: { type: Sequelize.BOOLEAN, allowNull: true },
      has_final_tax_income: { type: Sequelize.BOOLEAN, allowNull: true },
      has_excluded_income: { type: Sequelize.BOOLEAN, allowNull: true },
      investment_facility: { type: Sequelize.BOOLEAN, allowNull: true },
      vocational_deduction_facility: { type: Sequelize.BOOLEAN, allowNull: true },
      carried_forward_losses: { type: Sequelize.BOOLEAN, allowNull: true },
      rd_deduction_facility: { type: Sequelize.BOOLEAN, allowNull: true },
      tax_rate_type: { type: Sequelize.STRING(100), allowNull: true },
      custom_tax_rate: { type: Sequelize.DECIMAL(7, 4), allowNull: true },
      overseas_tax_credit_requested: { type: Sequelize.BOOLEAN, allowNull: true },
      payable_deduction_requested: { type: Sequelize.BOOLEAN, allowNull: true },
      has_art25_installment_obligation: { type: Sequelize.BOOLEAN, allowNull: true },

      // Balance sheet - assets
      cash_and_cash_equivalents: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      trade_receivables: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      inventory: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      prepaid_expenses: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      other_current_assets: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      fixed_assets: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      accumulated_depreciation: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      intangible_assets: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      investment: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      other_non_current_assets: { type: Sequelize.DECIMAL(20, 2), allowNull: true },

      // Balance sheet - liabilities & equity
      trade_payables: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      short_term_debt: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      tax_payable: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      accrued_expenses: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      other_current_liabilities: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      long_term_debt: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      deferred_tax_liability: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      other_non_current_liabilities: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      paid_up_capital: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      retained_earnings: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      current_year_profit: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      other_equity: { type: Sequelize.DECIMAL(20, 2), allowNull: true },

      // Income statement
      gross_revenue: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      sales_returns: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      sales_discount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      beginning_inventory: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      purchases: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      direct_labor: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      factory_overhead: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      ending_inventory: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      selling_expenses: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      administrative_expenses: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      general_expenses: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      interest_income: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      dividend_income: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      other_income: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      interest_expense: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      other_expenses: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      tax_expense: { type: Sequelize.DECIMAL(20, 2), allowNull: true },

      // Fiscal correction / facility fields
      p5_investment_facility: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      p5_investment_facility_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      p6_vocational_deduction: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      p6_vocational_deduction_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      p8_carried_losses: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      p10_rd_deduction: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      p10_rd_deduction_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      p11_tax_rate: { type: Sequelize.DECIMAL(7, 4), allowNull: true },
      p11a_custom_tax_rate: { type: Sequelize.DECIMAL(7, 4), allowNull: true },
      commercial_profit: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      positive_fiscal_corrections: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      negative_fiscal_corrections: { type: Sequelize.DECIMAL(20, 2), allowNull: true },

      // Tax credit / installment / refund
      q13_overseas_credit: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      p14_installment_art25: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      p15_notice_art25: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      q16_payable_deduction: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      withholding_tax_article_23: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      withholding_tax_article_22: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      withholding_tax_article_26: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      installment_article_25: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      overpayment_previous_year: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      foreign_tax_credit: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      p17b_has_postponement: { type: Sequelize.BOOLEAN, allowNull: true },
      p17b_postponement_amount: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      p18a_previous_underpayment: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      p19a_refund_method: { type: Sequelize.STRING(50), allowNull: true },
      p19b_bank_account: { type: Sequelize.STRING(100), allowNull: true },
      p19b_account_no: { type: Sequelize.STRING(100), allowNull: true },
      p19b_bank_name: { type: Sequelize.STRING(255), allowNull: true },
      p19b_account_holder: { type: Sequelize.STRING(255), allowNull: true },

      // Statement / signature
      declaration: { type: Sequelize.TEXT, allowNull: true },
      signature: { type: Sequelize.STRING(255), allowNull: true },
      company_name: { type: Sequelize.STRING(255), allowNull: true },
      pic_name: { type: Sequelize.STRING(255), allowNull: true },
      pic_nik: { type: Sequelize.STRING(50), allowNull: true },
      position: { type: Sequelize.STRING(100), allowNull: true },
      date: { type: Sequelize.DATEONLY, allowNull: true },
      stamp: { type: Sequelize.STRING(255), allowNull: true },

      created_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: 'TIMESTAMP NULL',
        allowNull: true,
        defaultValue: null,
      },
    }, {
      engine: 'InnoDB',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('spt_main_form');
  },
};
