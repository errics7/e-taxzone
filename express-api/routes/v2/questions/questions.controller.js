const Joi = require("joi");
const question = require("../../../models/question.model");
const question_options = require("../../../models/question_options.model");
const question_drag_items = require("../../../models/question_drag_items.model");
const worksheet = require("../../../models/worksheet.model");
const worksheet_schedules = require("../../../models/worksheet_schedule.model");
const student_results = require("../../../models/student_result.model");
const sequelizeConf = require("../../../config/sequelizeconf");
const users = require("../../../models/users.model");
const ExcelJS = require('exceljs');

// Schema validation untuk question
const questionSchema = Joi.object({
    worksheet_id: Joi.number().required(),
    question_text: Joi.string().required(),
    question_type: Joi.string().valid("radio", "drag_drop", "fill_blank").required(),
    category: Joi.string().allow(null, ''),
    randomize: Joi.boolean().default(false),
    options: Joi.array().items(
        Joi.object({
            option_text: Joi.string().required(),
            is_correct: Joi.boolean().required(),
        })
    ).when('question_type', { is: 'radio', then: Joi.required() }),
    drag_items: Joi.array().items(
        Joi.object({
            text: Joi.string().required(),
            correct_position: Joi.number().required()
        })
    ).when('question_type', { is: 'drag_drop', then: Joi.required() }),
    correct_answer: Joi.string().when('question_type', { is: 'fill_blank', then: Joi.required() })
});

// Schema validation untuk question options (multiple choice)
const questionOptionsSchema = Joi.object({
    question_id: Joi.number().required(),
    options: Joi.array()
        .items(
            Joi.object({
                option_text: Joi.string().required(),
                is_correct: Joi.boolean().default(false),
            })
        )
        .min(1)
        .required(),
});

// Schema validation untuk drag items
const dragItemsSchema = Joi.object({
    question_id: Joi.number().required(),
    drag_items: Joi.array()
        .items(
            Joi.object({
                text: Joi.string().required(),
                correct_position: Joi.number().required(),
            })
        )
        .min(1)
        .required(),
});

// Schema validation untuk penjadwalan worksheet
const scheduleSchema = Joi.object({
    worksheet_id: Joi.number().required(),
    class_id: Joi.string().required(),
    start_time: Joi.date().iso().required(),
    end_time: Joi.date().iso().greater(Joi.ref('start_time')).required(),
    question_count: Joi.number().integer().min(1),
    randomize_questions: Joi.boolean().default(false),
    created_by: Joi.number().integer()
});

// Schema validation untuk submit jawaban
const submitAnswerSchema = Joi.object({
    student_id: Joi.number().required(),
    worksheet_id: Joi.number().required(),
    worksheet_schedule_id: Joi.number().required(),
    answers: Joi.array().items(
        Joi.object({
            question_id: Joi.number().required(),
            answer: Joi.alternatives().try(
                // String for text answers (fill_blank)
                Joi.string(),

                // Number for radio button selections
                Joi.number(),

                // Array of strings for drag and drop targets
                Joi.array().items(Joi.string().allow('')),

                // Array of objects for complex drag and drop structure
                Joi.array().items(
                    Joi.object({
                        item_id: Joi.alternatives().try(
                            Joi.string(),
                            Joi.number()
                        ).required(),
                        target: Joi.string().allow('').required()
                    })
                )
            ).required()
        })
    ).min(1).required()
});

