const { Op } = require("sequelize");
const users = require("../../../models/users.model");
const taxpayer = require('../../../models/taxpayer.model');
const companies = require("../../../models/companies.model");
const users_role = require("../../../models/user_role.model");
const akses_token = require("../../../models/akses_token.model");
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const ip = require("ip");
const Joi = require("joi");
const xlsx = require('xlsx');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwtconf = require("../../../config/secret");
moment.locale("id");
moment.tz.setDefault("Asia/Jakarta");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../../assets/uploads/img');

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);

    // Different naming based on field name
    let prefix = 'file';
    if (file.fieldname === 'profile_image') {
      prefix = 'profile';
    } else if (file.fieldname === 'establishmentDocument') {
      prefix = 'establishment';
    } else if (file.fieldname === 'authorizationLetter') {
      prefix = 'authorization';
    }

    cb(null, prefix + '-' + uniqueSuffix + extension);
  }
});

// File filter to accept only images and documents
const fileFilter = (req, file, cb) => {
  // For profile image - only images
  if (file.fieldname === 'profile_image') {
    const allowedImageTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedImageTypes.test(file.mimetype);
    const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb(new Error('Hanya file gambar yang diperbolehkan untuk foto profil (jpeg, jpg, png, gif)'));
  }

  // For company documents - images and PDFs
  if (file.fieldname === 'establishmentDocument' || file.fieldname === 'authorizationLetter') {
    const allowedDocTypes = /jpeg|jpg|png|gif|pdf/;
    const mimetype = allowedDocTypes.test(file.mimetype) || file.mimetype === 'application/pdf';
    const extname = allowedDocTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb(new Error('Hanya file gambar dan PDF yang diperbolehkan untuk dokumen perusahaan'));
  }

  // Unknown field
  cb(new Error('Field tidak dikenal: ' + file.fieldname));
};

// Initialize multer upload with multiple fields
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB max file size (increased for documents)
  fileFilter: fileFilter
}).fields([
  { name: 'profile_image', maxCount: 1 },           // For individual registration
  { name: 'establishmentDocument', maxCount: 1 },   // For company registration
  { name: 'authorizationLetter', maxCount: 1 }      // For company registration
]);

exports.signup = async (req, res) => {
  // Handle file upload first using multer middleware
  upload(req, res, async (uploadError) => {
    if (uploadError) {
      return res.status(400).json({
        success: false,
        message: "Error uploading file: " + uploadError.message
      });
    }

    const transaction = await users.sequelize.transaction();

    try {
      // Parse JSON data if sent as FormData strings - ENHANCED FOR COMPANY FIELDS
      let requestData = { ...req.body };

      // Convert string JSON to objects for FormData submissions
      const jsonFields = [
        'taxpayerIdentity', 'contactDetails', 'relatedPersons', 'economicData', 'addresses',
        // Company specific fields
        'kuasaWajibPajak', 'companyIdentity', 'orangPribadi', 'wajibPajakTerkait', 'companyEconomicData'
      ];

      jsonFields.forEach(field => {
        if (typeof requestData[field] === 'string') {
          try {
            requestData[field] = JSON.parse(requestData[field]);
          } catch (e) {
            console.log(`Failed to parse ${field}:`, e.message);
            // Keep as is if not valid JSON
          }
        }
      });

      // Convert string booleans for FormData - UNCHANGED FROM ORIGINAL
      if (typeof requestData.hasNIK === 'string') {
        requestData.hasNIK = requestData.hasNIK === 'true';
      }

      const { taxpayerType } = requestData;

      // ROUTE TO APPROPRIATE HANDLER BASED ON TAXPAYER TYPE
      if (taxpayerType === 'company') {
        // NEW COMPANY REGISTRATION FLOW
        return await handleCompanyRegistration(req, res, requestData, transaction);
      } else {
        // EXISTING INDIVIDUAL REGISTRATION FLOW - 100% UNCHANGED
        return await handleIndividualRegistration(req, res, requestData, transaction);
      }

    } catch (error) {
      // Rollback transaction on error - UNCHANGED FROM ORIGINAL
      await transaction.rollback();
      console.error('Registration error:', error);

      // Delete uploaded files if error occurs
      if (req.files) {
        const fs = require('fs');
        Object.values(req.files).flat().forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }

      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server, silakan coba lagi nanti"
      });
    }
  });
};

