const sequelizeConf = require('../../../config/sequelizeconf');
const moment = require('moment');
const { Op } = require('sequelize');
const Joi = require('joi');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Add new function to get taxpayer profile for pre-filling
exports.getTaxpayerProfile = async (req, res) => {
  try {
    const user_id = req.auth._id;

    console.log('user id ', user_id)
    const [taxpayerData] = await sequelizeConf.query(
      `SELECT 
        nik, full_name, email, handphone, taxpayer_type, marital_status,
        place_of_birth, date_of_birth, gender, type_of_work
      FROM taxpayer 
      WHERE user_id = :userId
      LIMIT 1`,
      {
        replacements: { userId: user_id },
        type: sequelizeConf.QueryTypes.SELECT
      }
    );

    console.log('tax payer data ', taxpayerData)

    if (!taxpayerData) {
      return res.status(404).json({
        success: false,
        message: "Data taxpayer tidak ditemukan. Silakan lengkapi registrasi taxpayer terlebih dahulu."
      });
    }

    res.status(200).json({
      success: true,
      data: taxpayerData
    });

  } catch (error) {
    console.error('Get taxpayer profile error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};

// Fix untuk createSptTahunan - Include auto-fill from taxpayer data
// Backend: submitSpt function with POST method
// Backend: createSptTahunan function
exports.createSptTahunan = async (req, res) => {
  let transaction;

  try {
    transaction = await sequelizeConf.transaction();

    const user_id = req.auth._id;
    const {
      tax_year,
      tax_period,
      tax_return_model,
      bookkeeping_type,
      source_of_income
    } = req.body;

    // Validation
    if (!tax_year || !source_of_income) {
      return res.status(400).json({
        success: false,
        message: "Tax year dan source of income wajib diisi"
      });
    }

    // Check if user already has SPT for this tax year
    const [existingSpt] = await sequelizeConf.query(
      `SELECT id FROM spt_tahunan 
       WHERE user_id = :userId AND tax_year = :taxYear
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
        message: `SPT Tahunan untuk tahun ${tax_year} sudah ada. Anda dapat mengedit SPT yang sudah ada.`
      });
    }

    // Get taxpayer data for auto-filling
    const [taxpayerData] = await sequelizeConf.query(
      `SELECT 
        id, nik, full_name, email, handphone, marital_status,
        place_of_birth, date_of_birth, gender, type_of_work
      FROM taxpayer 
      WHERE user_id = :userId
      LIMIT 1`,
      {
        replacements: { userId: user_id },
        type: sequelizeConf.QueryTypes.SELECT,
        transaction
      }
    );

    if (!taxpayerData) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Data taxpayer tidak ditemukan. Silakan lengkapi registrasi taxpayer terlebih dahulu."
      });
    }

    // Create SPT record
    const [createResult] = await sequelizeConf.query(
      `INSERT INTO spt_tahunan (
        user_id, tax_year, tax_period, tax_return_model, 
        bookkeeping_type, source_of_income, status, created_date, updated_date
      ) VALUES (
        :userId, :taxYear, :taxPeriod, :taxReturnModel,
        :bookkeepingType, :sourceOfIncome, 'draft', NOW(), NOW()
      )`,
      {
        replacements: {
          userId: user_id,
          taxYear: tax_year,
          taxPeriod: tax_period || `${tax_year} January - December`,
          taxReturnModel: tax_return_model || 'NORMAL',
          bookkeepingType: bookkeeping_type || 'Simple Bookkeeping',
          sourceOfIncome: source_of_income
        },
        type: sequelizeConf.QueryTypes.INSERT,
        transaction
      }
    );

    const sptId = createResult;

    // Auto-fill taxpayer identity section with pre-filled data
    const identityData = {
      nik: taxpayerData.nik || '',
      name: taxpayerData.full_name || '',
      identity_type: 'KTP',
      id_number: taxpayerData.nik || '',
      mobile_phone: taxpayerData.handphone || '',
      email: taxpayerData.email || '',
      tax_obligation_status: taxpayerData.marital_status === 'Married' ? 'Married' :
        taxpayerData.marital_status === 'Single' ? 'Single' : '',
      spouse_nik: ''
    };

    // Auto-fill statement section
    const statementData = {
      declaration: false,
      signature: '',
      tin_nik: taxpayerData.nik || '',
      full_name: taxpayerData.full_name || '',
      representative: ''
    };

    // Save auto-filled sections
    await sequelizeConf.query(
      `UPDATE spt_tahunan 
       SET taxpayer_identity = :identityData,
           statement_data = :statementData,
           updated_date = NOW()
       WHERE id = :sptId`,
      {
        replacements: {
          identityData: JSON.stringify(identityData),
          statementData: JSON.stringify(statementData),
          sptId: sptId
        },
        type: sequelizeConf.QueryTypes.UPDATE,
        transaction
      }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "SPT Tahunan berhasil dibuat dengan data taxpayer yang sudah terisi otomatis",
      data: {
        id: sptId,
        tax_year: tax_year,
        tax_period: tax_period || `${tax_year} January - December`,
        tax_return_model: tax_return_model || 'NORMAL',
        bookkeeping_type: bookkeeping_type || 'Simple Bookkeeping',
        source_of_income: source_of_income,
        status: 'draft',
        taxpayer_data: {
          nik: taxpayerData.nik,
          full_name: taxpayerData.full_name,
          email: taxpayerData.email,
          handphone: taxpayerData.handphone
        },
        auto_filled_sections: ['taxpayer_identity', 'statement_data']
      }
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create SPT Tahunan error:', error);

    // Handle duplicate error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: `SPT Tahunan untuk tahun ${req.body.tax_year} sudah ada`
      });
    }

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};



// Fix untuk getSptDetail - Return proper JSON parsed data
exports.getSptDetail = async (req, res) => {
  try {
    const { spt_id } = req.params;
    const user_id = req.auth._id;

    const [sptData] = await sequelizeConf.query(
      `SELECT 
        spt.*,
        u.nama as user_name,
        u.email as user_email,
        t.nik as taxpayer_nik,
        t.full_name as taxpayer_full_name,
        t.handphone as taxpayer_phone,
        t.email as taxpayer_email
      FROM spt_tahunan spt
      LEFT JOIN users u ON spt.user_id = u.id
      LEFT JOIN taxpayer t ON spt.user_id = t.user_id
      WHERE spt.id = :sptId AND spt.user_id = :userId
      LIMIT 1`,
      {
        replacements: { sptId: spt_id, userId: user_id },
        type: sequelizeConf.QueryTypes.SELECT
      }
    );

    if (!sptData) {
      return res.status(404).json({
        success: false,
        message: "SPT Tahunan tidak ditemukan"
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
      taxpayer_data: {
        nik: sptData.taxpayer_nik,
        full_name: sptData.taxpayer_full_name,
        handphone: sptData.taxpayer_phone,
        email: sptData.taxpayer_email
      }
    };

    res.status(200).json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error('Get SPT detail error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};

// Update SPT section
exports.updateSptSection = async (req, res) => {
  let transaction;

  try {
    transaction = await sequelizeConf.transaction();

    const { spt_id } = req.params;
    const { section, data } = req.body;
    const user_id = req.auth._id;

    // Validate section
    const validSections = [
      'taxpayer_identity', 'income_summary', 'income_tax_calculation',
      'income_tax_credit', 'underpayment_overpayment', 'amendment_tax_return',
      'refund_data', 'income_tax_installment', 'other_transactions',
      'additional_attachments', 'statement_data', 'detail'
    ];

    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: "Section tidak valid"
      });
    }

    // Check if SPT exists and belongs to user
    const [sptData] = await sequelizeConf.query(
      `SELECT id, status FROM spt_tahunan WHERE id = :sptId AND user_id = :userId LIMIT 1`,
      {
        replacements: { sptId: spt_id, userId: user_id },
        type: sequelizeConf.QueryTypes.SELECT,
        transaction
      }
    );

    if (!sptData) {
      return res.status(404).json({
        success: false,
        message: "SPT Tahunan tidak ditemukan"
      });
    }

    if (sptData.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: "SPT yang sudah disubmit tidak dapat diubah"
      });
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
    console.error('Update SPT section error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};

// Submit SPT
exports.submitSpt = async (req, res) => {
  let transaction;

  try {
    transaction = await sequelizeConf.transaction();

    const { spt_id } = req.params;
    const user_id = req.auth._id;
    const {
      payment_amount,
      payment_method,
      use_deposit_balance,
      use_tax_deposit
    } = req.body;

    // Validasi SPT exists
    const [sptData] = await sequelizeConf.query(
      `SELECT * FROM spt_tahunan WHERE id = :sptId AND user_id = :userId`,
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
        message: "SPT tidak ditemukan"
      });
    }

    // Validasi status - allow draft dan pending_payment
    if (sptData.status !== 'draft' && sptData.status !== 'pending_payment') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `SPT dengan status ${sptData.status} tidak dapat diproses`
      });
    }

    // ===== LOGIC FLOW YANG BENAR =====
    let finalStatus;
    let paymentStatus;
    let billingCode = sptData.payment_reference; // Keep existing if any
    let processedDate = null;

    // Jika dari pending_payment (user sudah bayar/konfirmasi)
    if (sptData.status === 'pending_payment') {
      // Pembayaran selesai, langsung approved
      finalStatus = 'approved';
      paymentStatus = 'paid';
      processedDate = new Date();
      
    } else {
      // Dari draft (submit pertama kali)
      if (payment_amount > 0) {
        // Ada kurang bayar - MASUK pending_payment dulu
        finalStatus = 'pending_payment';
        
        if (payment_method === 'billing_code') {
          // Generate billing code, status tetap pending
          paymentStatus = 'pending';
          billingCode = `BC-${sptData.tax_year}-${String(spt_id).padStart(6, '0')}-${Date.now()}`;
          
        } else if (payment_method === 'deposit_transfer') {
          // Bayar dengan deposit - payment paid tapi tetap pending_payment
          // SPT akan otomatis approved setelah payment terverifikasi
          paymentStatus = 'paid';
          
          // Karena sudah bayar dengan deposit, langsung approved
          finalStatus = 'approved';
          processedDate = new Date();
        }
        
      } else {
        // Tidak ada kurang bayar - langsung approved
        finalStatus = 'approved';
        paymentStatus = 'not_required';
        processedDate = new Date();
      }
    }

    // Update SPT status
    await sequelizeConf.query(
      `UPDATE spt_tahunan 
       SET status = :status, 
           submission_date = COALESCE(submission_date, NOW()), 
           processed_date = :processedDate,
           payment_amount = :paymentAmount,
           payment_status = :paymentStatus,
           payment_method = :paymentMethod,
           payment_reference = :billingCode,
           payment_date = CASE WHEN :paymentStatus = 'paid' THEN NOW() ELSE payment_date END,
           updated_date = NOW()
       WHERE id = :sptId AND user_id = :userId`,
      {
        replacements: {
          status: finalStatus,
          processedDate: processedDate,
          paymentAmount: payment_amount || 0,
          paymentStatus: paymentStatus,
          paymentMethod: payment_method || 'none',
          billingCode: billingCode,
          sptId: spt_id,
          userId: user_id
        },
        type: sequelizeConf.QueryTypes.UPDATE,
        transaction
      }
    );

    // Generate reference number
    const referenceNumber = `SPT-${sptData.tax_year}-${String(spt_id).padStart(6, '0')}-${Date.now()}`;

    await transaction.commit();

    // Response message berdasarkan flow
    let message = '';
    
    if (sptData.status === 'pending_payment' && finalStatus === 'approved') {
      // Konfirmasi pembayaran berhasil → approved
      message = '✅ Pembayaran berhasil dikonfirmasi! SPT Anda telah disetujui dan dilaporkan.';
      
    } else if (finalStatus === 'pending_payment') {
      // Baru submit dengan kurang bayar → pending_payment
      if (payment_method === 'billing_code') {
        message = '📄 SPT berhasil disubmit. Kode billing telah di-generate. SPT berstatus "Menunggu Pembayaran". Silakan lakukan pembayaran untuk menyelesaikan pelaporan.';
      }
      
    } else if (finalStatus === 'approved') {
      // Langsung approved
      if (payment_amount > 0 && payment_method === 'deposit_transfer') {
        message = '✅ SPT berhasil dilaporkan! Pembayaran menggunakan deposit balance berhasil. SPT Anda telah disetujui.';
      } else {
        message = '✅ SPT berhasil dilaporkan dan disetujui!';
      }
    }

    res.status(200).json({
      success: true,
      message: message,
      data: {
        id: spt_id,
        status: finalStatus,
        reference_number: referenceNumber,
        submission_date: new Date(),
        processed_date: processedDate,
        payment_amount: payment_amount || 0,
        payment_status: paymentStatus,
        payment_method: payment_method || 'none',
        billing_code: billingCode
      }
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Submit SPT error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};
// Get user's SPT list
exports.getUserSptList = async (req, res) => {
  try {
    const user_id = req.auth._id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const sptList = await sequelizeConf.query(
      `SELECT 
        id, tax_year, tax_period, tax_type, status, 
        submission_date, processed_date, created_date
      FROM spt_tahunan 
      WHERE user_id = :userId 
      ORDER BY created_date DESC
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
      `SELECT COUNT(*) as total FROM spt_tahunan WHERE user_id = :userId`,
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
    console.error('Get SPT list error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};

// Get SPT detail
exports.getSptDetail = async (req, res) => {
  try {
    const { spt_id } = req.params;
    const user_id = req.auth._id;

    const [sptData] = await sequelizeConf.query(
      `SELECT 
        spt.*,
        u.nama as user_name,
        u.email as user_email
      FROM spt_tahunan spt
      LEFT JOIN users u ON spt.user_id = u.id
      WHERE spt.id = :sptId AND spt.user_id = :userId
      LIMIT 1`,
      {
        replacements: { sptId: spt_id, userId: user_id },
        type: sequelizeConf.QueryTypes.SELECT
      }
    );

    if (!sptData) {
      return res.status(404).json({
        success: false,
        message: "SPT Tahunan tidak ditemukan"
      });
    }

    res.status(200).json({
      success: true,
      data: sptData
    });

  } catch (error) {
    console.error('Get SPT detail error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};

// Download SPT PDF
exports.downloadSptPdf = async (req, res) => {
  try {
    const { spt_id } = req.params;
    const user_id = req.auth._id;

    // const [sptData] = await sequelizeConf.query(
    //   `SELECT 
    //     id, user_id, status, tax_year
    //   FROM spt_tahunan 
    //   WHERE id = :sptId AND user_id = :userId`,
    //   {
    //     replacements: { sptId: spt_id, userId: user_id },
    //     type: sequelizeConf.QueryTypes.SELECT,
    //     transaction
    //   }
    // );

    const [sptData] = await sequelizeConf.query(
      `SELECT 
       id, user_id, status, tax_year
       FROM spt_tahunan 
      LEFT JOIN users u ON spt.user_id = u.id
      WHERE spt.id = :sptId AND spt.user_id = :userId
      LIMIT 1`,
      {
        replacements: { sptId: spt_id, userId: user_id },
        type: sequelizeConf.QueryTypes.SELECT
      }
    );

    if (!sptData) {
      return res.status(404).json({
        success: false,
        message: "SPT Tahunan tidak ditemukan"
      });
    }

    // Generate PDF
    const doc = new PDFDocument({ margin: 50 });
    const filename = `SPT_Tahunan_${sptData.tax_year}_${sptData.user_name.replace(/\s/g, '_')}.pdf`;

    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // PDF Content
    doc.fontSize(16).text('SURAT PEMBERITAHUAN TAHUNAN', { align: 'center' });
    doc.fontSize(14).text('PAJAK PENGHASILAN WAJIB PAJAK ORANG PRIBADI', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Tahun Pajak: ${sptData.tax_year}`);
    doc.text(`Nama: ${sptData.user_name}`);
    doc.text(`Status: ${sptData.status.toUpperCase()}`);
    doc.text(`Tanggal Submit: ${sptData.submission_date ? moment(sptData.submission_date).format('DD MMMM YYYY') : '-'}`);
    doc.moveDown();

    // Add simulation note if applicable
    const isSimulation = true;
    if (isSimulation) {
      doc.text('* Catatan: Dokumen ini dibuat dalam mode simulasi untuk keperluan demo.', {
        fontSize: 10,
        color: 'gray'
      });
    }

    doc.end();

  } catch (error) {
    console.error('Download SPT PDF error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengunduh SPT: " + error.message
    });
  }
};

// Admin functions
exports.getAllSptRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, year } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let replacements = {
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    if (status) {
      whereConditions.push('spt.status = :status');
      replacements.status = status;
    }

    if (year) {
      whereConditions.push('spt.tax_year = :year');
      replacements.year = year;
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    const sptList = await sequelizeConf.query(
      `SELECT 
        spt.*,
        u.nama as user_name,
        u.email as user_email
      FROM spt_tahunan spt
      LEFT JOIN users u ON spt.user_id = u.id
      ${whereClause}
      ORDER BY spt.created_date DESC
      LIMIT :limit OFFSET :offset`,
      {
        replacements,
        type: sequelizeConf.QueryTypes.SELECT
      }
    );

    const [countResult] = await sequelizeConf.query(
      `SELECT COUNT(*) as total 
      FROM spt_tahunan spt
      LEFT JOIN users u ON spt.user_id = u.id
      ${whereClause}`,
      {
        replacements,
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
    console.error('Get all SPT requests error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};

/**
 * Get SPT list for dosen to grade - FIXED VERSION
 * GET /api/v2/dosen/spt-tahunan/for-grading
 */
exports.getSptListForGrading = async (req, res) => {
  try {
    console.log('=== getSptListForGrading START ===');
    console.log('User auth:', req.auth);
    console.log('Query params:', req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { status, search, year } = req.query;

    // Build filter conditions
    let whereConditions = [];
    let replacements = {
      limit: limit,
      offset: offset
    };

    if (status && status !== 'all') {
      whereConditions.push('spt.status = :status');
      replacements.status = status;
    } else {
      // Include all relevant statuses including 'approved'
      whereConditions.push("spt.status IN ('submitted', 'approved', 'graded', 'needs_revision')");
    }

    if (year) {
      whereConditions.push('spt.tax_year = :year');
      replacements.year = year;
    }

    if (search) {
      whereConditions.push('(u.nama LIKE :search OR u.student_id LIKE :search OR u.email LIKE :search)');
      replacements.search = `%${search}%`;
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    console.log('WHERE clause:', whereClause);
    console.log('Replacements:', replacements);

    // Query SPT dengan spt_grade join untuk mendapatkan info penilaian
    const sptQuery = `
      SELECT 
        spt.*,
        u.nama as user_name,
        u.email as user_email,
        u.id as student_id,
        sg.id as grade_id,
        sg.final_score,
        sg.letter_grade,
        sg.feedback,
        sg.completeness_score,
        sg.accuracy_score,
        sg.presentation_score,
        sg.understanding_score,
        sg.graded_date
      FROM spt_tahunan spt
      LEFT JOIN users u ON spt.user_id = u.id
      LEFT JOIN spt_grade sg ON spt.id = sg.spt_id AND sg.status = 'final'
      ${whereClause}
      ORDER BY spt.created_date DESC
      LIMIT :limit OFFSET :offset
    `;

    console.log('Executing query:', sptQuery);

    const sptList = await sequelizeConf.query(sptQuery, {
      replacements,
      type: sequelizeConf.QueryTypes.SELECT
    });

    console.log('Query result count:', sptList.length);
    console.log('First result:', sptList[0]);

    // Count query
    const countQuery = `
      SELECT COUNT(DISTINCT spt.id) as total 
      FROM spt_tahunan spt
      LEFT JOIN users u ON spt.user_id = u.id
      ${whereClause}
    `;

    const [countResult] = await sequelizeConf.query(countQuery, {
      replacements,
      type: sequelizeConf.QueryTypes.SELECT
    });

    console.log('Count result:', countResult);

    // Transform data dengan grade info
    const transformedData = sptList.map(spt => ({
      id: spt.id,
      user_id: spt.user_id,
      tax_year: spt.tax_year,
      tax_type: spt.tax_type,
      tax_period: spt.tax_period,
      status: spt.status,
      submission_date: spt.submission_date,
      created_date: spt.created_date,
      updated_date: spt.updated_date,
      user: {
        name: spt.user_name,
        email: spt.user_email,
        student_id: spt.student_id
      },
      grade: spt.grade_id ? {
        id: spt.grade_id,
        score: parseFloat(spt.final_score),
        letter_grade: spt.letter_grade,
        feedback: spt.feedback,
        criteria: {
          completeness: parseFloat(spt.completeness_score || 0),
          accuracy: parseFloat(spt.accuracy_score || 0),
          presentation: parseFloat(spt.presentation_score || 0),
          understanding: parseFloat(spt.understanding_score || 0)
        },
        graded_date: spt.graded_date
      } : null
    }));

    console.log('Transformed data count:', transformedData.length);

    const response = {
      success: true,
      message: "SPT list retrieved successfully",
      data: {
        data: transformedData,
        pagination: {
          current_page: page,
          per_page: limit,
          total: countResult.total,
          total_pages: Math.ceil(countResult.total / limit)
        }
      }
    };

    console.log('=== RESPONSE SUCCESS ===');
    console.log('Data count:', response.data.data.length);
    console.log('Total:', response.data.pagination.total);

    res.status(200).json(response);

  } catch (error) {
    console.error('=== ERROR getSptListForGrading ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);

    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
      error: error.message
    });
  }
};

/**
 * Get SPT detail for dosen grading - NEW ENDPOINT
 * GET /api/v2/dosen/spt-tahunan/:spt_id/for-grading
 */
exports.getSptDetailForGrading = async (req, res) => {
  try {
    const { spt_id } = req.params;
    const dosen_id = req.auth._id;

    console.log('=== getSptDetailForGrading ===');
    console.log('SPT ID:', spt_id);
    console.log('Dosen ID:', dosen_id);

    const [sptData] = await sequelizeConf.query(
      `SELECT 
        spt.*,
        u.nama as user_name,
        u.email as user_email,
        u.id as student_id,
        t.nik as taxpayer_nik,
        t.full_name as taxpayer_full_name,
        t.handphone as taxpayer_phone,
        t.email as taxpayer_email,
        sg.id as grade_id,
        sg.final_score,
        sg.letter_grade,
        sg.feedback,
        sg.completeness_score,
        sg.accuracy_score,
        sg.presentation_score,
        sg.understanding_score,
        sg.completeness_comment,
        sg.accuracy_comment,
        sg.presentation_comment,
        sg.understanding_comment,
        sg.graded_date
      FROM spt_tahunan spt
      LEFT JOIN users u ON spt.user_id = u.id
      LEFT JOIN taxpayer t ON spt.user_id = t.user_id
      LEFT JOIN spt_grade sg ON spt.id = sg.spt_id AND sg.status = 'final'
      WHERE spt.id = :sptId AND spt.status IN ('submitted', 'approved', 'graded', 'needs_revision')
      LIMIT 1`,
      {
        replacements: { sptId: spt_id },
        type: sequelizeConf.QueryTypes.SELECT
      }
    );

    if (!sptData) {
      return res.status(404).json({
        success: false,
        message: "SPT tidak ditemukan atau tidak tersedia untuk penilaian"
      });
    }

    // Parse JSON fields safely
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
      user: {
        name: sptData.user_name,
        email: sptData.user_email,
        student_id: sptData.student_id
      },
      taxpayer_data: {
        nik: sptData.taxpayer_nik,
        full_name: sptData.taxpayer_full_name,
        handphone: sptData.taxpayer_phone,
        email: sptData.taxpayer_email
      },
      grade: sptData.grade_id ? {
        id: sptData.grade_id,
        score: parseFloat(sptData.final_score),
        letter_grade: sptData.letter_grade,
        feedback: sptData.feedback,
        criteria: {
          completeness: parseFloat(sptData.completeness_score || 0),
          accuracy: parseFloat(sptData.accuracy_score || 0),
          presentation: parseFloat(sptData.presentation_score || 0),
          understanding: parseFloat(sptData.understanding_score || 0)
        },
        comments: {
          completeness_comment: sptData.completeness_comment,
          accuracy_comment: sptData.accuracy_comment,
          presentation_comment: sptData.presentation_comment,
          understanding_comment: sptData.understanding_comment
        },
        graded_date: sptData.graded_date
      } : null
    };

    console.log('SPT data found for grading:', {
      id: sptData.id,
      user_name: sptData.user_name,
      status: sptData.status,
      has_grade: !!sptData.grade_id
    });

    res.status(200).json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error('Get SPT detail for grading error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};

exports.getSptDetailForUser = async (req, res) => {
  try {
    const { spt_id } = req.params;
    const user_id = req.auth._id;

    console.log('=== getSptDetailForUser ===');
    console.log('SPT ID:', spt_id);
    console.log('User ID:', user_id);

    const [sptData] = await sequelizeConf.query(
      `SELECT 
        spt.*,
        u.nama as user_name,
        u.email as user_email,
        u.id as student_id,
        t.nik as taxpayer_nik,
        t.full_name as taxpayer_full_name,
        t.handphone as taxpayer_phone,
        t.email as taxpayer_email,
        sg.id as grade_id,
        sg.final_score,
        sg.letter_grade,
        sg.feedback,
        sg.completeness_score,
        sg.accuracy_score,
        sg.presentation_score,
        sg.understanding_score,
        sg.completeness_comment,
        sg.accuracy_comment,
        sg.presentation_comment,
        sg.understanding_comment,
        sg.graded_date,
        sg.status as grade_status
      FROM spt_tahunan spt
      LEFT JOIN users u ON spt.user_id = u.id
      LEFT JOIN taxpayer t ON spt.user_id = t.user_id
      LEFT JOIN spt_grade sg ON spt.id = sg.spt_id AND sg.status = 'final'
      WHERE spt.id = :sptId AND spt.user_id = :userId
      LIMIT 1`,
      {
        replacements: {
          sptId: spt_id,
          userId: user_id
        },
        type: sequelizeConf.QueryTypes.SELECT
      }
    );

    if (!sptData) {
      return res.status(404).json({
        success: false,
        message: "SPT tidak ditemukan atau Anda tidak memiliki akses ke SPT ini"
      });
    }

    // Parse JSON fields safely
    const parsedData = {
      id: sptData.id,
      user_id: sptData.user_id,
      tax_year: sptData.tax_year,
      status: sptData.status,
      created_at: sptData.created_at,
      updated_at: sptData.updated_at,
      submitted_at: sptData.submitted_at,
      approved_at: sptData.approved_at,
      graded_at: sptData.graded_at,
      revision_notes: sptData.revision_notes,

      // Parse JSON fields
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

      // User information
      user: {
        id: sptData.student_id,
        name: sptData.user_name,
        email: sptData.user_email
      },

      // Taxpayer information
      taxpayer_data: {
        nik: sptData.taxpayer_nik,
        full_name: sptData.taxpayer_full_name,
        handphone: sptData.taxpayer_phone,
        email: sptData.taxpayer_email
      },

      // Grade information (if exists)
      grade: sptData.grade_id ? {
        id: sptData.grade_id,
        final_score: parseFloat(sptData.final_score || 0),
        letter_grade: sptData.letter_grade,
        feedback: sptData.feedback,
        status: sptData.grade_status,
        graded_date: sptData.graded_date,

        // Detailed scoring criteria
        criteria_scores: {
          completeness: parseFloat(sptData.completeness_score || 0),
          accuracy: parseFloat(sptData.accuracy_score || 0),
          presentation: parseFloat(sptData.presentation_score || 0),
          understanding: parseFloat(sptData.understanding_score || 0)
        },

        // Comments for each criteria
        criteria_comments: {
          completeness: sptData.completeness_comment,
          accuracy: sptData.accuracy_comment,
          presentation: sptData.presentation_comment,
          understanding: sptData.understanding_comment
        }
      } : null,

      // Status indicators
      is_editable: ['draft', 'needs_revision'].includes(sptData.status),
      is_submitted: ['submitted', 'approved', 'graded'].includes(sptData.status),
      is_graded: sptData.status === 'graded' && sptData.grade_id,
      needs_revision: sptData.status === 'needs_revision'
    };

    console.log('SPT data retrieved for user:', {
      spt_id: sptData.id,
      user_id: user_id,
      user_name: sptData.user_name,
      status: sptData.status,
      has_grade: !!sptData.grade_id,
      is_editable: parsedData.is_editable
    });

    res.status(200).json({
      success: true,
      message: "Data SPT berhasil diambil",
      data: parsedData
    });

  } catch (error) {
    console.error('Get SPT detail for user error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message
    });
  }
};

/**
 * Get SPT list for dosen to grade - FIXED VERSION
 * GET /api/v2/dosen/spt-tahunan/for-grading
 */
exports.getSptListForGrading = async (req, res) => {
  try {
    console.log('=== getSptListForGrading START ===');
    console.log('User auth:', req.auth);
    console.log('Query params:', req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { status, search, year } = req.query;

    // Build filter conditions
    let whereConditions = [];
    let replacements = {
      limit: limit,
      offset: offset
    };

    if (status && status !== 'all') {
      whereConditions.push('spt.status = :status');
      replacements.status = status;
    } else {
      // Include all relevant statuses including 'approved'
      whereConditions.push("spt.status IN ('submitted', 'approved', 'graded', 'needs_revision')");
    }

    if (year) {
      whereConditions.push('spt.tax_year = :year');
      replacements.year = year;
    }

    if (search) {
      whereConditions.push('(u.nama LIKE :search OR u.id LIKE :search OR u.email LIKE :search)');
      replacements.search = `%${search}%`;
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    console.log('WHERE clause:', whereClause);
    console.log('Replacements:', replacements);

    // Query SPT dengan spt_grade join untuk mendapatkan info penilaian
    const sptQuery = `
      SELECT 
        spt.*,
        u.nama as user_name,
        u.email as user_email,
        u.id as student_id,
        sg.id as grade_id,
        sg.final_score,
        sg.letter_grade,
        sg.feedback,
        sg.completeness_score,
        sg.accuracy_score,
        sg.presentation_score,
        sg.understanding_score,
        sg.graded_date
      FROM spt_tahunan spt
      LEFT JOIN users u ON spt.user_id = u.id
      LEFT JOIN spt_grade sg ON spt.id = sg.spt_id AND sg.status = 'final'
      ${whereClause}
      ORDER BY spt.created_date DESC
      LIMIT :limit OFFSET :offset
    `;

    console.log('Executing query:', sptQuery);

    const sptList = await sequelizeConf.query(sptQuery, {
      replacements,
      type: sequelizeConf.QueryTypes.SELECT
    });

    console.log('Query result count:', sptList.length);

    // Count query
    const countQuery = `
      SELECT COUNT(DISTINCT spt.id) as total 
      FROM spt_tahunan spt
      LEFT JOIN users u ON spt.user_id = u.id
      ${whereClause}
    `;

    const [countResult] = await sequelizeConf.query(countQuery, {
      replacements,
      type: sequelizeConf.QueryTypes.SELECT
    });

    console.log('Count result:', countResult);

    // Transform data dengan grade info
    const transformedData = sptList.map(spt => ({
      id: spt.id,
      user_id: spt.user_id,
      tax_year: spt.tax_year,
      tax_type: spt.tax_type,
      tax_period: spt.tax_period,
      status: spt.status,
      submission_date: spt.submission_date,
      created_date: spt.created_date,
      updated_date: spt.updated_date,
      user: {
        name: spt.user_name,
        email: spt.user_email,
        student_id: spt.student_id
      },
      grade: spt.grade_id ? {
        id: spt.grade_id,
        score: parseFloat(spt.final_score),
        letter_grade: spt.letter_grade,
        feedback: spt.feedback,
        criteria: {
          completeness: parseFloat(spt.completeness_score || 0),
          accuracy: parseFloat(spt.accuracy_score || 0),
          presentation: parseFloat(spt.presentation_score || 0),
          understanding: parseFloat(spt.understanding_score || 0)
        },
        graded_date: spt.graded_date
      } : null
    }));

    console.log('Transformed data count:', transformedData.length);

    const response = {
      success: true,
      message: "SPT list retrieved successfully",
      data: {
        data: transformedData,
        pagination: {
          current_page: page,
          per_page: limit,
          total: countResult.total,
          total_pages: Math.ceil(countResult.total / limit)
        }
      }
    };

    console.log('=== RESPONSE SUCCESS ===');
    console.log('Data count:', response.data.data.length);
    console.log('Total:', response.data.pagination.total);

    res.status(200).json(response);

  } catch (error) {
    console.error('=== ERROR getSptListForGrading ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);

    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
      error: error.message
    });
  }
};

/**
 * Submit grade for SPT - FIXED VERSION
 * POST /api/v2/dosen/spt-tahunan/:spt_id/grade
 */
exports.gradeSpt = async (req, res) => {
  let transaction;

  try {
    transaction = await sequelizeConf.transaction();

    const { spt_id } = req.params;
    const dosen_id = req.auth._id;
    const {
      criteria: {
        completeness,
        accuracy,
        presentation,
        understanding
      },
      feedback,
      completeness_comment,
      accuracy_comment,
      presentation_comment,
      understanding_comment
    } = req.body;

    console.log('=== GRADE SPT DEBUG ===');
    console.log('SPT ID:', spt_id);
    console.log('Dosen ID:', dosen_id);
    console.log('Request body:', req.body);

    // Enhanced validation
    if (completeness === null || completeness === undefined ||
      accuracy === null || accuracy === undefined ||
      presentation === null || presentation === undefined ||
      understanding === null || understanding === undefined) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Semua kriteria penilaian harus diisi"
      });
    }

    // Validate score range and type
    const scores = [completeness, accuracy, presentation, understanding];
    for (let score of scores) {
      if (typeof score !== 'number' || isNaN(score) || score < 0 || score > 100) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Nilai harus berupa angka dalam rentang 0-100"
        });
      }
    }

    // Check spt_tahunan table structure and valid status values
    console.log('Checking spt_tahunan table status column...');
    try {
      const [statusColumn] = await sequelizeConf.query(
        "SHOW COLUMNS FROM spt_tahunan LIKE 'status'",
        { transaction, type: sequelizeConf.QueryTypes.SELECT }
      );
      console.log('SPT Tahunan status column:', statusColumn);

      // Extract ENUM values from Type field
      const enumMatch = statusColumn.Type.match(/enum\((.+)\)/);
      if (enumMatch) {
        const enumValues = enumMatch[1].split(',').map(v => v.replace(/'/g, ''));
        console.log('Available status values:', enumValues);

        if (!enumValues.includes('graded')) {
          await transaction.rollback();
          return res.status(500).json({
            success: false,
            message: "Tabel spt_tahunan belum mendukung status 'graded'. Silakan update ENUM values.",
            availableStatuses: enumValues
          });
        }
      }
    } catch (statusError) {
      console.log('Error checking status column:', statusError);
    }

    // Validate SPT exists
    const [spt] = await sequelizeConf.query(
      `SELECT 
        spt.id, spt.user_id, spt.status, spt.tax_year,
        u.nama as user_name, u.email as user_email
      FROM spt_tahunan spt
      LEFT JOIN users u ON spt.user_id = u.id
      WHERE spt.id = ? AND spt.status IN ('submitted', 'approved', 'graded', 'needs_revision')
      LIMIT 1`,
      {
        replacements: [spt_id],
        type: sequelizeConf.QueryTypes.SELECT,
        transaction
      }
    );

    if (!spt) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "SPT tidak ditemukan atau tidak tersedia untuk dinilai"
      });
    }

    console.log('Found SPT:', spt);

    // Check existing grade
    const [existingGrade] = await sequelizeConf.query(
      `SELECT id, revision_number FROM spt_grade 
       WHERE spt_id = ? AND status = 'final'
       ORDER BY revision_number DESC
       LIMIT 1`,
      {
        replacements: [spt_id],
        type: sequelizeConf.QueryTypes.SELECT,
        transaction
      }
    );

    const revisionNumber = existingGrade ? existingGrade.revision_number + 1 : 1;
    const previousGradeId = existingGrade ? existingGrade.id : null;

    // Calculate scores
    const finalScore = Math.round(((completeness + accuracy + presentation + understanding) / 4) * 100) / 100;

    // Calculate letter grade
    let letterGrade;
    if (finalScore >= 85) letterGrade = 'A';
    else if (finalScore >= 80) letterGrade = 'A-';
    else if (finalScore >= 75) letterGrade = 'B+';
    else if (finalScore >= 70) letterGrade = 'B';
    else if (finalScore >= 65) letterGrade = 'B-';
    else if (finalScore >= 60) letterGrade = 'C+';
    else if (finalScore >= 55) letterGrade = 'C';
    else if (finalScore >= 50) letterGrade = 'C-';
    else if (finalScore >= 40) letterGrade = 'D';
    else letterGrade = 'E';

    console.log('Calculated grade:', { finalScore, letterGrade });

    // Mark previous grade as revised if exists
    if (existingGrade) {
      await sequelizeConf.query(
        `UPDATE spt_grade SET status = 'revised' WHERE id = ?`,
        {
          replacements: [existingGrade.id],
          type: sequelizeConf.QueryTypes.UPDATE,
          transaction
        }
      );
    }

    // Insert new grade
    console.log('Inserting grade...');
    const [insertResult] = await sequelizeConf.query(
      `INSERT INTO spt_grade (
        spt_id, graded_by, student_id, 
        completeness_score, accuracy_score, presentation_score, understanding_score,
        final_score, letter_grade,
        feedback, completeness_comment, accuracy_comment, presentation_comment, understanding_comment,
        status, revision_number, previous_grade_id,
        graded_date, created_date, updated_date
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'final', ?, ?, NOW(), NOW(), NOW()
      )`,
      {
        replacements: [
          parseInt(spt_id),
          parseInt(dosen_id),
          parseInt(spt.user_id),
          parseFloat(completeness).toFixed(2),
          parseFloat(accuracy).toFixed(2),
          parseFloat(presentation).toFixed(2),
          parseFloat(understanding).toFixed(2),
          parseFloat(finalScore).toFixed(2),
          letterGrade,
          (feedback || '').trim().substring(0, 1000),
          (completeness_comment || '').trim().substring(0, 1000),
          (accuracy_comment || '').trim().substring(0, 1000),
          (presentation_comment || '').trim().substring(0, 1000),
          (understanding_comment || '').trim().substring(0, 1000),
          revisionNumber,
          previousGradeId
        ],
        type: sequelizeConf.QueryTypes.INSERT,
        transaction
      }
    );

    console.log('Grade inserted successfully:', insertResult);

    // Update SPT status - This is where the error occurs
    console.log('Updating SPT status to graded...');
    try {
      await sequelizeConf.query(
        `UPDATE spt_tahunan 
         SET status = 'graded', processed_by = ?, processed_date = NOW(), updated_date = NOW()
         WHERE id = ?`,
        {
          replacements: [parseInt(dosen_id), parseInt(spt_id)],
          type: sequelizeConf.QueryTypes.UPDATE,
          transaction
        }
      );
      console.log('SPT status updated successfully');
    } catch (updateError) {
      console.error('Error updating SPT status:', updateError);

      // If status update fails due to ENUM, try without changing status
      console.log('Attempting to save grade without updating SPT status...');

      // The grade was already inserted successfully, so we can still return success
      // But inform the user about the status issue
      await transaction.commit();

      return res.status(200).json({
        success: true,
        message: "Penilaian berhasil disimpan, tetapi status SPT tidak dapat diupdate. Silakan update ENUM spt_tahunan.status.",
        data: {
          grade_id: insertResult,
          final_score: parseFloat(finalScore.toFixed(2)),
          letter_grade: letterGrade,
          revision_number: revisionNumber,
          graded_date: new Date().toISOString()
        },
        warning: "Status SPT tidak diupdate karena ENUM value 'graded' tidak tersedia"
      });
    }

    await transaction.commit();

    console.log('Grade submitted successfully');

    res.status(200).json({
      success: true,
      message: "Penilaian berhasil disimpan",
      data: {
        grade_id: insertResult,
        final_score: parseFloat(finalScore.toFixed(2)),
        letter_grade: letterGrade,
        revision_number: revisionNumber,
        graded_date: new Date().toISOString()
      }
    });

  } catch (error) {
    if (transaction) await transaction.rollback();

    console.error('=== ERROR gradeSpt ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('SQL:', error.sql);

    // Enhanced error handling
    let errorMessage = "Terjadi kesalahan server saat menyimpan penilaian";
    let statusCode = 500;

    if (error.message && error.message.includes("Data truncated for column 'status'")) {
      errorMessage = "Kolom status di tabel spt_tahunan tidak mendukung nilai 'graded'. Silakan update ENUM values.";
      statusCode = 500;
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      errorMessage = "Tabel yang diperlukan belum dibuat. Silakan jalankan migration database.";
      statusCode = 500;
    } else if (error.code === 'ER_BAD_FIELD_ERROR') {
      errorMessage = "Struktur tabel tidak sesuai. Silakan update schema database.";
      statusCode = 500;
    } else if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      errorMessage = "Format data tidak valid. Periksa nilai ENUM atau tipe data.";
      statusCode = 400;
    } else if (error.code === 'ER_DUP_ENTRY') {
      errorMessage = "Penilaian untuk SPT ini sudah ada dengan revision yang sama.";
      statusCode = 400;
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        sql: error.sql
      } : 'Internal server error',
      solution: error.message && error.message.includes("Data truncated for column 'status'") ?
        "Jalankan SQL: ALTER TABLE spt_tahunan MODIFY COLUMN status ENUM('draft','submitted','approved','graded','needs_revision','rejected') DEFAULT 'draft';" :
        null
    });
  }
};
/**
 * Preview SPT PDF for dosen - FIXED VERSION
 * GET /api/v2/dosen/spt-tahunan/:spt_id/preview
 */
exports.previewSptPdf = async (req, res) => {
  try {
    const { spt_id } = req.params;
    const user_id = req.auth._id;
    const role = req.auth.authorize;

    console.log('=== Preview SPT Request ===');
    console.log('SPT ID:', spt_id);
    console.log('User ID:', user_id);
    console.log('Role:', role);

    // Build query based on role
    let whereClause = 'WHERE spt.id = :sptId';
    let replacements = { sptId: spt_id };

    // If mahasiswa, only show their own SPT
    if (role === 'mahasiswa') {
      whereClause += ' AND spt.user_id = :userId';
      replacements.userId = user_id;
    }

    const [sptData] = await sequelizeConf.query(
      `SELECT 
        spt.*,
        u.nama as user_name,
        u.email as user_email,
        u.id as student_id,
        t.nik as taxpayer_nik,
        t.full_name as taxpayer_full_name,
        t.handphone as taxpayer_phone,
        t.email as taxpayer_email,
        sg.final_score,
        sg.letter_grade,
        sg.feedback,
        sg.completeness_score,
        sg.accuracy_score,
        sg.presentation_score,
        sg.understanding_score,
        sg.completeness_comment,
        sg.accuracy_comment,
        sg.presentation_comment,
        sg.understanding_comment,
        sg.graded_date
      FROM spt_tahunan spt
      LEFT JOIN users u ON spt.user_id = u.id
      LEFT JOIN taxpayer t ON spt.user_id = t.user_id
      LEFT JOIN spt_grade sg ON spt.id = sg.spt_id AND sg.status = 'final'
      ${whereClause}
      LIMIT 1`,
      {
        replacements,
        type: sequelizeConf.QueryTypes.SELECT
      }
    );

    if (!sptData) {
      console.log('SPT not found for ID:', spt_id);
      return res.status(404).send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2>❌ SPT Tidak Ditemukan</h2>
            <p>SPT dengan ID ${spt_id} tidak ditemukan atau Anda tidak memiliki akses.</p>
            <p style="color: #666; font-size: 12px;">User ID: ${user_id} | Role: ${role}</p>
          </body>
        </html>
      `);
    }

    console.log('SPT Data found:', {
      id: sptData.id,
      user_name: sptData.user_name,
      status: sptData.status,
      has_grade: !!sptData.final_score
    });

    // Parse JSON data safely
    let taxpayerIdentity = {};
    let incomeData = {};
    let statementData = {};
    let taxCalculation = {};
    let taxCredit = {};
    let underpaymentOverpayment = {};
    let amendmentTaxReturn = {};
    let refundData = {};
    let incomeInstallment = {};
    let otherTransactions = {};
    let additionalAttachments = {};

    try {
      taxpayerIdentity = sptData.taxpayer_identity ? JSON.parse(sptData.taxpayer_identity) : {};
      incomeData = sptData.income_summary ? JSON.parse(sptData.income_summary) : {};
      statementData = sptData.statement_data ? JSON.parse(sptData.statement_data) : {};
      taxCalculation = sptData.income_tax_calculation ? JSON.parse(sptData.income_tax_calculation) : {};
      taxCredit = sptData.income_tax_credit ? JSON.parse(sptData.income_tax_credit) : {};
      underpaymentOverpayment = sptData.underpayment_overpayment ? JSON.parse(sptData.underpayment_overpayment) : {};
      amendmentTaxReturn = sptData.amendment_tax_return ? JSON.parse(sptData.amendment_tax_return) : {};
      refundData = sptData.refund_data ? JSON.parse(sptData.refund_data) : {};
      incomeInstallment = sptData.income_tax_installment ? JSON.parse(sptData.income_tax_installment) : {};
      otherTransactions = sptData.other_transactions ? JSON.parse(sptData.other_transactions) : {};
      additionalAttachments = sptData.additional_attachments ? JSON.parse(sptData.additional_attachments) : {};
    } catch (parseError) {
      console.log('JSON parse error (non-critical):', parseError.message);
    }

    // Generate HTML for PDF preview
    const htmlContent = generateEnhancedSptHtml(
      sptData,
      taxpayerIdentity,
      incomeData,
      statementData,
      taxCalculation,
      taxCredit,
      underpaymentOverpayment,
      amendmentTaxReturn,
      refundData,
      incomeInstallment,
      otherTransactions,
      additionalAttachments
    );

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(htmlContent);

  } catch (error) {
    console.error('=== Preview SPT Error ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);

    res.status(500).send(`
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>❌ Error Loading SPT Preview</h2>
          <p>Terjadi kesalahan saat memuat preview SPT:</p>
          <div style="background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; margin: 10px 0;">
            ${error.message}
          </div>
          <p><strong>SPT ID:</strong> ${req.params.spt_id}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            🔄 Reload
          </button>
        </body>
      </html>
    `);
  }
};

// Enhanced HTML generator function untuk SPT preview
function generateEnhancedSptHtml(sptData, taxpayerIdentity, incomeData, statementData, taxCalculation, taxCredit, underpaymentOverpayment, amendmentTaxReturn, refundData, incomeInstallment, otherTransactions, additionalAttachments) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '-';
    }
  };

  const formatBoolean = (value) => {
    if (value === true) return 'Ya';
    if (value === false) return 'Tidak';
    return '-';
  };

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <title>Preview SPT ${sptData.tax_year} - ${sptData.user_name}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * { box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background: #f8f9fa;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 8px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center; 
                padding: 30px 20px;
                margin-bottom: 0;
            }
            .header h1 {
                margin: 0 0 10px 0;
                font-size: 24px;
                font-weight: 700;
            }
            .header h2 {
                margin: 0 0 15px 0;
                font-size: 16px;
                font-weight: 400;
                opacity: 0.9;
            }
            .header .tax-year {
                background: rgba(255,255,255,0.2);
                padding: 8px 16px;
                border-radius: 20px;
                display: inline-block;
                font-weight: 600;
            }
            .content {
                padding: 30px;
            }
            .section { 
                margin-bottom: 30px; 
                border: 1px solid #e9ecef;
                border-radius: 8px;
                overflow: hidden;
                background: white;
            }
            .section-title { 
                background: #f8f9fa;
                color: #495057;
                font-weight: bold; 
                font-size: 16px; 
                padding: 15px 20px;
                margin: 0;
                border-bottom: 1px solid #e9ecef;
            }
            .section-content {
                padding: 20px;
            }
            .field-row {
                display: flex;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px dotted #dee2e6;
            }
            .field-row:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            .field-label { 
                font-weight: 600; 
                width: 200px; 
                color: #6c757d;
                flex-shrink: 0;
            }
            .field-value { 
                flex: 1;
                color: #495057;
                word-break: break-word;
            }
            .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 15px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .status-submitted { background: #17a2b8; color: white; }
            .status-approved { background: #28a745; color: white; }
            .status-graded { background: #6f42c1; color: white; }
            .status-draft { background: #6c757d; color: white; }
            .grade-section {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .grade-section .section-title {
                background: rgba(255,255,255,0.1);
                color: white;
                border-bottom-color: rgba(255,255,255,0.2);
            }
            .grade-section .field-label {
                color: rgba(255,255,255,0.8);
            }
            .grade-section .field-value {
                color: white;
                font-weight: 500;
            }
            .summary-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
                font-size: 14px;
            }
            .summary-table th,
            .summary-table td {
                border: 1px solid #dee2e6;
                padding: 12px 15px;
                text-align: left;
            }
            .summary-table th {
                background: #f8f9fa;
                font-weight: 600;
                color: #495057;
            }
            .amount {
                text-align: right;
                font-family: 'Courier New', monospace;
                font-weight: 500;
            }
            .total-row {
                font-weight: 700;
                background: #e9ecef;
            }
            .grade-table {
                background: rgba(255,255,255,0.1);
                color: white;
            }
            .grade-table th {
                background: rgba(255,255,255,0.2);
                color: white;
                border-color: rgba(255,255,255,0.3);
            }
            .grade-table td {
                border-color: rgba(255,255,255,0.3);
            }
            .feedback-box {
                background: rgba(255,255,255,0.1);
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid rgba(255,255,255,0.5);
                margin-top: 15px;
            }
            .watermark {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 120px;
                color: rgba(0,0,0,0.03);
                z-index: 1;
                pointer-events: none;
                font-weight: bold;
                user-select: none;
            }
            .footer {
                margin-top: 40px;
                padding: 20px;
                background: #f8f9fa;
                text-align: center;
                color: #6c757d;
                font-size: 13px;
                border-top: 1px solid #dee2e6;
            }
            .success-icon { color: #28a745; }
            .info-icon { color: #17a2b8; }
            .warning-icon { color: #ffc107; }
            
            @media print {
                body { 
                    background: white; 
                    padding: 0;
                }
                .container {
                    box-shadow: none;
                    border-radius: 0;
                }
                .watermark { 
                    color: rgba(0,0,0,0.05);
                }
            }
            
            @media (max-width: 768px) {
                .content { padding: 15px; }
                .field-row { flex-direction: column; }
                .field-label { width: auto; margin-bottom: 5px; }
                .summary-table { font-size: 12px; }
            }
        </style>
    </head>
    <body>
        <div class="watermark">SIMULASI</div>
        
        <div class="container">
            <div class="header">
                <h1>📋 SURAT PEMBERITAHUAN TAHUNAN</h1>
                <h2>Pajak Penghasilan Wajib Pajak Orang Pribadi</h2>
                <div class="tax-year">Tahun Pajak ${sptData.tax_year}</div>
            </div>

            <div class="content">
                <!-- Informasi Umum -->
                <div class="section">
                    <div class="section-title">📊 Informasi Umum</div>
                    <div class="section-content">
                        <div class="field-row">
                            <div class="field-label">Nama Wajib Pajak:</div>
                            <div class="field-value"><strong>${sptData.user_name || '-'}</strong></div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">NIM:</div>
                            <div class="field-value">${sptData.student_id || '-'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Email:</div>
                            <div class="field-value">${sptData.user_email || '-'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Status SPT:</div>
                            <div class="field-value">
                                <span class="status-badge status-${sptData.status}">${sptData.status}</span>
                            </div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Tanggal Submit:</div>
                            <div class="field-value">${formatDateTime(sptData.submission_date)}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Periode Pajak:</div>
                            <div class="field-value">${sptData.tax_period || `${sptData.tax_year} January - December`}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Jenis Pembukuan:</div>
                            <div class="field-value">${sptData.bookkeeping_type || 'Simple Bookkeeping'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Sumber Penghasilan:</div>
                            <div class="field-value">${sptData.source_of_income || '-'}</div>
                        </div>
                    </div>
                </div>

                <!-- A. Identitas Wajib Pajak -->
                <div class="section">
                    <div class="section-title">🆔 A. IDENTITAS WAJIB PAJAK</div>
                    <div class="section-content">
                        <div class="field-row">
                            <div class="field-label">NIK:</div>
                            <div class="field-value">${taxpayerIdentity.nik || taxpayerIdentity.id_number || '-'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Nama Lengkap:</div>
                            <div class="field-value">${taxpayerIdentity.name || taxpayerIdentity.full_name || '-'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Jenis Identitas:</div>
                            <div class="field-value">${taxpayerIdentity.identity_type || 'KTP'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">No. Telepon:</div>
                            <div class="field-value">${taxpayerIdentity.mobile_phone || '-'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Email:</div>
                            <div class="field-value">${taxpayerIdentity.email || '-'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Status Kewajiban Pajak:</div>
                            <div class="field-value">${taxpayerIdentity.tax_obligation_status || '-'}</div>
                        </div>
                        ${taxpayerIdentity.spouse_nik ? `
                        <div class="field-row">
                            <div class="field-label">NIK Pasangan:</div>
                            <div class="field-value">${taxpayerIdentity.spouse_nik}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- B. Ringkasan Penghasilan -->
                <div class="section">
                    <div class="section-title">💰 B. RINGKASAN PENGHASILAN</div>
                    <div class="section-content">
                        <div class="field-row">
                            <div class="field-label">Penghasilan dari Pekerjaan:</div>
                            <div class="field-value">${formatBoolean(incomeData.employment_income)}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Penghasilan dari Usaha:</div>
                            <div class="field-value">${formatBoolean(incomeData.business_income)}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Penghasilan Lain Dalam Negeri:</div>
                            <div class="field-value">${formatBoolean(incomeData.other_domestic_income)}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Penghasilan Luar Negeri:</div>
                            <div class="field-value">${formatBoolean(incomeData.foreign_income)}</div>
                        </div>
                    </div>
                </div>

                <!-- C. Perhitungan Pajak -->
                <div class="section">
                    <div class="section-title">🧮 C. PERHITUNGAN PAJAK PENGHASILAN</div>
                    <div class="section-content">
                        <div class="field-row">
                            <div class="field-label">Pengurangan Penghasilan Neto:</div>
                            <div class="field-value">${formatBoolean(taxCalculation.net_income_deduction)}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">PTKP (Penghasilan Tidak Kena Pajak):</div>
                            <div class="field-value">${taxCalculation.tax_exemptions || '-'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Pengurangan Pajak Penghasilan:</div>
                            <div class="field-value">${formatBoolean(taxCalculation.income_tax_deduction)}</div>
                        </div>
                    </div>
                </div>

                <!-- D. Kredit Pajak -->
                <div class="section">
                    <div class="section-title">💳 D. KREDIT PAJAK</div>
                    <div class="section-content">
                        <div class="field-row">
                            <div class="field-label">PPh yang Dipotong/Dipungut:</div>
                            <div class="field-value">${formatBoolean(taxCredit.withheld_income_tax)}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">PPh Pasal 25 Angsuran:</div>
                            <div class="field-value">${formatBoolean(taxCredit.installment_article_25)}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">STP Pajak Penghasilan:</div>
                            <div class="field-value">${formatBoolean(taxCredit.notice_tax_collection)}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Kredit Pajak Luar Negeri:</div>
                            <div class="field-value">${formatBoolean(taxCredit.foreign_tax_credit)}</div>
                        </div>
                    </div>
                </div>

                <!-- E. Kurang/Lebih Bayar -->
                <div class="section">
                    <div class="section-title">⚖️ E. KURANG/LEBIH BAYAR</div>
                    <div class="section-content">
                        <div class="field-row">
                            <div class="field-label">Surat Persetujuan Angsuran:</div>
                            <div class="field-value">${formatBoolean(underpaymentOverpayment.approval_letter)}</div>
                        </div>
                    </div>
                </div>

                <!-- F. SPT Pembetulan -->
                ${Object.keys(amendmentTaxReturn).length > 0 ? `
                <div class="section">
                    <div class="section-title">📝 F. SPT PEMBETULAN</div>
                    <div class="section-content">
                        ${amendmentTaxReturn.previous_underpayment ? `
                        <div class="field-row">
                            <div class="field-label">Kurang Bayar SPT Sebelumnya:</div>
                            <div class="field-value">Rp. ${formatCurrency(amendmentTaxReturn.previous_underpayment)}</div>
                        </div>
                        ` : ''}
                        ${amendmentTaxReturn.amendment_underpayment ? `
                        <div class="field-row">
                            <div class="field-label">Kurang Bayar SPT Pembetulan:</div>
                            <div class="field-value">Rp. ${formatCurrency(amendmentTaxReturn.amendment_underpayment)}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}

                <!-- G. Restitusi -->
                ${Object.keys(refundData).length > 0 ? `
                <div class="section">
                    <div class="section-title">💸 G. RESTITUSI</div>
                    <div class="section-content">
                        ${refundData.refund_method ? `
                        <div class="field-row">
                            <div class="field-label">Cara Pengembalian:</div>
                            <div class="field-value">${refundData.refund_method}</div>
                        </div>
                        ` : ''}
                        ${refundData.bank_account ? `
                        <div class="field-row">
                            <div class="field-label">Bank:</div>
                            <div class="field-value">${refundData.bank_account}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}

                <!-- H. Angsuran PPh Pasal 25 -->
                ${Object.keys(incomeInstallment).length > 0 ? `
                <div class="section">
                    <div class="section-title">📅 H. ANGSURAN PPh PASAL 25</div>
                    <div class="section-content">
                        <div class="field-row">
                            <div class="field-label">Kewajiban Angsuran Pasal 25:</div>
                            <div class="field-value">${formatBoolean(incomeInstallment.article_25_obligation)}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Pengusaha Tertentu:</div>
                            <div class="field-value">${formatBoolean(incomeInstallment.specific_entrepreneur)}</div>
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- I. Transaksi Lainnya -->
                ${Object.keys(otherTransactions).length > 0 ? `
                <div class="section">
                    <div class="section-title">🔄 I. TRANSAKSI LAINNYA</div>
                    <div class="section-content">
                        <div class="field-row">
                            <div class="field-label">Harta Akhir Tahun:</div>
                            <div class="field-value">${formatBoolean(otherTransactions.assets_end_year)}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Utang Akhir Tahun:</div>
                            <div class="field-value">${formatBoolean(otherTransactions.debt_end_year)}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">PPh Final:</div>
                            <div class="field-value">${formatBoolean(otherTransactions.final_income_tax)}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Penghasilan yang Dikecualikan:</div>
                            <div class="field-value">${formatBoolean(otherTransactions.excluded_income)}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Penyusutan/Amortisasi:</div>
                            <div class="field-value">${formatBoolean(otherTransactions.depreciation_amortization)}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Biaya Jamuan:</div>
                            <div class="field-value">${formatBoolean(otherTransactions.entertainment_expense)}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Dividen:</div>
                            <div class="field-value">${formatBoolean(otherTransactions.dividend_income)}</div>
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- J. Lampiran Tambahan -->
                ${Object.keys(additionalAttachments).length > 0 ? `
                <div class="section">
                    <div class="section-title">📎 J. LAMPIRAN TAMBAHAN</div>
                    <div class="section-content">
                        ${additionalAttachments.financial_statement ? `
                        <div class="field-row">
                            <div class="field-label">Laporan Keuangan:</div>
                            <div class="field-value">${additionalAttachments.financial_statement.required ? 'Diperlukan' : 'Tidak Diperlukan'}</div>
                        </div>
                        ` : ''}
                        ${additionalAttachments.payment_proof ? `
                        <div class="field-row">
                            <div class="field-label">Bukti Pembayaran:</div>
                            <div class="field-value">${additionalAttachments.payment_proof.required ? 'Diperlukan' : 'Tidak Diperlukan'}</div>
                        </div>
                        ` : ''}
                        ${additionalAttachments.withholding_relation ? `
                        <div class="field-row">
                            <div class="field-label">Hubungan Pemotongan:</div>
                            <div class="field-value">${additionalAttachments.withholding_relation.required ? 'Diperlukan' : 'Tidak Diperlukan'}</div>
                        </div>
                        ` : ''}
                        ${additionalAttachments.attorney_letter ? `
                        <div class="field-row">
                            <div class="field-label">Surat Kuasa:</div>
                            <div class="field-value">${additionalAttachments.attorney_letter.required ? 'Diperlukan' : 'Tidak Diperlukan'}</div>
                        </div>
                        ` : ''}
                        ${additionalAttachments.other_documents ? `
                        <div class="field-row">
                            <div class="field-label">Dokumen Lainnya:</div>
                            <div class="field-value">${additionalAttachments.other_documents.required ? 'Diperlukan' : 'Tidak Diperlukan'}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}

                <!-- K. Pernyataan -->
                <div class="section">
                    <div class="section-title">✍️ K. PERNYATAAN</div>
                    <div class="section-content">
                        <div class="field-row">
                            <div class="field-label">Status Pernyataan:</div>
                            <div class="field-value">
                                ${statementData.declaration ?
      '<span class="success-icon">✅</span> Saya menyatakan bahwa SPT ini telah diisi dengan benar dan lengkap' :
      '<span class="warning-icon">⚠️</span> Pernyataan belum dibuat'
    }
                            </div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Nama Lengkap:</div>
                            <div class="field-value">${statementData.full_name || '-'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">NIK:</div>
                            <div class="field-value">${statementData.tin_nik || '-'}</div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Tanggal Pernyataan:</div>
                            <div class="field-value">${formatDate(sptData.submission_date)}</div>
                        </div>
                        ${statementData.representative ? `
                        <div class="field-row">
                            <div class="field-label">Kuasa/Wakil:</div>
                            <div class="field-value">${statementData.representative}</div>
                        </div>
                        ` : ''}
                        ${statementData.signature ? `
                        <div class="field-row">
                            <div class="field-label">Tanda Tangan:</div>
                            <div class="field-value">🔏 ${statementData.signature}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Penilaian Dosen (jika ada) -->
                ${sptData.final_score ? `
                <div class="section grade-section">
                    <div class="section-title">🎓 PENILAIAN DOSEN</div>
                    <div class="section-content">
                        <div class="field-row">
                            <div class="field-label">Nilai Akhir:</div>
                            <div class="field-value">
                                <strong style="font-size: 18px;">
                                    ${Math.round(sptData.final_score)}/100 (${sptData.letter_grade})
                                </strong>
                            </div>
                        </div>
                        <div class="field-row">
                            <div class="field-label">Tanggal Penilaian:</div>
                            <div class="field-value">${formatDateTime(sptData.graded_date)}</div>
                        </div>
                        
                        ${sptData.completeness_score ? `
                        <h4 style="margin: 20px 0 15px 0; color: white;">📊 Detail Penilaian:</h4>
                        <table class="summary-table grade-table">
                            <thead>
                                <tr>
                                    <th style="width: 35%">Kriteria</th>
                                    <th style="width: 15%">Bobot</th>
                                    <th style="width: 20%">Skor</th>
                                    <th style="width: 20%">Nilai</th>
                                    <th style="width: 10%">Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>📋 Kelengkapan Data</td>
                                    <td class="amount">25%</td>
                                    <td class="amount">${Math.round(sptData.completeness_score || 0)}</td>
                                    <td class="amount">${Math.round((sptData.completeness_score || 0) * 0.25)}</td>
                                    <td class="amount">${getLetterGrade(sptData.completeness_score || 0)}</td>
                                </tr>
                                <tr>
                                    <td>🎯 Keakuratan Perhitungan</td>
                                    <td class="amount">25%</td>
                                    <td class="amount">${Math.round(sptData.accuracy_score || 0)}</td>
                                    <td class="amount">${Math.round((sptData.accuracy_score || 0) * 0.25)}</td>
                                    <td class="amount">${getLetterGrade(sptData.accuracy_score || 0)}</td>
                                </tr>
                                <tr>
                                    <td>🎨 Penyajian & Format</td>
                                    <td class="amount">25%</td>
                                    <td class="amount">${Math.round(sptData.presentation_score || 0)}</td>
                                    <td class="amount">${Math.round((sptData.presentation_score || 0) * 0.25)}</td>
                                    <td class="amount">${getLetterGrade(sptData.presentation_score || 0)}</td>
                                </tr>
                                <tr>
                                    <td>🧠 Pemahaman Konsep</td>
                                    <td class="amount">25%</td>
                                    <td class="amount">${Math.round(sptData.understanding_score || 0)}</td>
                                    <td class="amount">${Math.round((sptData.understanding_score || 0) * 0.25)}</td>
                                    <td class="amount">${getLetterGrade(sptData.understanding_score || 0)}</td>
                                </tr>
                                <tr class="total-row">
                                    <td><strong>📈 Total</strong></td>
                                    <td class="amount"><strong>100%</strong></td>
                                    <td class="amount">-</td>
                                    <td class="amount"><strong>${Math.round(sptData.final_score)}</strong></td>
                                    <td class="amount"><strong>${sptData.letter_grade}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                        ` : ''}
                        
                        ${sptData.feedback ? `
                        <div style="margin-top: 20px;">
                            <h4 style="margin: 0 0 10px 0; color: white;">💬 Feedback Dosen:</h4>
                            <div class="feedback-box">
                                ${sptData.feedback}
                            </div>
                        </div>
                        ` : ''}

                        ${(sptData.completeness_comment || sptData.accuracy_comment || sptData.presentation_comment || sptData.understanding_comment) ? `
                        <div style="margin-top: 20px;">
                            <h4 style="margin: 0 0 15px 0; color: white;">📝 Komentar Detail:</h4>
                            ${sptData.completeness_comment ? `
                            <div class="feedback-box" style="margin-bottom: 10px;">
                                <strong>📋 Kelengkapan:</strong> ${sptData.completeness_comment}
                            </div>
                            ` : ''}
                            ${sptData.accuracy_comment ? `
                            <div class="feedback-box" style="margin-bottom: 10px;">
                                <strong>🎯 Keakuratan:</strong> ${sptData.accuracy_comment}
                            </div>
                            ` : ''}
                            ${sptData.presentation_comment ? `
                            <div class="feedback-box" style="margin-bottom: 10px;">
                                <strong>🎨 Penyajian:</strong> ${sptData.presentation_comment}
                            </div>
                            ` : ''}
                            ${sptData.understanding_comment ? `
                            <div class="feedback-box" style="margin-bottom: 10px;">
                                <strong>🧠 Pemahaman:</strong> ${sptData.understanding_comment}
                            </div>
                            ` : ''}
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}
            </div>

            <!-- Footer -->
            <div class="footer">
                <p><strong>📄 Dokumen SPT Tahunan Simulasi</strong></p>
                <p>🕒 Digenerate pada: ${formatDateTime(new Date())}</p>
                <p><em>✨ Dokumen ini dibuat dalam mode simulasi untuk keperluan pembelajaran</em></p>
                <p style="margin-top: 15px; font-size: 11px; color: #999;">
                    ID SPT: ${sptData.id} | Status: ${sptData.status} | 
                    ${sptData.submission_date ? 'Submit: ' + formatDate(sptData.submission_date) : 'Belum Submit'}
                    ${sptData.final_score ? ` | Nilai: ${Math.round(sptData.final_score)}/100` : ''}
                </p>
            </div>
        </div>

        <script>
            // Auto print untuk PDF generation jika diperlukan
            if (window.location.search.includes('print=true')) {
                setTimeout(() => window.print(), 1000);
            }
            
            // Console logging untuk debugging
            console.log('✅ SPT Preview loaded successfully');
            console.log('📊 SPT ID: ${sptData.id}');
            console.log('📈 Status: ${sptData.status}');
            console.log('🎓 Has Grade: ${!!sptData.final_score}');
            
            // Add loading completed indicator
            document.body.classList.add('loaded');
        </script>
    </body>
    </html>
  `;

  // Helper function untuk letter grade
  function getLetterGrade(score) {
    if (score >= 85) return 'A';
    else if (score >= 80) return 'A-';
    else if (score >= 75) return 'B+';
    else if (score >= 70) return 'B';
    else if (score >= 65) return 'B-';
    else if (score >= 60) return 'C+';
    else if (score >= 55) return 'C';
    else if (score >= 50) return 'C-';
    else if (score >= 40) return 'D';
    else return 'E';
  }
};

exports.deleteSpt = async (req, res) => {
  let transaction;

  try {
    transaction = await sequelizeConf.transaction();

    const { spt_id } = req.params;
    const user_id = req.auth._id;


    const [sptData] = await sequelizeConf.query(
      `SELECT 
        id, user_id, status, tax_year, tax_period
      FROM spt_tahunan 
      WHERE id = :sptId AND user_id = :userId
      LIMIT 1`,
      {
        replacements: { sptId: spt_id, userId: user_id },
        type: sequelizeConf.QueryTypes.SELECT,
        transaction
      }
    );


    // Check if SPT can be deleted (only draft status can be deleted)
    if (sptData.status !== 'draft') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `SPT dengan status '${sptData.status}' tidak dapat dihapus. Hanya SPT dengan status 'draft' yang dapat dihapus.`
      });
    }

    // Delete the main SPT record
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
      message: `SPT Tahunan ${sptData.tax_year} berhasil dihapus`,
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

    console.error('=== DELETE SPT ERROR ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);

    // Enhanced error handling
    let errorMessage = "Terjadi kesalahan server saat menghapus SPT";
    let statusCode = 500;

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      errorMessage = "SPT tidak dapat dihapus karena masih memiliki data terkait. Hubungi administrator.";
      statusCode = 400;
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      errorMessage = "Tabel database tidak ditemukan. Hubungi administrator untuk perbaikan sistem.";
      statusCode = 500;
    } else if (error.code === 'ER_BAD_FIELD_ERROR') {
      errorMessage = "Struktur database tidak sesuai. Hubungi administrator.";
      statusCode = 500;
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        stack: error.stack
      } : 'Internal server error'
    });
  }
};