// Create a new question
exports.createQuestion = async (req, res) => {
    const { error } = questionSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const t = await sequelizeConf.transaction();
    try {
        // Jika pertanyaan belum ada, buat baru
        const newQuestion = await question.create(
            {
                worksheet_id: req.body.worksheet_id,
                title: req.body.question_text,
                question_type: req.body.question_type, // Use the question_type directly from request
                category: req.body.category || null,
                randomize: req.body.randomize || false,
                correct_answer: req.body.question_type === "fill_blank" ? req.body.correct_answer : null
            },
            { transaction: t }
        );

        if (req.body.question_type === "radio" && req.body.options?.length) {
            await question_options.bulkCreate(
                req.body.options.map(opt => ({
                    question_id: newQuestion.id,
                    option_text: opt.option_text,
                    is_correct: opt.is_correct
                })),
                { transaction: t }
            );
        }

        if (req.body.question_type === "drag_drop" && req.body.drag_items?.length) {
            await question_drag_items.bulkCreate(
                req.body.drag_items.map(item => ({
                    question_id: newQuestion.id,
                    item_text: item.text,
                    correct_target: item.correct_position
                })),
                { transaction: t }
            );
        }

        // Update status worksheet to true after creating first question
        await worksheet.update(
            { status: true },
            { where: { id: req.body.worksheet_id }, transaction: t }
        );

        await t.commit();
        return res.status(201).json({ success: true, message: "Question created successfully", data: newQuestion });
        // }

    } catch (err) {
        await t.rollback();
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getQuestionsByWorksheet = async (req, res) => {
    const { worksheet_id } = req.params;

    try {
        const questions = await sequelizeConf.query(
            `
            SELECT q.*, 
                JSON_ARRAYAGG(
                    JSON_OBJECT('id', qo.id, 'option_text', qo.option_text, 'is_correct', qo.is_correct)
                ) AS options,
                JSON_ARRAYAGG(
                    JSON_OBJECT('id', qd.id, 'item_text', qd.item_text, 'correct_target', qd.correct_target)
                ) AS drag_items
            FROM question q
            LEFT JOIN question_options qo ON q.id = qo.question_id
            LEFT JOIN question_drag_items qd ON q.id = qd.question_id
            WHERE q.worksheet_id = ?
            GROUP BY q.id
            `,
            {
                replacements: [worksheet_id],
                type: sequelizeConf.QueryTypes.SELECT,
            }
        );

        if (!questions.length) {
            return res.status(404).json({ success: false, message: "Belum ada soal di worksheet ini" });
        }

        const parsedQuestions = questions.map(question => {
            const parsedQuestion = {...question};
            
            if (parsedQuestion.options) {
                try {
                    parsedQuestion.options = JSON.parse(parsedQuestion.options);
                    if (parsedQuestion.options.includes(null)) {
                        parsedQuestion.options = parsedQuestion.options.filter(option => option !== null);
                    }
                } catch (e) {
                    parsedQuestion.options = [];
                }
            } else {
                parsedQuestion.options = [];
            }
            
            if (parsedQuestion.drag_items) {
                try {
                    parsedQuestion.drag_items = JSON.parse(parsedQuestion.drag_items);
                    if (parsedQuestion.drag_items.includes(null)) {
                        parsedQuestion.drag_items = parsedQuestion.drag_items.filter(item => item !== null);
                    }
                } catch (e) {
                    parsedQuestion.drag_items = [];
                }
            } else {
                parsedQuestion.drag_items = [];
            }
            
            return parsedQuestion;
        });

        res.json({ success: true, data: parsedQuestions });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getMhsQuestionsByWorksheet = async (req, res) => {
    const { worksheet_id } = req.params;

    try {
        // Cek status worksheet
        const worksheetData = await worksheet.findOne({
            where: {
                id: worksheet_id,
                status: true
            }
        });

        if (!worksheetData) {
            return res.status(404).json({
                success: false,
                message: "Worksheet belum tersedia atau tidak aktif"
            });
        }

        const teacher = await users.findOne({
            where: { id: worksheetData.created_by },
            attributes: ['id', 'nama'] // pastikan 'nama' adalah field yang benar
        });

        // Cek jadwal worksheet
        const currentTime = new Date();
        const schedule = await worksheet_schedules.findOne({
            where: {
                worksheet_id: worksheet_id,
                // start_time: { [sequelizeConf.Op.lte]: currentTime },
                // end_time: { [sequelizeConf.Op.gte]: currentTime }
            }
        });

        if (!schedule) {
            return res.status(403).json({
                success: false,
                message: "Worksheet belum dapat diakses sesuai jadwal"
            });
        }

        // Get questions based on schedule settings
        let questions;

        if (schedule.randomize_questions) {
            // If randomize is enabled, get random questions
            questions = await sequelizeConf.query(
                `
                SELECT 
                    q.id, 
                    q.title, 
                    q.description, 
                    q.question_type, 
                    q.category, 
                    q.correct_answer,
                    JSON_ARRAYAGG(
                        JSON_OBJECT('id', qo.id, 'option_text', qo.option_text)
                    ) AS options,
                    JSON_ARRAYAGG(
                        JSON_OBJECT('id', qd.id, 'item_text', qd.item_text)
                    ) AS drag_items
                FROM question q
                LEFT JOIN question_options qo ON q.id = qo.question_id
                LEFT JOIN question_drag_items qd ON q.id = qd.question_id
                WHERE q.worksheet_id = ?
                GROUP BY q.id
                ORDER BY RAND()
                ${schedule.question_count ? 'LIMIT ' + schedule.question_count : ''}
                `,
                {
                    replacements: [worksheet_id],
                    type: sequelizeConf.QueryTypes.SELECT,
                }
            );
        } else {
            // If not randomizing, get questions in order
            questions = await sequelizeConf.query(
                `
                SELECT 
                    q.id, 
                    q.title, 
                    q.description, 
                    q.question_type, 
                    q.category, 
                    q.correct_answer,
                    JSON_ARRAYAGG(
                        JSON_OBJECT('id', qo.id, 'option_text', qo.option_text)
                    ) AS options,
                    JSON_ARRAYAGG(
                        JSON_OBJECT('id', qd.id, 'item_text', qd.item_text)
                    ) AS drag_items
                FROM question q
                LEFT JOIN question_options qo ON q.id = qo.question_id
                LEFT JOIN question_drag_items qd ON q.id = qd.question_id
                WHERE q.worksheet_id = ?
                GROUP BY q.id
                ${schedule.question_count ? 'LIMIT ' + schedule.question_count : ''}
                `,
                {
                    replacements: [worksheet_id],
                    type: sequelizeConf.QueryTypes.SELECT,
                }
            );
        }

        if (!questions.length) {
            return res.status(404).json({
                success: false,
                message: "Belum ada soal di worksheet ini"
            });
        }

        // Process questions to parse JSON strings and add answer_length for fill_blank questions
        const processedQuestions = questions.map(question => {
            // Parse JSON strings to actual objects
            let options = [];
            let dragItems = [];
            
            try {
                // Parse options if it's a string and not null
                if (question.options && typeof question.options === 'string') {
                    options = JSON.parse(question.options);
                } else if (Array.isArray(question.options)) {
                    options = question.options;
                }
                
                // Parse drag_items if it's a string and not null
                if (question.drag_items && typeof question.drag_items === 'string') {
                    dragItems = JSON.parse(question.drag_items);
                } else if (Array.isArray(question.drag_items)) {
                    dragItems = question.drag_items;
                }
                
                // Filter out null values that might come from LEFT JOINs
                options = options.filter(opt => opt && opt.id !== null);
                dragItems = dragItems.filter(item => item && item.id !== null);
            } catch (err) {
                console.error("Error parsing JSON:", err);
            }

            const processedQuestion = {
                id: question.id,
                title: question.title,
                description: question.description,
                question_type: question.question_type,
                category: question.category,
                options: options,
                drag_items: dragItems
            };

            // Add answer_length for fill_blank questions
            if (question.question_type === 'fill_blank' && question.correct_answer) {
                processedQuestion.answer_length = question.correct_answer.length;
            }

            return processedQuestion;
        });

        // Add schedule info to response
        const scheduleInfo = {
            id: schedule.id,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            remaining_time: Math.max(0, Math.floor((new Date(schedule.end_time) - currentTime) / 1000)), // in seconds
            mapel: worksheetData?.title,
            teacher_id: teacher?.id || null,
            teacher_name: teacher?.nama || null
        };

        res.json({
            success: true,
            data: {
                schedule: scheduleInfo,
                questions: processedQuestions
            }
        });

    } catch (err) {
        console.error("Error in getMhsQuestionsByWorksheet:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update question
exports.updateQuestion = async (req, res) => {
    const t = await sequelizeConf.transaction();
    try {
        // Update the main question record
        const questionToUpdate = await question.findByPk(req.params.id);

        if (!questionToUpdate) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }

        // Update main question record
        await questionToUpdate.update({
            title: req.body.question_text,
            question_type: req.body.question_type,
            category: req.body.category || null,
            correct_answer: req.body.question_type === "fill_blank" ? req.body.correct_answer : null
        }, { transaction: t });

        // Handle type-specific data
        if (req.body.question_type === "radio") {
            // Clear existing options
            await question_options.destroy({
                where: { question_id: req.params.id },
                transaction: t
            });

            // Add new options if provided
            if (req.body.options?.length) {
                await question_options.bulkCreate(
                    req.body.options.map(opt => ({
                        question_id: req.params.id,
                        option_text: opt.option_text,
                        is_correct: opt.is_correct
                    })),
                    { transaction: t }
                );
            }
        } else if (req.body.question_type === "drag_drop") {
            // Clear existing drag items
            await question_drag_items.destroy({
                where: { question_id: req.params.id },
                transaction: t
            });

            // Add new drag items if provided
            if (req.body.drag_items?.length) {
                await question_drag_items.bulkCreate(
                    req.body.drag_items.map(item => ({
                        question_id: req.params.id,
                        item_text: item.text,
                        correct_target: item.correct_position
                    })),
                    { transaction: t }
                );
            }
        }

        await t.commit();
        res.status(200).json({
            success: true,
            message: "Pertanyaan berhasil diperbarui",
            data: questionToUpdate
        });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
    try {
        await question.destroy({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Pertanyaan berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Add Options for Multiple Choice Question
exports.addQuestionOptions = async (req, res) => {
    const { error } = questionOptionsSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    try {
        const optionData = req.body.options.map(opt => ({
            question_id: req.body.question_id,
            option_text: opt.option_text,
            is_correct: opt.is_correct || false,
        }));

        await question_options.bulkCreate(optionData);
        res.status(201).json({ success: true, message: "Pilihan jawaban berhasil ditambahkan" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get Options for a Question
exports.getQuestionOptions = async (req, res) => {
    try {
        const options = await question_options.findAll({
            where: { question_id: req.params.question_id },
        });

        res.status(200).json({ success: true, data: options });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Add Drag Items for Drag-and-Drop Question
exports.addDragItems = async (req, res) => {
    const { error } = dragItemsSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    try {
        const dragItemData = req.body.drag_items.map(item => ({
            question_id: req.body.question_id,
            item_text: item.text,
            correct_target: item.correct_position,
        }));

        await question_drag_items.bulkCreate(dragItemData);
        res.status(201).json({ success: true, message: "Drag items berhasil ditambahkan" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get Drag Items for a Question
exports.getDragItems = async (req, res) => {
    try {
        const dragItems = await question_drag_items.findAll({
            where: { question_id: req.params.question_id },
        });

        res.status(200).json({ success: true, data: dragItems });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// WORKSHEET SCHEDULING CONTROLLER

// Create new worksheet schedule
exports.createWorksheetSchedule = async (req, res) => {
    const { error } = scheduleSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    const worksheetId = parseInt(req.body.worksheet_id);

    try {
        const worksheetExists = await worksheet.findOne({ where: { id: worksheetId } });

        if (!worksheetExists) {
            return res.status(404).json({
                success: false,
                message: "Worksheet tidak ditemukan"
            });
        }

        const schedulePayload = {
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            question_count: req.body.question_count,
            randomize_questions: req.body.randomize_questions,
            updated_by: req.body.created_by,
            class_id: req.body.class_id,
            updated_date: new Date()
        };

        // Cek apakah schedule sudah ada
        const existingSchedule = await worksheet_schedules.findOne({
            where: {
                worksheet_id: worksheetId
            }
        });

        let resultSchedule;

        if (existingSchedule) {
            await existingSchedule.update(schedulePayload);
            resultSchedule = existingSchedule;
        } else {
            resultSchedule = await worksheet_schedules.create({
                worksheet_id: worksheetId,
                ...schedulePayload,
                created_by: req.body.created_by,
                created_date: new Date()
            });
        }

        // Update status worksheet jadi aktif
        await worksheet.update({ status: 1 }, { where: { id: worksheetId } });

        return res.status(existingSchedule ? 200 : 201).json({
            success: true,
            message: existingSchedule
                ? "Jadwal worksheet berhasil diperbarui"
                : "Jadwal worksheet berhasil dibuat",
            data: resultSchedule
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};


// Get worksheet schedules by worksheet id
exports.getWorksheetSchedules = async (req, res) => {
    const { worksheet_id } = req.params;

    try {
        const schedules = await worksheet_schedules.findAll({
            where: { worksheet_id: worksheet_id }
        });

        return res.status(200).json({
            success: true,
            data: schedules[0]
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Get worksheet schedules by class id
exports.getClassSchedules = async (req, res) => {
    const { class_id } = req.params;

    try {
        const schedules = await worksheet_schedules.findAll({
            where: { class_id: class_id },
            include: [
                {
                    model: worksheet,
                    attributes: ['title', 'description', 'status']
                }
            ]
        });

        return res.status(200).json({
            success: true,
            data: schedules
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Delete worksheet schedule
exports.deleteWorksheetSchedule = async (req, res) => {
    const { id } = req.params;

    try {
        await worksheet_schedules.destroy({ where: { id: id } });
        return res.status(200).json({
            success: true,
            message: "Jadwal worksheet berhasil dihapus"
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};


// Submit student answers
exports.submitAnswers = async (req, res) => {
    const { error } = submitAnswerSchema.validate(req.body);
    if (error) return res.status(400).json({
        success: false,
        message: error.details[0].message
    });

    // Prepare all data before starting transaction
    const studentId = req.body.student_id;
    const worksheetId = req.body.worksheet_id;
    const worksheetScheduleId = req.body.worksheet_schedule_id;
    const answers = req.body.answers || [];
    const questionIds = answers.map(answer => answer.question_id);

    // Prepare answers map for quick access
    const answersMap = {};
    answers.forEach(answer => {
        answersMap[answer.question_id] = answer.answer;
    });

    // Start transaction
    const t = await sequelizeConf.transaction();
    try {
        // Fast check if worksheet exists with raw query
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

        // Fast check if student has already submitted answers
        const [existingSubmission] = await sequelizeConf.query(
            `SELECT 1 FROM student_results WHERE student_id = ? AND worksheet_id = ? AND worksheet_schedule_id = ? LIMIT 1`,
            {
                replacements: [studentId, worksheetId, worksheetScheduleId],
                type: sequelizeConf.QueryTypes.SELECT,
                transaction: t
            }
        );

        if (existingSubmission) {
            await t.rollback();
            return res.status(409).json({
                success: false,
                message: "Anda sudah mengumpulkan jawaban sebelumnya"
            });
        }

        // Optimized: Get all questions in one query with raw SQL for speed
        const questions = await sequelizeConf.query(
            `SELECT id, question_type, title, description, correct_answer, points 
             FROM question 
             WHERE id IN (?)`,
            {
                replacements: [questionIds],
                type: sequelizeConf.QueryTypes.SELECT,
                transaction: t
            }
        );

        // Create question map for fast lookup
        const questionsMap = {};
        questions.forEach(q => {
            questionsMap[q.id] = q;
        });

        // Optimized: Get all question options in one query
        const options = await sequelizeConf.query(
            `SELECT id, question_id, option_text, is_correct 
             FROM question_options 
             WHERE question_id IN (?)`,
            {
                replacements: [questionIds],
                type: sequelizeConf.QueryTypes.SELECT,
                transaction: t
            }
        );

        // Create options map for fast lookup
        const optionsMap = {};
        options.forEach(opt => {
            if (!optionsMap[opt.question_id]) optionsMap[opt.question_id] = [];
            optionsMap[opt.question_id].push(opt);
        });

        // Optimized: Get all drag items in one query - FIXED: Use question_id instead of id for the WHERE clause
        const dragItems = await sequelizeConf.query(
            `SELECT id, question_id, item_text, correct_target 
             FROM question_drag_items 
             WHERE question_id IN (?)`,
            {
                replacements: [questionIds],
                type: sequelizeConf.QueryTypes.SELECT,
                transaction: t
            }
        );

        // Create drag items map for fast lookup
        const dragItemsMap = {};
        dragItems.forEach(item => {
            if (!dragItemsMap[item.question_id]) dragItemsMap[item.question_id] = [];
            dragItemsMap[item.question_id].push(item);
        });

        // Helper function for case-insensitive and whitespace-tolerant comparison
        const normalizeAnswer = (answer) => {
            if (typeof answer !== 'string') return '';
            return answer.trim().toLowerCase();
        };

        // Process all answers at once
        let totalScore = 0;
        let correctCount = 0;
        let wrongCount = 0;
        let detailedAnswers = [];

        // Calculate points for each question
        for (const questionId of questionIds) {
            const question = questionsMap[questionId];
            if (!question) continue;

            const userAnswer = answersMap[questionId];
            let isCorrect = false;
            let correctAnswer = null;
            let pointsEarned = 0;

            const questionPoints = question.points || 1; // Default to 1 if no points specified

            // Check answer based on question type
            if (question.question_type === "fill_blank") {
                correctAnswer = question.correct_answer;
                
                // Case-insensitive and whitespace-tolerant comparison for fill_blank
                const normalizedUserAnswer = normalizeAnswer(userAnswer);
                const normalizedCorrectAnswer = normalizeAnswer(correctAnswer);
                
                isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
                pointsEarned = isCorrect ? questionPoints : 0;
            }
            else if (question.question_type === "radio") {
                const questionOptions = optionsMap[questionId] || [];
                const correctOption = questionOptions.find(opt => opt.is_correct);

                if (correctOption) {
                    correctAnswer = correctOption.id.toString();
                    isCorrect = userAnswer === correctAnswer;
                    pointsEarned = isCorrect ? questionPoints : 0;
                }
            }
            else if (question.question_type === "drag_drop") {
                const questionDragItems = dragItemsMap[questionId] || [];

                // Prepare correct answer format for reference
                correctAnswer = questionDragItems.map(item => ({
                    item_id: item.id.toString(), // Ensure string comparison
                    target: item.correct_target
                }));

                // Check drag-drop placements
                let correctPlacements = 0;
                if (Array.isArray(userAnswer)) {
                    // Create map of item_id to correct_target for quick lookup
                    const targetsMap = {};
                    questionDragItems.forEach(item => {
                        targetsMap[item.id.toString()] = item.correct_target;
                    });

                    // Normalize user answers for comparison
                    const normalizedUserAnswers = userAnswer.map(placement => ({
                        item_id: placement.item_id.toString(),
                        target: placement.target
                    }));

                    // Check each user placement against correct targets
                    normalizedUserAnswers.forEach(placement => {
                        if (targetsMap[placement.item_id] === placement.target) {
                            correctPlacements++;
                        }
                    });

                    // Partial credit for drag-drop questions
                    if (questionDragItems.length > 0) {
                        const ratio = correctPlacements / questionDragItems.length;
                        pointsEarned = ratio * questionPoints;
                        isCorrect = correctPlacements === questionDragItems.length;
                    }
                }
            }

            // Update counters
            totalScore += pointsEarned;
            if (isCorrect) {
                correctCount++;
            } else {
                wrongCount++;
            }

            // Add detailed answer data
            detailedAnswers.push({
                question_id: questionId,
                question_text: question.title,
                question_type: question.question_type,
                user_answer: userAnswer,
                correct_answer: correctAnswer,
                is_correct: isCorrect,
                points_earned: pointsEarned,
                max_points: questionPoints,
                options: optionsMap[questionId] || [],
                drag_items: dragItemsMap[questionId] || []
            });
        }

        // Calculate final score
        const totalQuestions = questions.length;
        const totalPossiblePoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);
        const finalScore = totalPossiblePoints > 0 ? (totalScore / totalPossiblePoints) * 100 : 0;

        // Optimized: Insert result directly with raw SQL for max performance
        const now = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);

        const formattedNow = now.getFullYear() +
            '-' + String(now.getMonth() + 1).padStart(2, '0') +
            '-' + String(now.getDate()).padStart(2, '0') +
            ' ' + String(now.getHours()).padStart(2, '0') +
            ':' + String(now.getMinutes()).padStart(2, '0') +
            ':' + String(now.getSeconds()).padStart(2, '0');

        // Prepare detailed answers JSON for storage
        const detailedAnswersJson = JSON.stringify(detailedAnswers);

        // Insert using raw SQL for maximum performance
        await sequelizeConf.query(
            `INSERT INTO student_results 
            (student_id, worksheet_id, worksheet_schedule_id, score, correct_count, wrong_count, answers, submitted_at, created_date, updated_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            {
                replacements: [
                    studentId,
                    worksheetId,
                    worksheetScheduleId,
                    finalScore,
                    correctCount,
                    wrongCount,
                    detailedAnswersJson,
                    formattedNow,
                    formattedNow,
                    formattedNow
                ],
                type: sequelizeConf.QueryTypes.INSERT,
                transaction: t
            }
        );

        // Get the inserted ID using a separate query for MySQL compatibility
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
            message: "Jawaban berhasil dikumpulkan",
            data: {
                id: lastInsertResult ? lastInsertResult.id : null,
                // score: finalScore,
                correct_count: correctCount,
                wrong_count: wrongCount,
                submitted_at: now
            }
        });

    } catch (err) {
        await t.rollback();
        console.error('Error submitting answers:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getStudentResult = async (req, res) => {
    try {
        const { student_id, worksheet_id } = req.query;

        if (!student_id || !worksheet_id) {
            return res.status(400).json({
                success: false,
                message: "Mohon berikan student_id, worksheet_id, dan worksheet_schedule_id"
            });
        }

        // Fetch the student result with detailed answers
        const result = await student_results.findOne({
            where: {
                student_id: student_id,
                worksheet_id: worksheet_id,
                // worksheet_schedule_id: worksheet_schedule_id
            }
        });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Hasil pengerjaan worksheet tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                id: result.id,
                student_id: result.student_id,
                worksheet_id: result.worksheet_id,
                worksheet_schedule_id: result.worksheet_schedule_id,
                score: result.score,
                correct_count: result.correct_count,
                wrong_count: result.wrong_count,
                answers: JSON.parse(result.answers), // This contains all the detailed answers with correct/wrong info
                submitted_at: result.submitted_at
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Get all results for a specific student
exports.getStudentResults = async (req, res) => {
    try {
        const { student_id } = req.params;

        if (!student_id) {
            return res.status(400).json({
                success: false,
                message: "Mohon berikan student_id"
            });
        }

        // Fetch all student results
        const results = await student_results.findAll({
            where: {
                student_id: student_id
            },
            attributes: ['id', 'worksheet_id', 'worksheet_schedule_id', 'score', 'correct_count', 'wrong_count', 'submitted_at'],
            order: [['submitted_at', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            data: results
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
exports.getWorksheetResults = async (req, res) => {
    try {
        const userId = req.auth._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        // Get user role to determine if teacher or student
        const user = await sequelizeConf.query(`
            SELECT role FROM users WHERE id = :userId
        `, {
            replacements: { userId },
            type: sequelizeConf.QueryTypes.SELECT,
            plain: true
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let results = [];
        if (user.role === 2) {
            // For teachers: show results of students from worksheets created by this teacher
            const queryResult = await sequelizeConf.query(`
                SELECT 
                    sr.id, 
                    sr.student_id, 
                    sr.score, 
                    sr.submitted_at,
                    u.nama AS student_name, 
                    u.nim AS student_nim, 
                    u.kelas AS student_class,
                    w.title AS worksheet_title,
                    ws.id AS worksheet_schedule_id,
                    w.id AS worksheet_id
                FROM 
                    student_results sr
                JOIN 
                    users u ON sr.student_id = u.id
                JOIN 
                    worksheet w ON sr.worksheet_id = w.id
                JOIN
                    worksheet_schedules ws ON sr.worksheet_schedule_id = ws.id
                WHERE 
                    w.created_by = :userId
                ORDER BY 
                    sr.submitted_at DESC, sr.score DESC
            `, {
                replacements: { userId },
                type: sequelizeConf.QueryTypes.SELECT
            });

            // Make sure we always have an array
            results = Array.isArray(queryResult) ? queryResult : [queryResult];
        } else {
            // For students: show only their own results
            const queryResult = await sequelizeConf.query(`
                SELECT 
                    sr.id, 
                    sr.student_id, 
                    sr.score, 
                    sr.submitted_at,
                    u.nama AS student_name, 
                    u.nim AS student_nim, 
                    u.kelas AS student_class,
                    w.title AS worksheet_title,
                    ws.id AS worksheet_schedule_id,
                    w.id AS worksheet_id
                FROM 
                    student_results sr
                JOIN 
                    users u ON sr.student_id = u.id
                JOIN 
                    worksheet w ON sr.worksheet_id = w.id
                JOIN
                    worksheet_schedules ws ON sr.worksheet_schedule_id = ws.id
                WHERE 
                    sr.student_id = :userId
                ORDER BY 
                    sr.submitted_at DESC, sr.score DESC
            `, {
                replacements: { userId },
                type: sequelizeConf.QueryTypes.SELECT
            });

            // Make sure we always have an array
            results = Array.isArray(queryResult) ? queryResult : [queryResult];
        }

        // Format the results to match the expected structure in the frontend
        const formattedResults = results.map(result => {
            // Check if result exists and is an object
            if (result && typeof result === 'object') {
                return {
                    id: result.id,
                    student_id: result.student_id,
                    score: result.score,
                    submitted_at: result.submitted_at,
                    student: {
                        name: result.student_name,
                        nim: result.student_nim,
                        class: result.student_class
                    },
                    worksheet_title: result.worksheet_title,
                    worksheet_id: result.worksheet_id,
                    worksheet_schedule_id: result.worksheet_schedule_id
                };
            }
            return null;
        }).filter(Boolean); // Remove any null values

        // Calculate statistics
        let statistics = {
            count: 0,
            average: 0,
            highest: 0,
            lowest: 0
        };

        if (formattedResults.length > 0) {
            const scores = formattedResults.map(result => result.score);
            statistics = {
                count: formattedResults.length,
                average: scores.reduce((a, b) => a + b, 0) / scores.length,
                highest: Math.max(...scores),
                lowest: Math.min(...scores)
            };
        }

        return res.status(200).json({
            success: true,
            data: {
                results: formattedResults, // This will always be an array
                statistics: statistics
            }
        });
    } catch (err) {
        console.error('Error fetching worksheet results:', err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.exportWorksheetResults = async (req, res) => {
    try {
        const userId = req.auth._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        // Get user role
        const user = await sequelizeConf.query(`
            SELECT role FROM users WHERE id = :userId
        `, {
            replacements: { userId },
            type: sequelizeConf.QueryTypes.SELECT,
            plain: true
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let results = [];
        if (user.role === 2) {
            // For teachers: export results of students from worksheets created by this teacher
            const queryResult = await sequelizeConf.query(`
                SELECT 
                    sr.id, 
                    sr.student_id, 
                    sr.score, 
                    sr.submitted_at,
                    u.nama AS student_name, 
                    u.nim AS student_nim, 
                    u.kelas AS student_class,
                    w.title AS worksheet_title
                FROM 
                    student_results sr
                JOIN 
                    users u ON sr.student_id = u.id
                JOIN 
                    worksheet w ON sr.worksheet_id = w.id
                JOIN
                    worksheet_schedules ws ON sr.worksheet_schedule_id = ws.id
                WHERE 
                    w.created_by = :userId
                ORDER BY 
                    w.title, u.kelas, sr.score DESC
            `, {
                replacements: { userId },
                type: sequelizeConf.QueryTypes.SELECT
            });

            // Make sure we always have an array
            results = Array.isArray(queryResult) ? queryResult : [queryResult];
        } else {
            // For students: export only their own results
            const queryResult = await sequelizeConf.query(`
                SELECT 
                    sr.id, 
                    sr.student_id, 
                    sr.score, 
                    sr.submitted_at,
                    u.nama AS student_name, 
                    u.nim AS student_nim, 
                    u.kelas AS student_class,
                    w.title AS worksheet_title
                FROM 
                    student_results sr
                JOIN 
                    users u ON sr.student_id = u.id
                JOIN 
                    worksheet w ON sr.worksheet_id = w.id
                JOIN
                    worksheet_schedules ws ON sr.worksheet_schedule_id = ws.id
                WHERE 
                    sr.student_id = :userId
                ORDER BY 
                    w.title, sr.submitted_at DESC
            `, {
                replacements: { userId },
                type: sequelizeConf.QueryTypes.SELECT
            });

            // Make sure we always have an array
            results = Array.isArray(queryResult) ? queryResult : [queryResult];
        }

        // Filter out any non-object results
        results = results.filter(result => result && typeof result === 'object');

        // Create workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Daftar Nilai Ujian');

        // Add headers
        worksheet.columns = [
            { header: 'No', key: 'no', width: 5 },
            { header: 'Nama', key: 'name', width: 30 },
            { header: 'NIM', key: 'nim', width: 15 },
            { header: 'Kelas', key: 'class', width: 10 },
            { header: 'Kuis', key: 'quiz', width: 20 },
            { header: 'Nilai', key: 'score', width: 10 },
            { header: 'Waktu Pengumpulan', key: 'submitted_at', width: 20 }
        ];

        // Style the header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // Add data rows
        results.forEach((result, index) => {
            worksheet.addRow({
                no: index + 1,
                name: result.student_name || 'Unknown',
                nim: result.student_nim || 'Unknown',
                class: result.student_class || 'Unknown',
                quiz: result.worksheet_title || 'Unknown',
                score: result.score,
                submitted_at: result.submitted_at ? new Date(result.submitted_at).toLocaleString() : '-'
            });
        });

        // Add statistics at the bottom
        if (results.length > 0) {
            const scores = results.map(result => result.score);
            const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            const highestScore = Math.max(...scores);
            const lowestScore = Math.min(...scores);

            // Add empty row
            worksheet.addRow({});

            // Add statistics
            worksheet.addRow({ name: 'Jumlah Peserta', score: results.length });
            worksheet.addRow({ name: 'Nilai Rata-rata', score: avgScore.toFixed(2) });
            worksheet.addRow({ name: 'Nilai Tertinggi', score: highestScore });
            worksheet.addRow({ name: 'Nilai Terendah', score: lowestScore });
        }

        // Determine filename based on user role
        let filename = user.role === 2 ?
            'daftar-nilai-semua-siswa.xlsx' :
            'daftar-nilai-saya.xlsx';

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        // Send the workbook to the client
        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error('Export error:', err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};