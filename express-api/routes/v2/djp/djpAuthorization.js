const users = require("../../../models/users.model");
const taxpayer = require("../../../models/taxpayer.model");
const djp_authorization = require("../../../models/djp_authorization.model");

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const { Op } = require('sequelize');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const sequelizeConf = require('../../../config/sequelizeconf');

// Multer configuration for identity photo upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../../assets/uploads/djp');

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, 'identity-' + uniqueSuffix + extension);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Hanya file gambar yang diperbolehkan (jpeg, jpg, png)'));
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 2 }, // 2MB max file size
    fileFilter: fileFilter
}).single('identity_photo');

// Helper function to generate authorization code
function generateAuthorizationCode() {
    const prefix = 'DJP';
    const timestamp = moment().format('YYYYMMDD');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
}

// Create DJP Authorization Request
exports.createDJPAuthorization = async (req, res) => {
    upload(req, res, async (uploadError) => {
        if (uploadError) {
            return res.status(400).json({
                success: false,
                message: "Error uploading file: " + uploadError.message
            });
        }

        let transaction;

        try {
            // Start transaction
            transaction = await sequelizeConf.transaction();

            // Validation schema
            const schema = Joi.object({
                requestChannel: Joi.string().valid('daring', 'luring').default('daring'),
                requestDate: Joi.date().default(moment().format('YYYY-MM-DD')),
                nikNpwp: Joi.string().min(16).max(20).required(),
                taxpayerName: Joi.string().min(2).max(200).optional(),
                address: Joi.string().optional(),
                email: Joi.string().email().required(),
                handphone: Joi.string().min(8).max(20).required(),
                certificateType: Joi.string().valid('kode_otorisasi_djp', 'brin', 'bssn', 'peruri', 'privy_id').default('kode_otorisasi_djp'),
                passphrase: Joi.string().min(6).required(),
                confirmPassphrase: Joi.string().min(6).required(),
                statement: Joi.boolean().truthy('true', 1).required()
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                // Clean up file if validation error
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    success: false,
                    message: "Validation error: " + error.details[0].message
                });
            }

            const {
                requestChannel,
                requestDate,
                nikNpwp,
                taxpayerName,
                address,
                email,
                handphone,
                certificateType,
                passphrase,
                confirmPassphrase,
                statement
            } = value;

            // Check passphrase match
            if (passphrase !== confirmPassphrase) {
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    success: false,
                    message: "Passphrase tidak cocok"
                });
            }

            // Require identity photo upload
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Foto identitas wajib diunggah"
                });
            }

            // Get user and taxpayer data with raw query
            const [existingUser] = await sequelizeConf.query(
                `SELECT 
                    u.id,
                    u.nim,
                    u.nama,
                    u.email,
                    u.role,
                    t.id AS taxpayer_id,
                    t.handphone AS taxpayer_handphone,
                    t.addresses AS taxpayer_addresses
                FROM users u
                LEFT JOIN taxpayer t ON u.nim = t.nik
                WHERE u.nim = :nikNpwp
                LIMIT 1`,
                {
                    replacements: { nikNpwp },
                    type: sequelizeConf.QueryTypes.SELECT,
                    transaction,
                }
            );

            console.log('users ', existingUser);

            if (!existingUser) {
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(404).json({
                    success: false,
                    message: "Data mahasiswa tidak ditemukan"
                });
            }

            // Check if user role is 'mhs' (mahasiswa) - role 1
            if (existingUser.role !== 1) {
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(403).json({
                    success: false,
                    message: "Hanya mahasiswa yang dapat mengajukan kode otorisasi DJP"
                });
            }

            // Check if user already has pending or approved request
            const [existingRequest] = await sequelizeConf.query(
                `SELECT id, status 
                FROM djp_authorization 
                WHERE user_id = :userId 
                AND status IN ('pending', 'approved')
                LIMIT 1`,
                {
                    replacements: { userId: existingUser.id },
                    type: sequelizeConf.QueryTypes.SELECT,
                    transaction
                }
            );

            if (existingRequest) {
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    success: false,
                    message: `Anda sudah memiliki permintaan kode otorisasi dengan status ${existingRequest.status}`
                });
            }

            // Generate authorization code
            const authorizationCode = generateAuthorizationCode();

            // Hash passphrase for security
            const hashedPassphrase = await bcrypt.hash(passphrase, 10);

            // Parse taxpayer addresses if exists
            let taxpayerAddresses = null;
            if (existingUser.taxpayer_addresses) {
                try {
                    taxpayerAddresses = JSON.parse(existingUser.taxpayer_addresses);
                } catch (e) {
                    console.log('Error parsing taxpayer addresses:', e);
                }
            }

            // Determine address and handphone
            const finalAddress = taxpayerAddresses && taxpayerAddresses[0] 
                ? taxpayerAddresses[0].address 
                : address;
            const finalHandphone = existingUser.taxpayer_handphone || handphone;

            console.log('taxpayer data:', {
                addresses: taxpayerAddresses,
                handphone: existingUser.taxpayer_handphone
            });

            // SIMULATION: Auto-approve for demo purposes
            // In production, this would be 'pending' and require admin approval
            const isSimulation = true;
            const finalStatus = isSimulation ? 'approved' : 'pending';
            const approvalDate = isSimulation ? moment().format('YYYY-MM-DD HH:mm:ss') : null;

            // Insert DJP authorization request with raw query
            const [insertResult] = await sequelizeConf.query(
                `INSERT INTO djp_authorization (
                    user_id,
                    taxpayer_id,
                    request_channel,
                    request_date,
                    nik_npwp,
                    taxpayer_name,
                    address,
                    email,
                    handphone,
                    certificate_type,
                    passphrase,
                    identity_photo,
                    statement_accepted,
                    authorization_code,
                    status,
                    approval_date,
                    created_date,
                    updated_date
                ) VALUES (
                    :userId,
                    :taxpayerId,
                    :requestChannel,
                    :requestDate,
                    :nikNpwp,
                    :taxpayerName,
                    :address,
                    :email,
                    :handphone,
                    :certificateType,
                    :passphrase,
                    :identityPhoto,
                    :statementAccepted,
                    :authorizationCode,
                    :status,
                    :approvalDate,
                    NOW(),
                    NOW()
                )`,
                {
                    replacements: {
                        userId: existingUser.id,
                        taxpayerId: existingUser.taxpayer_id,
                        requestChannel,
                        requestDate,
                        nikNpwp,
                        taxpayerName: existingUser.nama,
                        address: finalAddress,
                        email: existingUser.email,
                        handphone: finalHandphone,
                        certificateType,
                        passphrase: hashedPassphrase,
                        identityPhoto: req.file.filename,
                        statementAccepted: statement,
                        authorizationCode,
                        status: finalStatus,
                        approvalDate: approvalDate
                    },
                    type: sequelizeConf.QueryTypes.INSERT,
                    transaction
                }
            );

            await transaction.commit();

            // Different response messages based on simulation mode
            let responseMessage;
            if (isSimulation) {
                responseMessage = "✅ Simulasi: Permintaan kode otorisasi berhasil diajukan dan langsung disetujui untuk keperluan demo. Dalam kondisi normal, proses ini memerlukan verifikasi oleh tim DJP.";
            } else {
                responseMessage = "Permintaan kode otorisasi berhasil diajukan dan sedang menunggu verifikasi dari tim DJP.";
            }

            res.status(200).json({
                success: true,
                message: responseMessage,
                simulation_mode: isSimulation,
                data: {
                    id: insertResult,
                    authorization_code: authorizationCode,
                    taxpayer_name: existingUser.nama,
                    certificate_type: certificateType,
                    status: finalStatus,
                    approval_date: approvalDate,
                    note: isSimulation ? "Ini adalah mode simulasi - dalam produksi memerlukan verifikasi manual" : null
                }
            });

        } catch (error) {
            // Rollback transaction if it exists
            if (transaction) {
                await transaction.rollback();
            }

            console.error('DJP Authorization error:', error);

            // Clean up uploaded file on error
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            res.status(500).json({
                success: false,
                message: "Terjadi kesalahan pada server: " + error.message
            });
        }
    });
};

