const sequelizeConf = require('../../../config/sequelizeconf');
const moment = require('moment');
const { Op } = require('sequelize');
const Joi = require('joi');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Get company profile for pre-filling SPT
exports.getCompanyProfile = async (req, res) => {
  try {
    const user_id = req.auth._id;

    console.log('user id ', user_id);

    // Get company data for the PIC user
    const [companyData] = await sequelizeConf.query(
      `SELECT 
        c.id as company_id, c.company_name, c.company_type, c.email, c.phone,
        c.establishment_date, c.notary_nik, c.notary_name, c.basic_capital,
        c.economic_data, c.address_data, c.related_persons, c.related_taxpayers,
        u.nama as pic_name, u.email as pic_email
      FROM companies c
      LEFT JOIN users u ON c.pic_user_id = u.id
      WHERE c.pic_user_id = :userId
      LIMIT 1`,
      {
        replacements: { userId: user_id },
        type: sequelizeConf.QueryTypes.SELECT
      }
    );

    console.log('company data ', companyData);

    if (!companyData) {
      return res.status(404).json({
        success: false,
        message: "Data perusahaan tidak ditemukan. Silakan lengkapi registrasi perusahaan terlebih dahulu."
      });
    }

    res.status(200).json({
      success: true,
      data: companyData
    });

  } catch (error) {
    console.error('Get company profile error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};

// Create SPT Tahunan Badan
exports.createSptTahunanBadan = async (req, res) => {
  let transaction;

  try {
    transaction = await sequelizeConf.transaction();

    const user_id = req.auth._id;
    const {
      tax_year,
      tax_period,
      tax_return_model,
      bookkeeping_type,
      reporting_currency,
      tax_return_type,
      tax_period_type
    } = req.body;

    // ─── DEBUG: log semua yang diterima dari frontend ─────────────────────────
    console.log('\n======================================');
    console.log('=== CREATE BADAN: REQ.BODY (RAW) ===');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('=== CREATE BADAN: DESTRUCTURED VALUES ===');
    console.log({ user_id, tax_year, tax_period, tax_return_model, bookkeeping_type, reporting_currency, tax_return_type, tax_period_type });
    console.log('=== CREATE BADAN: TYPES ===');
    console.log({
      tax_year_type: typeof tax_year,
      tax_year_value: tax_year,
      tax_return_model_type: typeof tax_return_model,
      tax_return_model_value: tax_return_model,
    });
    console.log('======================================\n');
    // ─────────────────────────────────────────────────────────────────────────

    // Validation - only tax_year required for draft creation
    // digital_signature is NOT required here; it is only validated at submit time
    if (!tax_year) {
      return res.status(400).json({
        success: false,
        message: "Tax year wajib diisi"
      });
    }

    // Check if company already has SPT for this tax year
    // Cek menggunakan source_of_income = 'Business Activities' ATAU tax_type = 'Corporate Income Tax'
    // karena tax_type di-set via UPDATE setelah INSERT (tidak ada di INSERT langsung)
    const [existingSpt] = await sequelizeConf.query(
      `SELECT id FROM spt_tahunan 
       WHERE user_id = :userId AND tax_year = :taxYear 
         AND (tax_type = 'Corporate Income Tax' OR source_of_income = 'Business Activities')
       LIMIT 1`,
      {
        replacements: { userId: user_id, taxYear: tax_year },
        type: sequelizeConf.QueryTypes.SELECT,
        transaction
      }
    );

    if (existingSpt) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `SPT Tahunan Badan untuk tahun ${tax_year} sudah ada. Anda dapat mengedit SPT yang sudah ada.`
      });
    }

    // Get company data for auto-filling
    const [companyData] = await sequelizeConf.query(
      `SELECT 
        c.id as company_id, c.company_name, c.company_type, c.email, c.phone,
        c.establishment_date, c.notary_nik, c.notary_name, c.basic_capital,
        c.economic_data, c.address_data, c.related_persons, c.related_taxpayers,
        u.nama as pic_name, u.email as pic_email
      FROM companies c
      LEFT JOIN users u ON c.pic_user_id = u.id
      WHERE c.pic_user_id = :userId
      LIMIT 1`,
      {
        replacements: { userId: user_id },
        type: sequelizeConf.QueryTypes.SELECT,
        transaction
      }
    );

    // ─── DEBUG: log company data yang ditemukan ───────────────────────────────
    console.log('=== CREATE BADAN: COMPANY DATA FROM DB ===');
    console.log(JSON.stringify(companyData, null, 2));
    console.log('==========================================\n');
    // ─────────────────────────────────────────────────────────────────────────

    if (!companyData) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Data perusahaan tidak ditemukan. Silakan lengkapi registrasi perusahaan terlebih dahulu."
      });
    }

    // ─── DEBUG: log INSERT replacements tepat sebelum query ──────────────────
    const insertReplacements = {
      userId: user_id,
      taxYear: tax_year,
      taxPeriod: tax_period || `${tax_year} January - December`,
      taxReturnModel: tax_return_model === 'AMENDMENT' ? 'Amendment'
                    : tax_return_model === 'NORMAL'    ? 'NORMAL'
                    : 'NORMAL',
      bookkeepingType: bookkeeping_type || 'Full Bookkeeping',
      sourceOfIncome: 'Business Activities',
      taxReturnType: tax_return_type || 'Rupiah',
      taxPeriodType: tax_period_type || 'Yearly'
    };
    console.log('=== CREATE BADAN: INSERT REPLACEMENTS ===');
    console.log(JSON.stringify(insertReplacements, null, 2));
    console.log('=========================================\n');
    // ─────────────────────────────────────────────────────────────────────────

    // Create SPT record
    // Kolom yang di-INSERT dibuat minimal (mengikuti pola pribadi) untuk menghindari
    // ENUM validation error pada tax_return_type dan tax_period_type.
    // tax_type di-set via UPDATE setelah INSERT agar lebih aman.
    const [createResult] = await sequelizeConf.query(
      `INSERT INTO spt_tahunan (
        user_id, tax_year, tax_type, tax_period, tax_return_model,
        bookkeeping_type, source_of_income, tax_return_type, tax_period_type,
        status, created_date, updated_date
      ) VALUES (
        :userId, :taxYear, 'Corporate Income Tax', :taxPeriod, :taxReturnModel,
        :bookkeepingType, :sourceOfIncome, :taxReturnType, :taxPeriodType,
        'draft', NOW(), NOW()
      )`,
      {
        replacements: insertReplacements,
        type: sequelizeConf.QueryTypes.INSERT,
        transaction
      }
    );

    const sptId = createResult;

    // ─── DEBUG: log hasil INSERT ──────────────────────────────────────────────
    console.log('=== CREATE BADAN: INSERT RESULT (sptId) ===');
    console.log({ sptId, createResult });
    console.log('===========================================\n');
    // ─────────────────────────────────────────────────────────────────────────

    // Auto-fill company identity section
    const companyIdentityData = {
      company_name: companyData.company_name || '',
      company_type: companyData.company_type || '',
      establishment_date: companyData.establishment_date || '',
      pic_name: companyData.pic_name || '',
      pic_nik: companyData.notary_nik || '',
      email: companyData.email || '',
      phone: companyData.phone || '',
      basic_capital: companyData.basic_capital || '',
      reporting_currency: reporting_currency || 'IDR'
    };

    // Auto-fill general information
    const generalInfoData = {
      tax_year: tax_year,
      reporting_period: `01 January ${tax_year} - 31 December ${tax_year}`,
      tax_return_type: 'Normal',
      bookkeeping_method: bookkeeping_type || 'Full Bookkeeping',
      reporting_currency: reporting_currency || 'IDR',
      submission_type: 'Electronic'
    };

    // Auto-fill statement section
    const statementData = {
      declaration: false,
      signature: '',
      company_name: companyData.company_name || '',
      pic_name: companyData.pic_name || '',
      pic_nik: companyData.notary_nik || '',
      position: 'Person in Charge'
    };

    // Initialize balance sheet and profit loss with basic structure
    const balanceSheetData = {
      assets: {
        current_assets: {
          cash_and_cash_equivalents: 0,
          trade_receivables: 0,
          inventory: 0,
          prepaid_expenses: 0,
          other_current_assets: 0
        },
        non_current_assets: {
          fixed_assets: 0,
          accumulated_depreciation: 0,
          intangible_assets: 0,
          investment: 0,
          other_non_current_assets: 0
        }
      },
      liabilities: {
        current_liabilities: {
          trade_payables: 0,
          short_term_debt: 0,
          accrued_expenses: 0,
          tax_payable: 0,
          other_current_liabilities: 0
        },
        non_current_liabilities: {
          long_term_debt: 0,
          deferred_tax_liability: 0,
          other_non_current_liabilities: 0
        }
      },
      equity: {
        paid_up_capital: companyData.basic_capital || 0,
        retained_earnings: 0,
        other_equity: 0
      }
    };

    const profitLossData = {
      revenue: {
        gross_revenue: 0,
        sales_returns: 0,
        net_revenue: 0
      },
      cost_of_goods_sold: {
        beginning_inventory: 0,
        purchases: 0,
        direct_labor: 0,
        factory_overhead: 0,
        ending_inventory: 0,
        total_cogs: 0
      },
      operating_expenses: {
        selling_expenses: 0,
        administrative_expenses: 0,
        total_operating_expenses: 0
      },
      other_income_expenses: {
        interest_income: 0,
        other_income: 0,
        interest_expense: 0,
        other_expenses: 0
      },
      tax_calculation: {
        gross_profit: 0,
        operating_profit: 0,
        profit_before_tax: 0,
        tax_expense: 0,
        net_profit: 0
      }
    };

    // ─── DEBUG: log semua JSON yang akan di-UPDATE ────────────────────────────
    console.log('=== CREATE BADAN: PRE-UPDATE CHECK ===');
    console.log('sptId untuk UPDATE:', sptId);
    try {
      // Coba stringify masing-masing untuk isolasi mana yang gagal
      console.log('companyIdentityData OK:', JSON.stringify(companyIdentityData).length, 'chars');
      console.log('generalInfoData OK:', JSON.stringify(generalInfoData).length, 'chars');
      console.log('balanceSheetData OK:', JSON.stringify(balanceSheetData).length, 'chars');
      console.log('profitLossData OK:', JSON.stringify(profitLossData).length, 'chars');
      console.log('statementData OK:', JSON.stringify(statementData).length, 'chars');
    } catch (jsonErr) {
      console.log('JSON stringify error:', jsonErr.message);
    }
    console.log('=====================================\n');
    // ─────────────────────────────────────────────────────────────────────────

    // Save auto-filled sections + set tax_type untuk SPT Badan
    await sequelizeConf.query(
      `UPDATE spt_tahunan 
       SET taxpayer_identity = :companyIdentity,
           income_summary = :generalInfo,
           income_tax_calculation = :balanceSheet,
           income_tax_credit = :profitLoss,
           statement_data = :statementData,
           updated_date = NOW()
       WHERE id = :sptId`,
      {
        replacements: {
          companyIdentity: JSON.stringify(companyIdentityData),
          generalInfo: JSON.stringify(generalInfoData),
          balanceSheet: JSON.stringify(balanceSheetData),
          profitLoss: JSON.stringify(profitLossData),
          statementData: JSON.stringify(statementData),
          sptId: sptId
        },
        type: sequelizeConf.QueryTypes.UPDATE,
        transaction
      }
    );

    console.log('=== CREATE BADAN: UPDATE SUCCESS — committing ===\n');

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "SPT Tahunan Badan berhasil dibuat dengan data perusahaan yang sudah terisi otomatis",
      data: {
        id: sptId,
        tax_year: tax_year,
        tax_period: tax_period || `${tax_year} January - December`,
        tax_return_model: tax_return_model || 'NORMAL',
        bookkeeping_type: bookkeeping_type || 'Full Bookkeeping',
        tax_type: 'Corporate Income Tax',
        status: 'draft',
        company_data: {
          company_name: companyData.company_name,
          pic_name: companyData.pic_name,
          email: companyData.email,
          phone: companyData.phone
        },
        auto_filled_sections: ['taxpayer_identity', 'income_summary', 'income_tax_calculation', 'income_tax_credit', 'statement_data']
      }
    });

  } catch (error) {
    if (transaction) await transaction.rollback();

    // ─── DEBUG: full error dump ───────────────────────────────────────────────
    console.log('\n======================================');
    console.log('=== CREATE BADAN: FULL ERROR ===');
    console.log(error);
    console.log('=== ERROR NAME ===');
    console.log(error.name);
    console.log('=== ERROR MESSAGE ===');
    console.log(error.message);
    console.log('=== ERROR CODE ===');
    console.log(error.code || error.original?.code);
    console.log('=== ERROR ERRORS (Sequelize validation details) ===');
    console.log(JSON.stringify(error.errors, null, 2));
    console.log('=== ERROR SQL ===');
    console.log(error.sql || error.original?.sql);
    console.log('=== ERROR PARAMETERS ===');
    console.log(error.parameters || error.original?.parameters);
    console.log('=== STACK TRACE ===');
    console.log(error.stack);
    console.log('======================================\n');
    // ─────────────────────────────────────────────────────────────────────────

    // Handle duplicate error
    if (error.code === 'ER_DUP_ENTRY' || error.original?.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: `SPT Tahunan Badan untuk tahun ${req.body.tax_year} sudah ada`
      });
    }

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};

