const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

// init DataTypes
const { DataTypes } = Sequelize;

// Define schema for spt_main_form data
const spt_main_form = sequelizeConf.define(
  "spt_main_form",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    header_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      references: {
        model: 'spt_header',
        key: 'id',
      },
    },

    // Business identity & bookkeeping
    business_name: { type: DataTypes.STRING(255), allowNull: true },
    taxpayer_npwp: { type: DataTypes.STRING(32), allowNull: true },
    company_email: { type: DataTypes.STRING(255), allowNull: true },
    company_phone: { type: DataTypes.STRING(50), allowNull: true },
    business_status: { type: DataTypes.STRING(50), allowNull: true },
    business_classification: { type: DataTypes.STRING(100), allowNull: true },
    bookkeeping_standard: { type: DataTypes.STRING(100), allowNull: true },
    reporting_currency: { type: DataTypes.STRING(10), allowNull: true },
    financial_year_start: { type: DataTypes.STRING(20), allowNull: true },
    financial_year_end: { type: DataTypes.STRING(20), allowNull: true },
    is_audited: { type: DataTypes.BOOLEAN, allowNull: true },
    audit_opinion: { type: DataTypes.STRING(100), allowNull: true },
    kap_npwp: { type: DataTypes.STRING(32), allowNull: true },
    kap_name: { type: DataTypes.STRING(255), allowNull: true },

    // Income facility / obligation flags
    has_gr23_income: { type: DataTypes.BOOLEAN, allowNull: true },
    gr23_income_solely: { type: DataTypes.BOOLEAN, allowNull: true },
    has_final_tax_income: { type: DataTypes.BOOLEAN, allowNull: true },
    has_excluded_income: { type: DataTypes.BOOLEAN, allowNull: true },
    investment_facility: { type: DataTypes.BOOLEAN, allowNull: true },
    vocational_deduction_facility: { type: DataTypes.BOOLEAN, allowNull: true },
    carried_forward_losses: { type: DataTypes.BOOLEAN, allowNull: true },
    rd_deduction_facility: { type: DataTypes.BOOLEAN, allowNull: true },
    tax_rate_type: { type: DataTypes.STRING(100), allowNull: true },
    custom_tax_rate: { type: DataTypes.DECIMAL(7, 4), allowNull: true },
    overseas_tax_credit_requested: { type: DataTypes.BOOLEAN, allowNull: true },
    payable_deduction_requested: { type: DataTypes.BOOLEAN, allowNull: true },
    has_art25_installment_obligation: { type: DataTypes.BOOLEAN, allowNull: true },

    // Balance sheet - assets
    cash_and_cash_equivalents: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    trade_receivables: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    inventory: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    prepaid_expenses: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    other_current_assets: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    fixed_assets: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    accumulated_depreciation: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    intangible_assets: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    investment: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    other_non_current_assets: { type: DataTypes.DECIMAL(20, 2), allowNull: true },

    // Balance sheet - liabilities & equity
    trade_payables: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    short_term_debt: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    tax_payable: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    accrued_expenses: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    other_current_liabilities: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    long_term_debt: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    deferred_tax_liability: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    other_non_current_liabilities: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    paid_up_capital: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    retained_earnings: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    current_year_profit: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    other_equity: { type: DataTypes.DECIMAL(20, 2), allowNull: true },

    // Income statement
    gross_revenue: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    sales_returns: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    sales_discount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    beginning_inventory: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    purchases: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    direct_labor: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    factory_overhead: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    ending_inventory: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    selling_expenses: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    administrative_expenses: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    general_expenses: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    interest_income: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    dividend_income: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    other_income: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    interest_expense: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    other_expenses: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    tax_expense: { type: DataTypes.DECIMAL(20, 2), allowNull: true },

    // Fiscal correction / facility fields
    p5_investment_facility: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    p5_investment_facility_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    p6_vocational_deduction: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    p6_vocational_deduction_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    p8_carried_losses: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    p10_rd_deduction: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    p10_rd_deduction_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    p11_tax_rate: { type: DataTypes.DECIMAL(7, 4), allowNull: true },
    p11a_custom_tax_rate: { type: DataTypes.DECIMAL(7, 4), allowNull: true },
    commercial_profit: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    positive_fiscal_corrections: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    negative_fiscal_corrections: { type: DataTypes.DECIMAL(20, 2), allowNull: true },

    // Tax credit / installment / refund
    q13_overseas_credit: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    p14_installment_art25: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    p15_notice_art25: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    q16_payable_deduction: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    withholding_tax_article_23: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    withholding_tax_article_22: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    withholding_tax_article_26: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    installment_article_25: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    overpayment_previous_year: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    foreign_tax_credit: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    p17b_has_postponement: { type: DataTypes.BOOLEAN, allowNull: true },
    p17b_postponement_amount: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    p18a_previous_underpayment: { type: DataTypes.DECIMAL(20, 2), allowNull: true },
    p19a_refund_method: { type: DataTypes.STRING(50), allowNull: true },
    p19b_bank_account: { type: DataTypes.STRING(100), allowNull: true },
    p19b_account_no: { type: DataTypes.STRING(100), allowNull: true },
    p19b_bank_name: { type: DataTypes.STRING(255), allowNull: true },
    p19b_account_holder: { type: DataTypes.STRING(255), allowNull: true },

    // Section H — Main Form questions 21a-21i (raw user input, BOOLEAN).
    // 21j (q21j_excess_final_tax) intentionally has NO column — it is a
    // derived/readonly value (Main Form 21j <- L5 e.15/totalDifference),
    // never raw input, never persisted.
    has_related_party_transactions: { type: DataTypes.BOOLEAN, allowNull: true },
    has_transfer_pricing_documentation: { type: DataTypes.BOOLEAN, allowNull: true },
    has_affiliated_capital_investment: { type: DataTypes.BOOLEAN, allowNull: true },
    has_affiliated_debt_or_receivable: { type: DataTypes.BOOLEAN, allowNull: true },
    has_fiscal_depreciation_amortization: { type: DataTypes.BOOLEAN, allowNull: true },
    has_entertainment_promotion_bad_debt_expense: { type: DataTypes.BOOLEAN, allowNull: true },
    has_investment_tax_facility: { type: DataTypes.BOOLEAN, allowNull: true },
    has_reinvestment: { type: DataTypes.BOOLEAN, allowNull: true },
    has_overseas_dividend_income: { type: DataTypes.BOOLEAN, allowNull: true },

    // Statement / signature
    declaration: { type: DataTypes.TEXT, allowNull: true },
    signature: { type: DataTypes.STRING(255), allowNull: true },
    company_name: { type: DataTypes.STRING(255), allowNull: true },
    pic_name: { type: DataTypes.STRING(255), allowNull: true },
    pic_nik: { type: DataTypes.STRING(50), allowNull: true },
    position: { type: DataTypes.STRING(100), allowNull: true },
    date: { type: DataTypes.DATEONLY, allowNull: true },
    stamp: { type: DataTypes.STRING(255), allowNull: true },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    tableName: 'spt_main_form',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Export model
module.exports = spt_main_form;