// Juga refactor getTaxpayerByNIK untuk konsistensi
exports.getTaxpayerByNIK = async (req, res) => {
    try {
        const { nik_npwp } = req.params;

        if (!nik_npwp || nik_npwp.length < 16) {
            return res.status(400).json({
                success: false,
                message: "NIK tidak valid"
            });
        }

        // Get user and taxpayer data with raw query
        const [userData] = await sequelizeConf.query(
            `SELECT 
                u.id,
                u.nim,
                u.nama,
                u.email,
                u.role,
                t.handphone AS taxpayer_handphone,
                t.addresses AS taxpayer_addresses
            FROM users u
            LEFT JOIN taxpayer t ON u.nim = t.nik
            WHERE u.nim = :nikNpwp
            LIMIT 1`,
            {
                replacements: { nikNpwp: nik_npwp },
                type: sequelizeConf.QueryTypes.SELECT
            }
        );

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "Data mahasiswa tidak ditemukan"
            });
        }

        // Check if user is mahasiswa (role 1)
        if (userData.role !== 1) {
            return res.status(403).json({
                success: false,
                message: "Hanya mahasiswa yang dapat mengajukan kode otorisasi DJP"
            });
        }

        // Parse taxpayer addresses if exists
        let taxpayerAddresses = null;
        if (userData.taxpayer_addresses) {
            try {
                taxpayerAddresses = JSON.parse(userData.taxpayer_addresses);
            } catch (e) {
                console.log('Error parsing taxpayer addresses:', e);
            }
        }

        const defaultAddress = taxpayerAddresses && taxpayerAddresses[0] 
            ? taxpayerAddresses[0].address 
            : '';

        res.status(200).json({
            success: true,
            data: {
                nik_npwp: nik_npwp,
                taxpayer_name: userData.nama,
                address: defaultAddress,
                email: userData.email,
                handphone: userData.taxpayer_handphone || ''
            }
        });

    } catch (error) {
        console.error('Get taxpayer error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server: " + error.message
        });
    }
};