// Update SPT Badan section
exports.updateSptBadanSection = async (req, res) => {
  let transaction;

  try {
    transaction = await sequelizeConf.transaction();

    const { spt_id } = req.params;
    const { section, data } = req.body;
    const user_id = req.auth._id;

    // Validate section for corporate tax return
    const validSections = [
      'taxpayer_identity', // Company identity
      'income_summary', // General information
      'income_tax_calculation', // Balance sheet (using this field)
      'income_tax_credit', // Profit & Loss (using this field)
      'underpayment_overpayment', // Tax calculation
      'amendment_tax_return', // Tax credit & payments
      'refund_data', // Reconciliation
      'income_tax_installment', // Attachments
      'other_transactions', // Other information
      'additional_attachments', // Supporting documents
      'statement_data' // Statement & signature
    ];

    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: "Section tidak valid untuk SPT Badan"
      });
    }

    // Check if SPT exists and belongs to user
    const [sptData] = await sequelizeConf.query(
      `SELECT id, status, tax_type FROM spt_tahunan 
       WHERE id = :sptId AND user_id = :userId AND tax_type = 'Corporate Income Tax'
       LIMIT 1`,
      {
        replacements: { sptId: spt_id, userId: user_id },
        type: sequelizeConf.QueryTypes.SELECT,
        transaction
      }
    );

    if (!sptData) {
      return res.status(404).json({
        success: false,
        message: "SPT Tahunan Badan tidak ditemukan"
      });
    }

    if (sptData.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: "SPT yang sudah disubmit tidak dapat diubah"
      });
    }

    // Additional validation for specific sections
    if (section === 'income_tax_calculation' && data) {
      // Validate balance sheet data structure
      const requiredBalanceSheetSections = ['assets', 'liabilities', 'equity'];
      for (const requiredSection of requiredBalanceSheetSections) {
        if (!data[requiredSection]) {
          return res.status(400).json({
            success: false,
            message: `Section ${requiredSection} diperlukan dalam neraca`
          });
        }
      }
    }

    if (section === 'income_tax_credit' && data) {
      // Validate profit & loss data structure
      const requiredProfitLossSections = ['revenue', 'cost_of_goods_sold', 'operating_expenses'];
      for (const requiredSection of requiredProfitLossSections) {
        if (!data[requiredSection]) {
          return res.status(400).json({
            success: false,
            message: `Section ${requiredSection} diperlukan dalam laporan laba rugi`
          });
        }
      }
    }

    // Update section data
    await sequelizeConf.query(
      `UPDATE spt_tahunan 
       SET ${section} = :data, updated_date = NOW()
       WHERE id = :sptId`,
      {
        replacements: {
          data: JSON.stringify(data),
          sptId: spt_id
        },
        type: sequelizeConf.QueryTypes.UPDATE,
        transaction
      }
    );

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: `Section ${section} berhasil diupdate`
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Update SPT Badan section error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};