// INDIVIDUAL REGISTRATION - Updated to handle new file structure
async function handleIndividualRegistration(req, res, requestData, transaction) {
  // Validation schema for complete registration data - UNCHANGED FROM ORIGINAL
  const schema = Joi.object({
    // Step 1-3: Registration preparation
    taxpayerType: Joi.string().valid('individual', 'company').required(),
    hasNIK: Joi.boolean().required(),
    registrationType: Joi.string().valid('nik-activation', 'registration-only').required(),

    // Step 4: Taxpayer Identity
    taxpayerIdentity: Joi.object({
      nik: Joi.string().min(16).max(16).required(),
      fullName: Joi.string().min(3).max(200).required(),
      placeOfBirth: Joi.string().min(2).max(100).required(),
      dateOfBirth: Joi.date().required(),
      taxpayerType: Joi.string().required(),
      countryOfOrigin: Joi.string().required(),
      religion: Joi.string().required(),
      gender: Joi.string().valid('Male', 'Female').required(),
      maritalStatus: Joi.string().required(),
      typeOfWork: Joi.string().required(),
      motherName: Joi.string().min(2).max(100).required(),
      familyCardNumber: Joi.string().required(),
      familyRelationshipStatus: Joi.string().required()
    }).required(),

    // Step 5: Contact Details
    contactDetails: Joi.object({
      email: Joi.string().email().required(),
      handphone: Joi.string().min(8).max(15).required(),
      telephone: Joi.string().min(8).max(15).allow(''),
      fax: Joi.string().min(8).max(15).allow('')
    }).required(),

    // Step 6: Related Persons (optional for registration-only)
    relatedPersons: Joi.array().items(
      Joi.object({
        id: Joi.number().optional(), // Allow id field for frontend tracking
        type: Joi.string().required(),
        nikTin: Joi.string().required(),
        name: Joi.string().required()
      })
    ).default([]),

    // Step 7: Economic Data
    economicData: Joi.array().items(
      Joi.object({
        id: Joi.number().optional(), // Allow id field for frontend tracking
        source: Joi.string().required(),
        kluCode: Joi.string().required(),
        kluName: Joi.string().required(),
        workplace: Joi.string().required(),
        incomePerMonth: Joi.string().required()
      })
    ).min(1).required().messages({
      'array.min': 'At least one economic data entry is required'
    }),

    // Step 8: Address
    addresses: Joi.array().items(
      Joi.object({
        type: Joi.string().required(),
        address: Joi.string().required(),
        rt: Joi.string().required(),
        rw: Joi.string().required(),
        province: Joi.string().required(),
        city: Joi.string().required(),
        district: Joi.string().required(),
        village: Joi.string().required(),
        postalCode: Joi.string().required(),
        coordinates: Joi.string().allow('')
      })
    ).min(1).required().messages({
      'array.min': 'At least one address is required'
    })
  });

  // Validate request data - UNCHANGED FROM ORIGINAL
  const { error } = schema.validate(requestData);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Terjadi kesalahan input: " + error.details[0].message
    });
  }

  const { taxpayerType, hasNIK, registrationType, taxpayerIdentity, contactDetails, relatedPersons, economicData, addresses } = requestData;

  // Additional business logic validations - Updated for new file structure
  if (registrationType === 'nik-activation' && (!req.files || !req.files.profile_image)) {
    return res.status(400).json({
      success: false,
      message: "Photo upload is required for NIK activation registration"
    });
  }

  if (economicData.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one economic data entry is required"
    });
  }

  if (addresses.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one address is required"
    });
  }

  // Check if user already exists by NIK or email - UNCHANGED FROM ORIGINAL
  const existingUser = await users.findOne({
    where: {
      [Op.or]: [
        { nim: taxpayerIdentity.nik },
        { email: contactDetails.email }
      ]
    },
    raw: true
  });

  if (existingUser) {
    return res.status(200).json({
      success: false,
      message: "NIK atau Email telah digunakan pada pengguna sebelumnya"
    });
  }

  // Check if taxpayer with same NIK already exists - UNCHANGED FROM ORIGINAL
  const existingTaxpayer = await taxpayer.findOne({
    where: { nik: taxpayerIdentity.nik },
    raw: true
  });

  if (existingTaxpayer) {
    return res.status(200).json({
      success: false,
      message: "NIK sudah terdaftar sebagai taxpayer"
    });
  }

  // Generate password from date of birth (DDMMYYYY format) - UNCHANGED FROM ORIGINAL
  const birthDate = moment(taxpayerIdentity.dateOfBirth);
  const generatedPassword = birthDate.format('DDMMYYYY');

  // Hash the generated password - UNCHANGED FROM ORIGINAL
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(generatedPassword, salt);

  // Determine user class based on taxpayer type and registration type - UNCHANGED FROM ORIGINAL
  let userClass = '';
  if (taxpayerType === 'individual') {
    userClass = registrationType === 'nik-activation' ? 'Individual-NIK' : 'Individual-Reg';
  } else {
    userClass = registrationType === 'nik-activation' ? 'Company-NIK' : 'Company-Reg';
  }

  // Create new user - UNCHANGED FROM ORIGINAL
  const newUser = await users.create({
    nim: taxpayerIdentity.nik, // Use NIK as nim
    nama: taxpayerIdentity.fullName,
    email: contactDetails.email,
    kelas: userClass,
    role: 1, // Default role as mahasiswa (taxpayer)
    password: hashedPassword,
    status_active: 0, // Pending activation
    status_delete: 0,
    created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
  }, { transaction });

  // Handle profile image path - Updated for new file structure
  let profileImagePath = null;
  if (req.files && req.files.profile_image && req.files.profile_image[0]) {
    profileImagePath = req.files.profile_image[0].filename; // Store just the filename
  }

  // Create taxpayer record with complete data - UNCHANGED FROM ORIGINAL
  const newTaxpayer = await taxpayer.create({
    user_id: newUser.id,

    // Registration info
    taxpayer_type: taxpayerType,
    has_nik: hasNIK,
    registration_type: registrationType,

    // Identity data
    nik: taxpayerIdentity.nik,
    full_name: taxpayerIdentity.fullName,
    place_of_birth: taxpayerIdentity.placeOfBirth,
    date_of_birth: taxpayerIdentity.dateOfBirth,
    taxpayer_category: taxpayerIdentity.taxpayerType,
    country_of_origin: taxpayerIdentity.countryOfOrigin,
    religion: taxpayerIdentity.religion,
    gender: taxpayerIdentity.gender,
    marital_status: taxpayerIdentity.maritalStatus,
    type_of_work: taxpayerIdentity.typeOfWork,
    mother_name: taxpayerIdentity.motherName,
    family_card_number: taxpayerIdentity.familyCardNumber,
    family_relationship_status: taxpayerIdentity.familyRelationshipStatus,

    // Contact data
    email: contactDetails.email,
    handphone: contactDetails.handphone,
    telephone: contactDetails.telephone || '',
    fax: contactDetails.fax || '',

    // Profile image
    profile_image: profileImagePath,

    // JSON data
    economic_data: economicData,
    addresses: addresses,
    related_persons: relatedPersons,

    // Status
    registration_status: 'pending',
    created_by: newUser.id,
    created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
  }, { transaction });

  // Commit transaction - UNCHANGED FROM ORIGINAL
  await transaction.commit();

  // Response - UNCHANGED FROM ORIGINAL (dengan tambahan user_type saja)
  res.status(200).json({
    success: true,
    message: `${taxpayerIdentity.fullName} berhasil terdaftar. Password Anda adalah tanggal lahir (${generatedPassword}). Akun menunggu aktivasi admin.`,
    data: {
      nim: taxpayerIdentity.nik,
      name: taxpayerIdentity.fullName,
      email: contactDetails.email,
      taxpayer_id: newTaxpayer.id,
      registration_type: registrationType,
      profile_image: profileImagePath,
      user_type: 'individual'
      // generatedPassword: generatedPassword // Remove in production
    }
  });
}