// Get user's DJP authorization status
exports.getUserDJPStatus = async (req, res) => {
    try {
        const user_id = req.auth._id; // From auth middleware

        const [djpRequest] = await sequelizeConf.query(
            `SELECT * FROM djp_authorization 
             WHERE user_id = :userId 
             ORDER BY created_date DESC 
             LIMIT 1`,
            {
                replacements: { userId: user_id },
                type: sequelizeConf.QueryTypes.SELECT
            }
        );

        if (!djpRequest) {
            return res.status(404).json({
                success: false,
                message: "Belum ada permintaan kode otorisasi DJP"
            });
        }

        // Add simulation indicator
        
        res.status(200).json({
            success: true,
            simulation_mode: true,
            data: {
                ...djpRequest,
                note: djpRequest.status === 'approved' 
                    ? "Status disetujui secara otomatis untuk simulasi" 
                    : null
            }
        });

    } catch (error) {
        console.error('Get user DJP status error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server: " + error.message
        });
    }
};

// Download receipt PDF
exports.downloadReceipt = async (req, res) => {
    try {
        const { request_id } = req.params;

        // Get DJP request data with raw query
        const [djpRequest] = await sequelizeConf.query(
            `SELECT 
                djp.*,
                u.nama as user_name,
                u.email as user_email,
                t.full_name as taxpayer_full_name
            FROM djp_authorization djp
            LEFT JOIN users u ON djp.user_id = u.id
            LEFT JOIN taxpayer t ON djp.taxpayer_id = t.id
            WHERE djp.id = :requestId
            LIMIT 1`,
            {
                replacements: { requestId: request_id },
                type: sequelizeConf.QueryTypes.SELECT
            }
        );

        if (!djpRequest) {
            return res.status(404).json({
                success: false,
                message: "Data permintaan tidak ditemukan"
            });
        }

        if (djpRequest.status !== 'approved') {
            return res.status(400).json({
                success: false,
                message: "Bukti tanda terima hanya tersedia untuk permintaan yang sudah disetujui"
            });
        }

        // Generate PDF receipt
        const doc = new PDFDocument({ margin: 50 });
        const filename = `Bukti_Tanda_Terima_${djpRequest.authorization_code}.pdf`;

        // Set response headers
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        // Pipe the PDF directly to response
        doc.pipe(res);

        // PDF Content
        doc.fontSize(16).text('KEMENTERIAN KEUANGAN REPUBLIK INDONESIA', { align: 'center' });
        doc.fontSize(14).text('DIREKTORAT JENDERAL PAJAK', { align: 'center' });
        doc.moveDown();

        doc.fontSize(14).text('BUKTI TANDA TERIMA KODE OTORISASI DJP', { align: 'center', underline: true });
        doc.moveDown();

        doc.fontSize(12);
        doc.text(`Nomor: ${djpRequest.authorization_code}`);
        doc.text(`Tanggal: ${moment(djpRequest.approval_date).format('DD MMMM YYYY')}`);
        doc.moveDown();

        doc.text('Data Mahasiswa:');
        doc.text(`NIK: ${djpRequest.nik_npwp}`);
        doc.text(`Nama: ${djpRequest.taxpayer_name}`);
        doc.text(`Email: ${djpRequest.email}`);
        doc.text(`No. Handphone: ${djpRequest.handphone}`);
        doc.text(`Alamat: ${djpRequest.address || 'Tidak tersedia'}`);
        doc.moveDown();

        doc.text(`Jenis Sertifikat: ${djpRequest.certificate_type.toUpperCase()}`);
        doc.text(`Status: ${djpRequest.status.toUpperCase()}`);
        doc.moveDown();

        doc.text('Kode otorisasi ini telah dapat digunakan untuk keperluan perpajakan elektronik.');
        doc.text('Harap simpan bukti ini sebagai dokumentasi.');
        doc.moveDown();

        // Add simulation note if in simulation mode
        const isSimulation = process.env.NODE_ENV === 'development' || process.env.SIMULATION_MODE === 'true';
        if (isSimulation) {
            doc.text('* Catatan: Dokumen ini dibuat dalam mode simulasi untuk keperluan demo.', { 
                fontSize: 10, 
                color: 'gray' 
            });
            doc.moveDown();
        }

        doc.text(`Diterbitkan pada: ${moment().format('DD MMMM YYYY HH:mm:ss')}`);

        doc.end();

    } catch (error) {
        console.error('Download receipt error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengunduh bukti tanda terima: " + error.message
        });
    }
};

