const multer = require("multer");
const maxSize = 10 * 1024 * 1024;
const data_fileuploaded = require("../../../models/data_fileuploaded.model");

const storage = multer.diskStorage({
  //Specify the destination directory where the file needs to be saved
  destination: function (req, file, cb) {
    cb(null, "./assets/uploads/audio");
  },
  //Specify the name of the file. The date is prefixed to avoid overwriting of files.
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    if (extension === "mp4") {
      extension = "m4a";
    }
    if (extension === "x-m4a") {
      extension = "m4a";
    }
    if (extension === "mpeg") {
      extension = "mp3";
    }
    if (extension === "x-aac") {
      extension = "aac";
    }

    cb(
      null,
      file.fieldname + "_" + req.auth._id + Date.now() + "." + extension
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log(JSON.stringify(req.body));
    console.log(file.mimetype);
    if (
      file.mimetype == "audio/mpeg" ||
      file.mimetype == "audio/aac" ||
      file.mimetype == "audio/x-aac" ||
      file.mimetype == "audio/mp4" ||
      file.mimetype == "audio/x-m4a"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error("Hanya format file .mp3, .aac and .m4a yang dibolehkan!")
      );
    }
  },
  limits: { fileSize: maxSize },
});

exports.uploadaudiosingle = () => {
  return function (req, res, next) {
    upload.single("audio")(req, res, (err) => {
      // call as a normal function
      if (err) {
        const merr =
          err.message === "File too large"
            ? "Ukuran file terlalu besar melebihi batas normal."
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
        .create(
          {
            keperluan: "audio",
            size: file.size,
            file_url: file.path,
            uploaded_filename: splt[splt.length - 1],
            original_filename: file.originalname,
            mime_type: file.mimetype,
            status_delete: 0,
            created_by: req.auth._id,
          },
          { raw: true }
        )
        .then((data) => {
          req.uploaded = data;
          next();
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
