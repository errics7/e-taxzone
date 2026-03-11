
const scenario = require("../../../models/scenario.model");
const worksheet = require("../../../models/worksheet.model");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../../assets/uploads/file');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter to accept only certain file types
const fileFilter = (req, file, cb) => {
    // Accept common document types
    const allowedFileTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedFileTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Tipe file tidak didukung. Hanya PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, dan TXT yang diperbolehkan.'), false);
    }
};

// Initialize multer upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    }
}).single('file'); // 'file' is the field name in form data

exports.createWorksheet = async (req, res) => {
    // Handle file upload
    upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            return res.status(400).json({ success: false, message: `Error upload file: ${err.message}` });
        } else if (err) {
            // An unknown error occurred
            return res.status(400).json({ success: false, message: err.message });
        }
        
        try {
            const { code, worksheets } = req.body;

            // Parse worksheets from JSON string if it was sent as form data
            const worksheetsData = Array.isArray(worksheets) ? worksheets : JSON.parse(worksheets);

            if (!code || !Array.isArray(worksheetsData) || worksheetsData.length === 0) {
                return res.status(400).json({ success: false, message: "Kode dan daftar worksheet wajib diisi" });
            }

            const scenarioData = await scenario.findOne({ where: { code } });

            if (!scenarioData) {
                return res.status(404).json({ success: false, message: "Scenario tidak ditemukan" });
            }

            // Get file path if a file was uploaded
            let file_url = null;
            if (req.file) {
                // Create relative path from the absolute path
                const relativePath = path.relative(
                    path.join(__dirname, '../../../'), 
                    req.file.path
                );
                file_url = relativePath.replace(/\\/g, '/'); // Ensure forward slashes for URL
            }

            const newWorksheets = await Promise.all(
                worksheetsData.map(async ({ title, description, order }) => {
                    if (!title) return null; // Skip if title is empty
                    
                    return await worksheet.create({
                        scenario_id: scenarioData.id,
                        title,
                        description,
                        file_url, // Use the uploaded file URL for all worksheets
                        order,
                        created_by: req.auth._id,
                        status_delete: 0,
                        ...(file_url && { status: 1 }) 
                    });
                })
            );

            const createdWorksheets = newWorksheets.filter(Boolean);

            res.status(201).json({
                success: true,
                data: createdWorksheets,
                message: `${createdWorksheets.length} worksheet berhasil dibuat`
            });
        } catch (error) {
            // Handle JSON parsing errors or other exceptions
            res.status(500).json({ success: false, message: error.message });
        }
    });
};

// Get All Worksheets
exports.getWorksheets = async (req, res) => {
    try {
        const { code } = req.query; // Ambil parameter 'code' dari query string
        const whereCondition = { status_delete: 0 };
        if (!code) {
            return res.status(400).json({ success: false, message: "Kode wajib diisi" });
        }

        const scenarioData = await scenario.findOne({ where: { code } });

        if (!scenarioData) {
            return res.status(404).json({ success: false, message: "Scenario tidak ditemukan" });
        }

        if (code) {
            whereCondition.scenario_id = scenarioData.id;
        }

        const worksheets = await worksheet.findAll({ where: whereCondition });

        res.status(200).json({ success: true, data: worksheets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Worksheet by ID
exports.getWorksheetById = async (req, res) => {
    try {
        const worksheetData = await worksheet.findByPk(req.params.id);
        if (!worksheetData) {
            return res.status(404).json({ success: false, message: "Worksheet tidak ditemukan" });
        }
        res.status(200).json({ success: true, data: worksheetData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Worksheet
exports.updateWorksheet = async (req, res) => {
    try {
        const { title, description, order } = req.body;
        const worksheetData = await worksheet.findByPk(req.params.id);

        if (!worksheetData) {
            return res.status(404).json({ success: false, message: "Worksheet tidak ditemukan" });
        }

        await worksheetData.update({ title, description, order, updated_by: req.auth._id });
        res.status(200).json({ success: true, data: worksheetData, message: "Worksheet berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Soft Delete Worksheet
exports.deleteWorksheet = async (req, res) => {
    try {
        const worksheetData = await worksheet.findByPk(req.params.id);
        if (!worksheetData) {
            return res.status(404).json({ success: false, message: "Worksheet tidak ditemukan" });
        }

        await worksheetData.update({ status_delete: 1 });
        res.status(200).json({ success: true, message: "Worksheet berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