// NEW COMPANY REGISTRATION HANDLER
async function handleCompanyRegistration(req, res, requestData, transaction) {
  // Company validation schema
  const schema = Joi.object({
    taxpayerType: Joi.string().valid('company').required(),
    companyTypeSelection: Joi.string().required(),

    kuasaWajibPajak: Joi.object({
      apakahPermohonanDiajukanOleh: Joi.string().valid('Ya', 'Tidak').required(),
      nikPerwakilan: Joi.string().when('apakahPermohonanDiajukanOleh', {
        is: 'Ya',
        then: Joi.string().min(16).max(16).required(),
        otherwise: Joi.string().allow('')
      }),
      namaWakilKuasa: Joi.string().when('apakahPermohonanDiajukanOleh', {
        is: 'Ya',
        then: Joi.string().required(),
        otherwise: Joi.string().allow('')
      })
    }).required(),

    companyIdentity: Joi.object({
      nomorKeputusanPengesahan: Joi.string().required(),
      namaWajibPajak: Joi.string().required(),
      tanggalKeputusanPengesahan: Joi.date().required(),
      nomorAktaPendirian: Joi.string().required(),
      tempatPendirian: Joi.string().required(),
      tanggalPendirian: Joi.date().required(),
      notarySigningOfficeNik: Joi.string().required(),
      nameOfNotarySigningOfficer: Joi.string().required(),
      jenisPerusahaanModal: Joi.string().required(),
      modalDasar: Joi.string().required()
    }).required(),

    contactDetails: Joi.object({
      email: Joi.string().email().required(),
      handphone: Joi.string().min(8).max(15).required(),
      telephone: Joi.string().min(8).max(15).allow(''),
      fax: Joi.string().min(8).max(15).allow('')
    }).required(),

    orangPribadi: Joi.array().items(
      Joi.object({
        id: Joi.number().optional(),
        apakahPIC: Joi.boolean(),
        jenisOrangTerkait: Joi.string().required(),
        personNikTin: Joi.string().required(),
        personName: Joi.string().required(),
        kewarganegaraan: Joi.string().required(),
        negaraAsal: Joi.string().required(),
        email: Joi.string().email().required(),
        mobilePhoneNumber: Joi.string().required(),
        tanggalMulai: Joi.date().required(),
        tanggalBerakhir: Joi.date().required()
      })
    ).default([]),

    wajibPajakTerkait: Joi.array().items(
      Joi.object({
        id: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
        jenisWajibPajak: Joi.string().required(),
        nikTin: Joi.string().required(),
        namaWajibPajak: Joi.string().required(),
        hubunganIstimewa: Joi.string().valid('Ya', 'Tidak').required(),
        persentaseKepemilikan: Joi.string().required(),
        isDefault: Joi.boolean().optional()
      })
    ).default([]),

    companyEconomicData: Joi.object({
      metodePembukuan: Joi.string().required(),
      mataUangPembukuan: Joi.string().required(),
      periodePembukuan: Joi.string().required(),
      kluUtama: Joi.array().items(
        Joi.object({
          id: Joi.number().optional(),
          kluCode: Joi.string().required(),
          kluName: Joi.string().required(),
          uraian: Joi.string().required()
        })
      ).min(1).required(),
      kluTambahan: Joi.array().items(
        Joi.object({
          id: Joi.number().optional(),
          kluCode: Joi.string().required(),
          kluName: Joi.string().required(),
          uraian: Joi.string().required()
        })
      ).default([]),
      merekDagang: Joi.string().allow(''),
      memilikiKaryawan: Joi.string().valid('Ya', 'Tidak').allow(''),
      omsetPerTahun: Joi.string().allow('')
    }).required(),

    addresses: Joi.array().items(
      Joi.object({
        type: Joi.string().required(),
        address: Joi.string().required(),
        rt: Joi.string().required(),
        rw: Joi.string().required(),
        province: Joi.string().required(),
        city: Joi.string().required(),
        district: Joi.string().required(),
        village: Joi.string().required(),
        postalCode: Joi.string().required(),
        coordinates: Joi.string().allow('')
      })
    ).min(1).required()
  });

  // Validate request data
  const { error } = schema.validate(requestData);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Terjadi kesalahan input: " + error.details[0].message
    });
  }

  const {
    companyTypeSelection, kuasaWajibPajak, companyIdentity, contactDetails,
    orangPribadi, wajibPajakTerkait, companyEconomicData, addresses
  } = requestData;

  // Check existing company by email or company name
  const existingCompany = await companies.findOne({
    where: {
      [Op.or]: [
        { email: contactDetails.email },
        { company_name: companyIdentity.namaWajibPajak }
      ]
    },
    raw: true
  });

  if (existingCompany) {
    return res.status(200).json({
      success: false,
      message: "Email atau nama perusahaan sudah terdaftar"
    });
  }

  // Generate password for PIC (use company establishment date)
  const establishmentDate = moment(companyIdentity.tanggalPendirian);
  const generatedPassword = establishmentDate.format('DDMMYYYY');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(generatedPassword, salt);

  // Create PIC user
  const picUser = await users.create({
    nim: companyIdentity.notarySigningOfficeNik,
    nama: companyIdentity.nameOfNotarySigningOfficer,
    email: contactDetails.email,
    kelas: 'Company-PIC',
    role: 1,
    password: hashedPassword,
    status_active: 0,
    status_delete: 0,
    created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
  }, { transaction });

  // Handle uploaded documents
  let establishmentDocPath = null;
  let authorizationLetterPath = null;

  if (req.files) {
    if (req.files.establishmentDocument && req.files.establishmentDocument[0]) {
      establishmentDocPath = req.files.establishmentDocument[0].filename;
    }
    if (req.files.authorizationLetter && req.files.authorizationLetter[0]) {
      authorizationLetterPath = req.files.authorizationLetter[0].filename;
    }
  }

  // Create company record
  const newCompany = await companies.create({
    pic_user_id: picUser.id,
    company_name: companyIdentity.namaWajibPajak,
    company_type: companyTypeSelection,

    // Company Identity
    company_decision_number: companyIdentity.nomorKeputusanPengesahan,
    decision_approval_date: companyIdentity.tanggalKeputusanPengesahan,
    establishment_deed_number: companyIdentity.nomorAktaPendirian,
    establishment_place: companyIdentity.tempatPendirian,
    establishment_date: companyIdentity.tanggalPendirian,
    notary_nik: companyIdentity.notarySigningOfficeNik,
    notary_name: companyIdentity.nameOfNotarySigningOfficer,
    company_capital_type: companyIdentity.jenisPerusahaanModal,
    basic_capital: companyIdentity.modalDasar,

    // Contact
    email: contactDetails.email,
    phone: contactDetails.handphone,
    fax: contactDetails.fax || '',

    // JSON Data
    address_data: addresses,
    economic_data: companyEconomicData,
    related_persons: orangPribadi,
    related_taxpayers: wajibPajakTerkait,

    // Documents
    establishment_document: establishmentDocPath,
    authorization_letter: authorizationLetterPath,

    // Metadata
    registration_status: 'pending',
    created_by: picUser.id,
    created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
  }, { transaction });

  // Create PIC taxpayer record
  const picTaxpayer = await taxpayer.create({
    user_id: picUser.id,
    taxpayer_type: 'company',
    has_nik: true,
    registration_type: 'company-registration',
    nik: companyIdentity.notarySigningOfficeNik,
    full_name: companyIdentity.nameOfNotarySigningOfficer,
    email: contactDetails.email,
    handphone: contactDetails.handphone,
    telephone: contactDetails.telephone || '',
    fax: contactDetails.fax || '',
    economic_data: companyEconomicData,
    addresses: addresses,
    registration_status: 'pending',
    created_by: picUser.id,
    created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
  }, { transaction });

  await transaction.commit();

  res.status(200).json({
    success: true,
    message: `Perusahaan ${companyIdentity.namaWajibPajak} berhasil terdaftar. PIC: ${companyIdentity.nameOfNotarySigningOfficer}. Password: ${generatedPassword}. Akun menunggu aktivasi admin.`,
    data: {
      company_id: newCompany.id,
      company_name: companyIdentity.namaWajibPajak,
      pic_nim: companyIdentity.notarySigningOfficeNik,
      pic_name: companyIdentity.nameOfNotarySigningOfficer,
      pic_email: contactDetails.email,
      pic_user_id: picUser.id,
      taxpayer_id: picTaxpayer.id,
      user_type: 'company',
      establishment_document: establishmentDocPath,
      authorization_letter: authorizationLetterPath
    }
  });
}
exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().min(3).max(200).required(),
    password: Joi.string().min(3).max(200).required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: "Terjadi Kesalahan input",
    });
  console.log("findd");
  //#region find user
  users_role.hasOne(users, { foreignKey: "role" });
  users.belongsTo(users_role, {
    foreignKey: "role",
    targetKey: "role_id",
  });
  await users
    .findOne({
      where: {
        [Op.or]: [{ nim: req.body.email }, { email: req.body.email }],
      },
      include: users_role,
    })
    .then(async (data) => {
      if (data) {
        //VALID Password
        const cekpwd = await bcrypt.compare(req.body.password, data.password);
        if (!cekpwd) {
          return res.status(200).json({
            success: false,
            message: "Password yang anda masukkan salah",
          });
        }
        //Lulus
        if (data.status_active === 1) {
          //approve
          const token = jwt.sign(
            {
              _id: data.id,
              nim: data.nim,
              email: data.email,
              kelas: data.kelas,
              nama: data.nama,
              img_url: data.img_url,
              authorize: data.role_permission.role_name,
            },
            jwtconf.secret,
            {
              expiresIn: "5h",
            }
          );
          const lasttime = moment().format("YYYY-MM-DD HH:mm:ss");
          await users
            .update({ lastlogin: lasttime }, { where: { id: data.id } })
            .catch((error) => {
              return res.status(400).json({
                success: false,
                message: error,
              });
            });

          return res.status(200).json({
            success: true,
            payload: token,
            authorize: data.role_permission.role_name,
            message: `Halo ${data.nama}, Selamat Datang`,
          });
        } else if (data.status_active === 0) {
          //need active
          return res.status(200).json({
            success: false,
            message: "Akun anda belum aktif, silahkan hubungi admin",
          });
        } else {
          //decline
          return res.status(200).json({
            success: false,
            message: "Akun anda ditolak silahkan hubungi admin",
          });
        }
      } else {
        return res.status(200).json({
          success: false,
          message: "Email atau Nim yang anda masukkan salah",
        });
      }
    })
    .catch((error) => {
      console.log("catch");
      console.log(error);

      return res.status(400).json({
        success: false,
        message: "Terjadi kesalahan silakan ulangi beberapa saat lagi",
      });
    });
  //#endregion
};


