const multer = require("multer");
const maxSize = 10 * 1024 * 1024;
const data_fileuploaded = require("../../../models/data_fileuploaded.model");
const Joi = require("joi");
const xlsx = require('xlsx');
const users = require("../../../models/users.model");
const bcrypt = require("bcrypt");

const storage = multer.diskStorage({
  //Specify the destination directory where the file needs to be saved
  destination: function (req, file, cb) {
    cb(null, "./assets/uploads/img/blog");
  },
  //Specify the name of the file. The date is prefixed to avoid overwriting of files.
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];

    cb(null, req.auth._id + "_" + Date.now() + "." + extension);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error("Hanya format file .png, .jpg and .jpeg yang dibolehkan!")
      );
    }
  },
  limits: { fileSize: maxSize },
});

const memoryStorage = multer.memoryStorage();
const uploadExcel = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    if (["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Hanya format file .xlsx dan .xls yang dibolehkan!"));
    }
  },
  limits: { fileSize: maxSize },
});


exports.uploadsingle = () => {
  return function (req, res, next) {
    upload.single("photo")(req, res, (err) => {
      // call as a normal function
      if (err) {
        const merr =
          err.message === "File too large"
            ? "Ukuran file terlalu besar melebihi batas normal. (Max 10MB)"
            : err.message;
        return res.status(400).send({ success: false, message: merr });
      }
      const file = req.file;
      if (!file) {
        return res.status(400).send({
          success: false,
          message: "Tolong pilih file sebelum klik upload",
        });
      }
      const splt = file.path.split("/");
      data_fileuploaded
        .create({
          keperluan: "blog-image",
          size: file.size,
          file_url: file.path,
          uploaded_filename: splt[splt.length - 1],
          original_filename: file.originalname,
          mime_type: file.mimetype,
          status_delete: 0,
          created_by: req.auth._id,
        })
        .then(() => {
          res.status(200).send({
            success: true,
            file: file,
            message: "Berhasil mengunggah file.",
          });
        })
        .catch((error) =>
          res.status(400).json({
            success: false,
            message: error,
          })
        );
    });
  };
};


exports.uploadsingleFileExcel = () => {
  return async function (req, res, next) {
    uploadExcel.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: "Tolong pilih file sebelum klik upload" });
      }

      try {
        // Membaca file Excel dari buffer
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        if (!Array.isArray(data) || data.length === 0) {
          return res.status(400).json({ success: false, message: "File Excel kosong atau tidak valid" });
        }

        // Proses penyimpanan data ke database
        const userPromises = data.map(async (user) => {
          const existingUser = await users.findOne({ where: { nim: user.nim } });

          if (!existingUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password.toString(), salt);

            await users.create({
              nim: user.nim,
              nama: user.nama,
              email: user.email,
              kelas: user.kelas,
              password: hashedPassword,
              role: user.role,
              status_active: 1,
            });
          }
        });

        await Promise.all(userPromises); // Menjalankan semua operasi insert secara paralel

        return res.status(200).json({ success: true, message: "File berhasil dibaca dan diproses", data });

      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Terjadi kesalahan saat membaca atau memproses file",
          error: err.message,
        });
      }
    });
  };
};