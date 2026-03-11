const multer = require("multer");
const maxSize = 10 * 1024 * 1024;
const data_fileuploaded = require("../../../models/data_fileuploaded.model");

const storage = multer.diskStorage({
  //Specify the destination directory where the file needs to be saved
  destination: function (req, file, cb) {
    cb(null, "./assets/uploads/area");
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

exports.uploadsingle = () => {
  return function (req, res, next) {
    upload.single("photo")(req, res, (err) => {
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
        return res
          .status(400)
          .send({
            success: false,
            message: "Tolong pilih file sebelum klik upload",
          });
      }
      const splt = file.path.split("/");
      data_fileuploaded
        .create({
          keperluan: "area 360",
          size: file.size,
          file_url: file.path,
          uploaded_filename: splt[splt.length - 1],
          original_filename: file.originalname,
          mime_type: file.mimetype,
          status_delete: 0,
          created_by: req.auth._id,
        })
        .then(() => {
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
