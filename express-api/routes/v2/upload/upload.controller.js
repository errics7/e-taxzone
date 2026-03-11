//

const multer = require("multer");

//
0;
exports.suksesUploadAudio = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.uploaded,
    message: "Berhasil menyimpan audio.",
  });
};

exports.suksesUploadImage = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.uploaded,
    message: "Berhasil menyimpan gambar.",
  });
};