// Submit SPT Badan
exports.submitSptBadan = async (req, res) => {
  let transaction;

  try {
    transaction = await sequelizeConf.transaction();

    const { spt_id } = req.params;
    const user_id = req.auth._id;

    // Check if SPT exists and belongs to user
    const [sptData] = await sequelizeConf.query(
      `SELECT 
        id, user_id, status, tax_year, tax_type
      FROM spt_tahunan 
      WHERE id = :sptId AND user_id = :userId AND tax_type = 'Corporate Income Tax'`,
      {
        replacements: { sptId: spt_id, userId: user_id },
        type: sequelizeConf.QueryTypes.SELECT,
        transaction
      }
    );

    if (!sptData) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "SPT Tahunan Badan tidak ditemukan atau Anda tidak memiliki akses"
      });
    }

    if (sptData.status !== 'draft') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `SPT sudah dalam status ${sptData.status} dan tidak dapat disubmit ulang`
      });
    }

    // Validate required sections before submission
    const [sectionCheck] = await sequelizeConf.query(
      `SELECT 
        taxpayer_identity, income_summary, income_tax_calculation, 
        income_tax_credit, statement_data
      FROM spt_tahunan 
      WHERE id = :sptId`,
      {
        replacements: { sptId: spt_id },
        type: sequelizeConf.QueryTypes.SELECT,
        transaction
      }
    );

    // Validation for corporate tax return
    let validationErrors = [];

    if (!sectionCheck.taxpayer_identity) {
      validationErrors.push("Data identitas perusahaan belum lengkap");
    }

    if (!sectionCheck.income_summary) {
      validationErrors.push("Informasi umum belum lengkap");
    }

    if (!sectionCheck.income_tax_calculation) {
      validationErrors.push("Data neraca belum lengkap");
    }

    if (!sectionCheck.income_tax_credit) {
      validationErrors.push("Data laporan laba rugi belum lengkap");
    }

    if (!sectionCheck.statement_data) {
      validationErrors.push("Pernyataan belum diisi");
    } else {
      try {
        const statementData = JSON.parse(sectionCheck.statement_data);
        if (!statementData.declaration) {
          validationErrors.push("Pernyataan harus dicentang sebelum submit");
        }
      } catch (e) {
        validationErrors.push("Data pernyataan tidak valid");
      }
    }

    if (validationErrors.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Validasi gagal: " + validationErrors.join(", ")
      });
    }

    // For simulation, auto-approve
    const isSimulation = true;
    const finalStatus = isSimulation ? 'approved' : 'submitted';
    const processedDate = isSimulation ? new Date() : null;

    // Update SPT status
    await sequelizeConf.query(
      `UPDATE spt_tahunan 
       SET status = :status, 
           submission_date = NOW(), 
           processed_date = :processedDate, 
           updated_date = NOW()
       WHERE id = :sptId AND user_id = :userId`,
      {
        replacements: {
          status: finalStatus,
          processedDate: processedDate,
          sptId: spt_id,
          userId: user_id
        },
        type: sequelizeConf.QueryTypes.UPDATE,
        transaction
      }
    );

    // Generate submission reference number
    const referenceNumber = `SPT-BADAN-${sptData.tax_year}-${String(spt_id).padStart(6, '0')}-${Date.now()}`;

    await transaction.commit();

    let message = isSimulation
      ? "✅ Simulasi: SPT Tahunan Badan berhasil disubmit dan langsung disetujui untuk keperluan demo"
      : "SPT Tahunan Badan berhasil disubmit dan sedang diproses";

    res.status(200).json({
      success: true,
      message: message,
      simulation_mode: isSimulation,
      data: {
        id: spt_id,
        status: finalStatus,
        reference_number: referenceNumber,
        submission_date: new Date(),
        processed_date: processedDate,
        tax_type: 'Corporate Income Tax'
      }
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Submit SPT Badan error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};

// Get SPT Badan detail
exports.getSptBadanDetail = async (req, res) => {
  try {
    const { spt_id } = req.params;
    const user_id = req.auth._id;

    const [sptData] = await sequelizeConf.query(
      `SELECT 
        spt.*,
        u.nama as user_name,
        u.email as user_email,
        c.company_name,
        c.company_type,
        c.email as company_email,
        c.phone as company_phone
      FROM spt_tahunan spt
      LEFT JOIN users u ON spt.user_id = u.id
      LEFT JOIN companies c ON spt.user_id = c.pic_user_id
      WHERE spt.id = :sptId AND spt.user_id = :userId AND spt.tax_type = 'Corporate Income Tax'
      LIMIT 1`,
      {
        replacements: { sptId: spt_id, userId: user_id },
        type: sequelizeConf.QueryTypes.SELECT
      }
    );

    if (!sptData) {
      return res.status(404).json({
        success: false,
        message: "SPT Tahunan Badan tidak ditemukan"
      });
    }

    // Parse JSON fields for easier frontend consumption
    const parsedData = {
      ...sptData,
      taxpayer_identity: sptData.taxpayer_identity ? JSON.parse(sptData.taxpayer_identity) : null,
      income_summary: sptData.income_summary ? JSON.parse(sptData.income_summary) : null,
      income_tax_calculation: sptData.income_tax_calculation ? JSON.parse(sptData.income_tax_calculation) : null,
      income_tax_credit: sptData.income_tax_credit ? JSON.parse(sptData.income_tax_credit) : null,
      underpayment_overpayment: sptData.underpayment_overpayment ? JSON.parse(sptData.underpayment_overpayment) : null,
      amendment_tax_return: sptData.amendment_tax_return ? JSON.parse(sptData.amendment_tax_return) : null,
      refund_data: sptData.refund_data ? JSON.parse(sptData.refund_data) : null,
      income_tax_installment: sptData.income_tax_installment ? JSON.parse(sptData.income_tax_installment) : null,
      other_transactions: sptData.other_transactions ? JSON.parse(sptData.other_transactions) : null,
      additional_attachments: sptData.additional_attachments ? JSON.parse(sptData.additional_attachments) : null,
      statement_data: sptData.statement_data ? JSON.parse(sptData.statement_data) : null,
      company_data: {
        company_name: sptData.company_name,
        company_type: sptData.company_type,
        email: sptData.company_email,
        phone: sptData.company_phone
      }
    };

    res.status(200).json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error('Get SPT Badan detail error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};

// Get user's SPT Badan list
exports.getUserSptBadanList = async (req, res) => {
  try {
    const user_id = req.auth._id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const sptList = await sequelizeConf.query(
      `SELECT 
        spt.id, spt.tax_year, spt.tax_period, spt.status, spt.tax_type,
        spt.submission_date, spt.processed_date, spt.created_date,
        c.company_name
      FROM spt_tahunan spt
      LEFT JOIN companies c ON spt.user_id = c.pic_user_id
      WHERE spt.user_id = :userId AND spt.tax_type = 'Corporate Income Tax'
      ORDER BY spt.created_date DESC
      LIMIT :limit OFFSET :offset`,
      {
        replacements: {
          userId: user_id,
          limit: parseInt(limit),
          offset: parseInt(offset)
        },
        type: sequelizeConf.QueryTypes.SELECT
      }
    );

    const [countResult] = await sequelizeConf.query(
      `SELECT COUNT(*) as total FROM spt_tahunan 
       WHERE user_id = :userId AND tax_type = 'Corporate Income Tax'`,
      {
        replacements: { userId: user_id },
        type: sequelizeConf.QueryTypes.SELECT
      }
    );

    res.status(200).json({
      success: true,
      data: {
        spt_list: sptList,
        pagination: {
          total: countResult.total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(countResult.total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get SPT Badan list error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};

// Download SPT Badan PDF
exports.downloadSptBadanPdf = async (req, res) => {
  try {
    const { spt_id } = req.params;
    const user_id = req.auth._id;

    const [sptData] = await sequelizeConf.query(
      `SELECT 
        spt.*, c.company_name, u.nama as pic_name
      FROM spt_tahunan spt
      LEFT JOIN companies c ON spt.user_id = c.pic_user_id
      LEFT JOIN users u ON spt.user_id = u.id
      WHERE spt.id = :sptId AND spt.user_id = :userId AND spt.tax_type = 'Corporate Income Tax'
      LIMIT 1`,
      {
        replacements: { sptId: spt_id, userId: user_id },
        type: sequelizeConf.QueryTypes.SELECT
      }
    );

    if (!sptData) {
      return res.status(404).json({
        success: false,
        message: "SPT Tahunan Badan tidak ditemukan"
      });
    }

    // Generate PDF
    const doc = new PDFDocument({ margin: 50 });
    const filename = `SPT_Tahunan_Badan_${sptData.tax_year}_${sptData.company_name.replace(/\s/g, '_')}.pdf`;

    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // PDF Content
    doc.fontSize(16).text('SURAT PEMBERITAHUAN TAHUNAN', { align: 'center' });
    doc.fontSize(14).text('PAJAK PENGHASILAN WAJIB PAJAK BADAN', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Tahun Pajak: ${sptData.tax_year}`);
    doc.text(`Nama Perusahaan: ${sptData.company_name}`);
    doc.text(`PIC: ${sptData.pic_name}`);
    doc.text(`Status: ${sptData.status.toUpperCase()}`);
    doc.text(`Tanggal Submit: ${sptData.submission_date ? moment(sptData.submission_date).format('DD MMMM YYYY') : '-'}`);
    doc.moveDown();

    // Add simulation note
    doc.text('* Catatan: Dokumen ini dibuat dalam mode simulasi untuk keperluan demo.', {
      fontSize: 10,
      color: 'gray'
    });

    doc.end();

  } catch (error) {
    console.error('Download SPT Badan PDF error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengunduh SPT Badan: " + error.message
    });
  }
};

// Delete SPT Badan (draft only)
// Dipanggil oleh frontend: DELETE /api/v2/spt-tahunan-badan/:spt_id
exports.deleteSptBadan = async (req, res) => {
  let transaction;

  try {
    transaction = await sequelizeConf.transaction();

    const { spt_id } = req.params;
    const user_id = req.auth._id;

    // Fetch SPT dan validasi ownership + tax_type
    const [sptData] = await sequelizeConf.query(
      `SELECT id, user_id, status, tax_year, tax_period, tax_type
       FROM spt_tahunan
       WHERE id = :sptId AND user_id = :userId
         AND tax_type = 'Corporate Income Tax'
       LIMIT 1`,
      {
        replacements: { sptId: spt_id, userId: user_id },
        type: sequelizeConf.QueryTypes.SELECT,
        transaction
      }
    );

    if (!sptData) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'SPT Badan tidak ditemukan atau Anda tidak memiliki akses.'
      });
    }

    // Hanya draft yang boleh dihapus
    if (sptData.status !== 'draft') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `SPT dengan status '${sptData.status}' tidak dapat dihapus. Hanya SPT dengan status 'draft' yang dapat dihapus.`
      });
    }

    // Hapus record SPT Badan
    await sequelizeConf.query(
      `DELETE FROM spt_tahunan WHERE id = :sptId AND user_id = :userId`,
      {
        replacements: { sptId: spt_id, userId: user_id },
        type: sequelizeConf.QueryTypes.DELETE,
        transaction
      }
    );

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: `SPT Tahunan Badan ${sptData.tax_year} berhasil dihapus`,
      data: {
        deleted_spt: {
          id: sptData.id,
          tax_year: sptData.tax_year,
          tax_period: sptData.tax_period,
          status: sptData.status
        },
        deleted_at: new Date().toISOString()
      }
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Delete SPT Badan error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus SPT Badan: ' + error.message
    });
  }
};