const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const SptTahunan = sequelize.define('spt_tahunan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    
    // Basic Info
    tax_year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tax_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Personal Income Tax'
    },
    tax_return_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Personal Income Tax Return'
    },
    tax_period_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Yearly Tax Return'
    },
    tax_period: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tax_return_model: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Normal'
    },
    
    // Header Section
    bookkeeping_type: {
      type: DataTypes.ENUM('Simple Bookkeeping', 'Full Bookkeeping'),
      defaultValue: 'Simple Bookkeeping'
    },
    source_of_income: {
      type: DataTypes.TEXT
    },
    
    // Form Data - JSON fields for flexibility
    taxpayer_identity: {
      type: DataTypes.JSON // A. Identity of Taxpayers
    },
    income_summary: {
      type: DataTypes.JSON // B. Summary of Income
    },
    income_tax_calculation: {
      type: DataTypes.JSON // C. Income Tax Payable Calculation
    },
    income_tax_credit: {
      type: DataTypes.JSON // D. Income Tax Credit
    },
    underpayment_overpayment: {
      type: DataTypes.JSON // E. Underpayment/Overpayment
    },
    amendment_tax_return: {
      type: DataTypes.JSON // F. Amendment Tax Return
    },
    refund_data: {
      type: DataTypes.JSON // G. Refund
    },
    income_tax_installment: {
      type: DataTypes.JSON // H. Income Tax Installment
    },
    other_transactions: {
      type: DataTypes.JSON // I. Statement of Other Transactions
    },
    additional_attachments: {
      type: DataTypes.JSON // J. Additional Attachments
    },
    statement_data: {
      type: DataTypes.JSON // K. Statement
    },
    
    // Status and Processing
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'processing', 'approved', 'rejected', 'pending_payment', 'payment'),
      defaultValue: 'draft'
    },
    submission_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    processed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    processed_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    
    // Payment Information
    payment_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0,
      comment: 'Jumlah pembayaran pajak yang harus dibayar'
    },
    payment_status: {
      type: DataTypes.ENUM('not_required', 'pending', 'paid', 'failed'),
      defaultValue: 'not_required',
      comment: 'Status pembayaran: not_required (tidak perlu bayar), pending (menunggu), paid (sudah bayar), failed (gagal)'
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Tanggal pembayaran dilakukan'
    },
    payment_reference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Nomor referensi pembayaran dari payment gateway'
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Metode pembayaran yang digunakan (simulation/bank_transfer/credit_card/dll)'
    },
    
    // Reference Number
    reference_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      comment: 'Nomor referensi SPT setelah disubmit'
    },
    
    // File attachments
    attachments: {
      type: DataTypes.JSON // Store file paths/info
    },
    
    detail: {
      type: DataTypes.JSON
    },
    
    // Metadata
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'spt_tahunan',
    timestamps: false,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['tax_year']
      },
      {
        fields: ['payment_status']
      },
      {
        fields: ['reference_number']
      }
    ]
  });

  return SptTahunan;
};