exports.signupUsingUploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "File tidak ditemukan" });
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const schema = Joi.array().items(
      Joi.object({
        nim: Joi.string().min(3).max(20).required(),
        nama: Joi.string().min(3).max(200).required(),
        kelas: Joi.string().min(1).max(35).required(),
        password: Joi.string().min(1).max(250).required(),
      })
    );

    const { error } = schema.validate(data);
    if (error) {
      return res.status(400).json({ success: false, message: "Format data tidak valid", details: error.details });
    }

    for (let user of data) {
      const existingUser = await users.findOne({ where: { nim: user.nim } });
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        await users.create({
          nim: user.nim,
          nama: user.nama,
          kelas: user.kelas,
          password: hashedPassword,
          status_active: 1,
        });
      }
    }

    res.status(200).json({ success: true, message: "Import pengguna berhasil" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Terjadi kesalahan", error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user._id; // ID pengguna dari token JWT

    users_role.hasOne(users, { foreignKey: "role" });
    users.belongsTo(users_role, {
      foreignKey: "role",
      targetKey: "role_id",
    });

    const userData = await users.findOne({
      where: { id: userId },
      include: users_role,
      attributes: { exclude: ['password'] } // Exclude password from results
    });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan"
      });
    }

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data pengguna"
    });
  }
};

