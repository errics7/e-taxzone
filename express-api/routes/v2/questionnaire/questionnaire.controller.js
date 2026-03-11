const Joi = require('joi');
const sequelizeConf = require('../../../config/sequelizeconf');
const ExcelJS = require('exceljs');

// Validation schema for creating questionnaire
const createQuestionnaireSchema = Joi.object({
    student_id: Joi.number().required(),
    worksheet_id: Joi.number().required(),
    answers: Joi.array().items(
        Joi.object({
            question_id: Joi.number().required(),
            answer: Joi.any()
        })
    ).required()
});

// Validation schema for getting questionnaire
const getQuestionnaireSchema = Joi.object({
    student_id: Joi.number(),
    worksheet_id: Joi.number(),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    search: Joi.string()
});

// Validation schema for deleting questionnaire
const deleteQuestionnaireSchema = Joi.object({
    id: Joi.number().required()
});

// UEQ questions reference
const questions = [
    { id: 1, negative: 'menyusahkan', positive: 'menyenangkan' },
    { id: 2, negative: 'tak dapat dipahami', positive: 'dapat dipahami' },
    { id: 3, negative: 'monoton', positive: 'kreatif' },
    { id: 4, negative: 'mudah dipelajari', positive: 'sulit dipelajari' },
    { id: 5, negative: 'kurang bermanfaat', positive: 'bermanfaat' },
    { id: 6, negative: 'membosankan', positive: 'mengasyikkan' },
    { id: 7, negative: 'tidak menarik', positive: 'menarik' },
    { id: 8, negative: 'tak dapat diprediksi', positive: 'dapat diprediksi' },
    { id: 9, negative: 'cepat', positive: 'lambat' },
    { id: 10, negative: 'berdaya cipta', positive: 'konvensional' },
    { id: 11, negative: 'menghalangi', positive: 'mendukung' },
    { id: 12, negative: 'buruk', positive: 'baik' },
    { id: 13, negative: 'rumit', positive: 'sederhana' },
    { id: 14, negative: 'tidak disukai', positive: 'menggembirakan' },
    { id: 15, negative: 'lazim', positive: 'terdepan' },
    { id: 16, negative: 'tidak nyaman', positive: 'nyaman' },
    { id: 17, negative: 'tidak aman', positive: 'aman' },
    { id: 18, negative: 'memotivasi', positive: 'tidak memotivasi' },
    { id: 19, negative: 'memenuhi ekspektasi', positive: 'tidak memenuhi ekspektasi' },
    { id: 20, negative: 'tidak efisien', positive: 'efisien' },
    { id: 21, negative: 'jelas', positive: 'membingungkan' },
    { id: 22, negative: 'tidak praktis', positive: 'praktis' },
    { id: 23, negative: 'terorganisasi', positive: 'berantakan' },
    { id: 24, negative: 'atraktif', positive: 'tidak atraktif' },
    { id: 25, negative: 'ramah pengguna', positive: 'tidak ramah pengguna' },
    { id: 26, negative: 'konservatif', positive: 'inovatif' }
];


/**
 * Create a new questionnaire entry
 */