// Download certificate PDF
exports.downloadCertificate = async (req, res) => {
    try {
        const { request_id } = req.params;

        // Get DJP request data with raw query
        const [djpRequest] = await sequelizeConf.query(
            `SELECT 
                djp.*,
                u.nama as user_name,
                u.email as user_email,
                t.full_name as taxpayer_full_name
            FROM djp_authorization djp
            LEFT JOIN users u ON djp.user_id = u.id
            LEFT JOIN taxpayer t ON djp.taxpayer_id = t.id
            WHERE djp.id = :requestId
            LIMIT 1`,
            {
                replacements: { requestId: request_id },
                type: sequelizeConf.QueryTypes.SELECT
            }
        );

        if (!djpRequest) {
            return res.status(404).json({
                success: false,
                message: "Data permintaan tidak ditemukan"
            });
        }

        if (djpRequest.status !== 'approved') {
            return res.status(400).json({
                success: false,
                message: "Surat penerbitan sertifikat hanya tersedia untuk permintaan yang sudah disetujui"
            });
        }

        // Generate PDF certificate
        const doc = new PDFDocument({ margin: 50 });
        const filename = `Surat_Penerbitan_Sertifikat_${djpRequest.authorization_code}.pdf`;

        // Set response headers
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        // Pipe the PDF directly to response
        doc.pipe(res);

        // PDF Content
        doc.fontSize(16).text('KEMENTERIAN KEUANGAN REPUBLIK INDONESIA', { align: 'center' });
        doc.fontSize(14).text('DIREKTORAT JENDERAL PAJAK', { align: 'center' });
        doc.moveDown();

        doc.fontSize(14).text('SURAT PENERBITAN SERTIFIKAT ELEKTRONIK', { align: 'center', underline: true });
        doc.moveDown();

        doc.fontSize(12);
        doc.text(`Nomor: SPS-${djpRequest.authorization_code}/2025`);
        doc.text(`Tanggal: ${moment(djpRequest.approval_date).format('DD MMMM YYYY')}`);
        doc.moveDown();

        doc.text('Kepada Yth,');
        doc.text(`Nama: ${djpRequest.taxpayer_name}`);
        doc.text(`NIK: ${djpRequest.nik_npwp}`);
        doc.text(`Alamat: ${djpRequest.address || 'Tidak tersedia'}`);
        doc.moveDown();

        doc.text('Dengan hormat,');
        doc.moveDown();

        doc.text('Berdasarkan permohonan Saudara dan setelah dilakukan verifikasi data,');
        doc.text('dengan ini diberitahukan bahwa:');
        doc.moveDown();

        doc.text(`1. Kode Otorisasi DJP dengan nomor: ${djpRequest.authorization_code}`);
        doc.text('2. Telah berhasil diterbitkan dan dapat digunakan');
        doc.text('3. Untuk keperluan transaksi perpajakan elektronik');
        doc.moveDown();

        // Add simulation note if in simulation mode
        const isSimulation = process.env.NODE_ENV === 'development' || process.env.SIMULATION_MODE === 'true';
        if (isSimulation) {
            doc.text('Catatan Simulasi:', { fontSize: 10, color: 'gray' });
            doc.text('Dokumen ini dibuat dalam mode simulasi untuk keperluan demo.', { 
                fontSize: 10, 
                color: 'gray' 
            });
            doc.text('Dalam kondisi normal, sertifikat ini akan diverifikasi secara manual.', { 
                fontSize: 10, 
                color: 'gray' 
            });
            doc.moveDown();
        }

        doc.text('Demikian surat ini dibuat untuk dapat dipergunakan sebagaimana mestinya.');
        doc.moveDown();

        doc.text('Hormat kami,');
        doc.moveDown(3);

        doc.text('Direktorat Jenderal Pajak');
        doc.text('Republik Indonesia');

        doc.end();

    } catch (error) {
        console.error('Download certificate error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengunduh surat penerbitan sertifikat: " + error.message
        });
    }
};