// Update profile photo
exports.updateProfilePhoto = (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // Multer error
      return res.status(400).json({
        success: false,
        message: `Error multer: ${err.message}`
      });
    } else if (err) {
      // Unknown error
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    try {
      const userId = req.auth._id; // ID pengguna dari token JWT

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Tidak ada file yang diunggah"
        });
      }

      // Get user data
      const userData = await users.findByPk(userId);
      if (!userData) {
        return res.status(404).json({
          success: false,
          message: "Pengguna tidak ditemukan"
        });
      }

      // If user has existing profile photo (not default), delete it
      const defaultImg = 'https://res.cloudinary.com/miewtech/image/upload/v1623974364/defuser_ivetsc.png';
      if (userData.img_url !== defaultImg && userData.img_url.includes('/uploads/img/')) {
        const oldImagePath = path.join(__dirname, '..', userData.img_url.replace(/^\//, ''));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Set new image URL (relative path)
      const relativeImagePath = `/assets/uploads/img/${req.file.filename}`;

      // Update user profile with new image
      await users.update(
        {
          img_url: relativeImagePath,
          updated_date: moment().format('YYYY-MM-DD HH:mm:ss'),
          updated_by: userId
        },
        { where: { id: userId } }
      );

      res.status(200).json({
        success: true,
        message: "Foto profil berhasil diperbarui",
        img_url: relativeImagePath
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat memperbarui foto profil"
      });
    }
  });
};