exports.createQuestionnaire = async (req, res) => {
    // Validate the request body
    const { error } = createQuestionnaireSchema.validate(req.body);
    if (error) return res.status(400).json({
        success: false,
        message: error.details[0].message
    });

    // Prepare data
    const studentId = req.body.student_id;
    const worksheetId = req.body.worksheet_id;
    const answers = req.body.answers || [];

    // Start transaction
    const t = await sequelizeConf.transaction();
    try {
        // Check if student exists
        const [studentExists] = await sequelizeConf.query(
            `SELECT 1 FROM users WHERE id = ? LIMIT 1`,
            {
                replacements: [studentId],
                type: sequelizeConf.QueryTypes.SELECT,
                transaction: t
            }
        );

        if (!studentExists) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: "Siswa tidak ditemukan"
            });
        }

        // Check if worksheet exists
        const [worksheetExists] = await sequelizeConf.query(
            `SELECT 1 FROM worksheet WHERE id = ? AND status = true LIMIT 1`,
            {
                replacements: [worksheetId],
                type: sequelizeConf.QueryTypes.SELECT,
                transaction: t
            }
        );

        if (!worksheetExists) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: "Worksheet tidak ditemukan atau tidak aktif"
            });
        }

        // Check if questionnaire already exists
        const [existingQuestionnaire] = await sequelizeConf.query(
            `SELECT 1 FROM student_questionnaire WHERE student_id = ? AND worksheet_id = ? LIMIT 1`,
            {
                replacements: [studentId, worksheetId],
                type: sequelizeConf.QueryTypes.SELECT,
                transaction: t
            }
        );

        if (existingQuestionnaire) {
            await t.rollback();
            return res.status(409).json({
                success: false,
                message: "Kuesioner sudah pernah diisi oleh siswa ini"
            });
        }

        // Format answers to JSON
        const answersJson = JSON.stringify(answers);

        // Get current timestamp (with UTC+7 adjustment for Indonesia)
        const now = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
        const formattedNow = now.getFullYear() +
            '-' + String(now.getMonth() + 1).padStart(2, '0') +
            '-' + String(now.getDate()).padStart(2, '0') +
            ' ' + String(now.getHours()).padStart(2, '0') +
            ':' + String(now.getMinutes()).padStart(2, '0') +
            ':' + String(now.getSeconds()).padStart(2, '0');

        // Insert questionnaire data
        await sequelizeConf.query(
            `INSERT INTO student_questionnaire 
            (student_id, worksheet_id, answer, created_date, updated_date) 
            VALUES (?, ?, ?, ?, ?)`,
            {
                replacements: [
                    studentId,
                    worksheetId,
                    answersJson,
                    formattedNow,
                    formattedNow
                ],
                type: sequelizeConf.QueryTypes.INSERT,
                transaction: t
            }
        );

        // Get the inserted ID
        const [lastInsertResult] = await sequelizeConf.query(
            "SELECT LAST_INSERT_ID() as id",
            {
                type: sequelizeConf.QueryTypes.SELECT,
                transaction: t
            }
        );

        await t.commit();

        return res.status(201).json({
            success: true,
            message: "Kuesioner berhasil disimpan",
            data: {
                id: lastInsertResult ? lastInsertResult.id : null,
                student_id: studentId,
                worksheet_id: worksheetId,
                submitted_at: now
            }
        });

    } catch (err) {
        await t.rollback();
        console.error('Error creating questionnaire:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Get questionnaires with pagination and filters
 */
exports.getQuestionnaires = async (req, res) => {
    // Validate query parameters
    const { error } = getQuestionnaireSchema.validate(req.query);
    if (error) return res.status(400).json({
        success: false,
        message: error.details[0].message
    });

    try {
        // Set default pagination values
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        // Build base query for counting total records
        let countQuery = `
            SELECT COUNT(*) as total
            FROM student_questionnaire sq
            LEFT JOIN users u ON sq.student_id = u.id
            LEFT JOIN worksheet w ON sq.worksheet_id = w.id
            WHERE 1=1
        `;

        // Build main query
        let query = `
            SELECT sq.id, sq.student_id, sq.worksheet_id, sq.answer, 
                   sq.created_date, sq.updated_date,
                   u.nama as student_name, u.kelas, u.nim, w.title as worksheet_title
            FROM student_questionnaire sq
            LEFT JOIN users u ON sq.student_id = u.id
            LEFT JOIN worksheet w ON sq.worksheet_id = w.id
            WHERE 1=1
        `;

        const replacements = [];
        const countReplacements = [];

        // Add student_id filter if provided
        if (req.query.student_id) {
            query += ` AND sq.student_id = ?`;
            countQuery += ` AND sq.student_id = ?`;
            replacements.push(req.query.student_id);
            countReplacements.push(req.query.student_id);
        }

        // Add worksheet_id filter if provided
        if (req.query.worksheet_id) {
            query += ` AND sq.worksheet_id = ?`;
            countQuery += ` AND sq.worksheet_id = ?`;
            replacements.push(req.query.worksheet_id);
            countReplacements.push(req.query.worksheet_id);
        }

        // Add search filter
        if (search) {
            query += ` AND (u.nama LIKE ? OR u.nim LIKE ? OR w.title LIKE ?)`;
            countQuery += ` AND (u.nama LIKE ? OR u.nim LIKE ? OR w.title LIKE ?)`;

            const searchParam = `%${search}%`;
            replacements.push(searchParam, searchParam, searchParam);
            countReplacements.push(searchParam, searchParam, searchParam);
        }

        // Add order by
        query += ` ORDER BY sq.created_date DESC`;

        // Add limit and offset for pagination
        query += ` LIMIT ? OFFSET ?`;
        replacements.push(limit, offset);

        // Get total count for pagination
        const [countResult] = await sequelizeConf.query(countQuery, {
            replacements: countReplacements,
            type: sequelizeConf.QueryTypes.SELECT
        });

        // Execute main query
        const questionnaires = await sequelizeConf.query(query, {
            replacements,
            type: sequelizeConf.QueryTypes.SELECT
        });

        // Format the answers for each questionnaire
        const formattedQuestionnaires = questionnaires.map(q => {
            // Parse the answer JSON string to object
            const answers = typeof q.answer === 'string' ? JSON.parse(q.answer) : q.answer;
            return {
                ...q,
                answers: answers
            };
        });

        return res.status(200).json({
            success: true,
            message: "Data kuesioner berhasil diambil",
            data: formattedQuestionnaires,
            pagination: {
                page,
                limit,
                total: countResult.total,
                totalPages: Math.ceil(countResult.total / limit)
            }
        });

    } catch (err) {
        console.error('Error getting questionnaires:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Get single questionnaire by ID with formatted view data
 */
exports.getQuestionnaireById = async (req, res) => {
    const id = req.params.id;

    try {
        // Get questionnaire by ID
        const [questionnaire] = await sequelizeConf.query(
            `SELECT sq.id, sq.student_id, sq.worksheet_id, sq.answer, 
                    sq.created_date, sq.updated_date,
                    u.nama as student_name, u.kelas, u.nim, w.title as worksheet_title
             FROM student_questionnaire sq
             LEFT JOIN users u ON sq.student_id = u.id
             LEFT JOIN worksheet w ON sq.worksheet_id = w.id
             WHERE sq.id = ?`,
            {
                replacements: [id],
                type: sequelizeConf.QueryTypes.SELECT
            }
        );

        if (!questionnaire) {
            return res.status(404).json({
                success: false,
                message: "Kuesioner tidak ditemukan"
            });
        }

        // Parse answers if it's a string
        const answers = typeof questionnaire.answer === 'string' ?
            JSON.parse(questionnaire.answer) : questionnaire.answer;

        // Format for display similar to the UI in the image
        const formattedQuestionnaire = {
            ...questionnaire,
            answers: answers,
            questions: questions.map(q => {
                const answer = answers.find(a => a.question_id === q.id);
                return {
                    ...q,
                    selectedValue: answer ? answer.answer : null
                };
            })
        };

        return res.status(200).json({
            success: true,
            message: "Data kuesioner berhasil diambil",
            data: formattedQuestionnaire
        });

    } catch (err) {
        console.error('Error getting questionnaire by ID:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Delete questionnaire by ID
 */
exports.deleteQuestionnaire = async (req, res) => {
    // Validate request parameters
    const { error } = deleteQuestionnaireSchema.validate(req.params);
    if (error) return res.status(400).json({
        success: false,
        message: error.details[0].message
    });

    const id = req.params.id;

    // Start transaction
    const t = await sequelizeConf.transaction();
    try {
        // Verify questionnaire exists
        const [questionnaire] = await sequelizeConf.query(
            `SELECT 1 FROM student_questionnaire WHERE id = ? LIMIT 1`,
            {
                replacements: [id],
                type: sequelizeConf.QueryTypes.SELECT,
                transaction: t
            }
        );

        if (!questionnaire) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: "Kuesioner tidak ditemukan"
            });
        }

        // Delete the questionnaire
        await sequelizeConf.query(
            `DELETE FROM student_questionnaire WHERE id = ?`,
            {
                replacements: [id],
                type: sequelizeConf.QueryTypes.DELETE,
                transaction: t
            }
        );

        await t.commit();

        return res.status(200).json({
            success: true,
            message: "Kuesioner berhasil dihapus"
        });

    } catch (err) {
        await t.rollback();
        console.error('Error deleting questionnaire:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Export questionnaires to Excel
 */
exports.exportQuestionnaires = async (req, res) => {
    try {
        // Apply filters from query parameters
        const search = req.query.search || '';
        const courseFilter = req.query.course !== 'Semua' ? req.query.course : '';

        // Build query with filters
        let query = `
            SELECT sq.id, sq.student_id, sq.worksheet_id, sq.answer, 
                   sq.created_date, sq.updated_date,
                   u.nama as student_name, u.kelas, u.nim, w.title as worksheet_title
            FROM student_questionnaire sq
            LEFT JOIN users u ON sq.student_id = u.id
            LEFT JOIN worksheet w ON sq.worksheet_id = w.id
            WHERE 1=1
        `;

        const replacements = [];

        // Add search filter
        if (search) {
            query += ` AND (u.nama LIKE ? OR u.nim LIKE ? OR w.title LIKE ?)`;
            const searchParam = `%${search}%`;
            replacements.push(searchParam, searchParam, searchParam);
        }

        // Add course filter
        if (courseFilter) {
            query += ` AND w.title = ?`;
            replacements.push(courseFilter);
        }

        // Add order by
        query += ` ORDER BY sq.created_date DESC`;

        // Execute query
        const questionnaires = await sequelizeConf.query(query, {
            replacements,
            type: sequelizeConf.QueryTypes.SELECT
        });

        // Create a new Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Questionnaire Results');

        // Add headers
        const columns = [
            { header: 'No.', key: 'no', width: 5 },
            { header: 'Nama Siswa', key: 'student_name', width: 20 },
            { header: 'NIM', key: 'nim', width: 15 },
            { header: 'Kelas', key: 'kelas', width: 10 },
            { header: 'Nama Kuis', key: 'worksheet_title', width: 20 },
            { header: 'Tanggal Pengisian', key: 'created_date', width: 20 }
        ];

        // Add question headers (Q1 - Q15)
        for (let i = 1; i <= 15; i++) {
            columns.push({
                header: `Q${i}`,
                key: `q${i}`,
                width: 5
            });
        }


        // Add formatting to header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.columns = columns

        // Add data rows
        questionnaires.forEach((item, index) => {
            const answers = typeof item.answer === 'string' ? JSON.parse(item.answer) : item.answer;

            const row = {
                no: index + 1,
                student_name: item.student_name,
                nim: item.nim,
                kelas: item.kelas,
                worksheet_title: item.worksheet_title,
                created_date: new Date(item.created_date).toLocaleDateString('id-ID')
            };

            // Add answers to each question
            for (let i = 1; i <= 15; i++) {
                const answer = answers.find(a => a.question_id === i);
                row[`q${i}`] = answer ? answer.answer : '';
            }

            worksheet.addRow(row);
        });

        // Set up the response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=questionnaire-results-${new Date().toISOString().split('T')[0]}.xlsx`);

        // Write to buffer and send response
        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error('Error exporting questionnaires:', err);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengekspor data kuesioner: ' + err.message
        });
    }
};