// Also update getAllDJPRequests to use raw query
exports.getAllDJPRequests = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const offset = (page - 1) * limit;

        // Build WHERE conditions for raw query
        let whereConditions = [];
        let replacements = {
            limit: parseInt(limit),
            offset: parseInt(offset)
        };

        if (status) {
            whereConditions.push('djp.status = :status');
            replacements.status = status;
        }

        if (search) {
            whereConditions.push(`(
                djp.taxpayer_name LIKE :search OR 
                djp.nik_npwp LIKE :search OR 
                djp.authorization_code LIKE :search
            )`);
            replacements.search = `%${search}%`;
        }

        const whereClause = whereConditions.length > 0 
            ? 'WHERE ' + whereConditions.join(' AND ')
            : '';

        // Get total count
        const [countResult] = await sequelizeConf.query(
            `SELECT COUNT(*) as total 
            FROM djp_authorization djp
            LEFT JOIN users u ON djp.user_id = u.id
            LEFT JOIN taxpayer t ON djp.taxpayer_id = t.id
            ${whereClause}`,
            {
                replacements,
                type: sequelizeConf.QueryTypes.SELECT
            }
        );

        // Get paginated data
        const requests = await sequelizeConf.query(
            `SELECT 
                djp.*,
                u.nama as user_name,
                u.email as user_email,
                t.full_name as taxpayer_full_name
            FROM djp_authorization djp
            LEFT JOIN users u ON djp.user_id = u.id
            LEFT JOIN taxpayer t ON djp.taxpayer_id = t.id
            ${whereClause}
            ORDER BY djp.created_date DESC
            LIMIT :limit OFFSET :offset`,
            {
                replacements,
                type: sequelizeConf.QueryTypes.SELECT
            }
        );

        const total = countResult.total;

        res.status(200).json({
            success: true,
            data: {
                requests: requests,
                pagination: {
                    total: total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get all DJP requests error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server: " + error.message
        });
    }
};

// Update updateDJPStatus to use raw query too
exports.updateDJPStatus = async (req, res) => {
    try {
        const { request_id } = req.params;
        const { status, rejection_reason } = req.body;
        const processed_by = req.user.id; // From auth middleware

        // Check if request exists and is pending
        const [djpRequest] = await sequelizeConf.query(
            `SELECT id, status FROM djp_authorization WHERE id = :requestId LIMIT 1`,
            {
                replacements: { requestId: request_id },
                type: sequelizeConf.QueryTypes.SELECT
            }
        );

        if (!djpRequest) {
            return res.status(404).json({
                success: false,
                message: "Data permintaan tidak ditemukan"
            });
        }

        if (djpRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Hanya permintaan dengan status pending yang dapat diubah"
            });
        }

        // Build update query
        let updateFields = [
            'status = :status',
            'processed_by = :processedBy',
            'updated_date = NOW()'
        ];
        let replacements = {
            status: status,
            processedBy: processed_by,
            requestId: request_id
        };

        if (status === 'approved') {
            updateFields.push('approval_date = NOW()');
        } else if (status === 'rejected' && rejection_reason) {
            updateFields.push('rejection_reason = :rejectionReason');
            replacements.rejectionReason = rejection_reason;
        }

        // Update the request
        await sequelizeConf.query(
            `UPDATE djp_authorization 
            SET ${updateFields.join(', ')}
            WHERE id = :requestId`,
            {
                replacements,
                type: sequelizeConf.QueryTypes.UPDATE
            }
        );

        // Get updated data
        const [updatedRequest] = await sequelizeConf.query(
            `SELECT * FROM djp_authorization WHERE id = :requestId LIMIT 1`,
            {
                replacements: { requestId: request_id },
                type: sequelizeConf.QueryTypes.SELECT
            }
        );

        res.status(200).json({
            success: true,
            message: `Permintaan berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`,
            data: updatedRequest
        });

    } catch (error) {
        console.error('Update DJP status error:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server: " + error.message
        });
    }
};