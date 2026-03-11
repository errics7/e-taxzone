const sequelizeConf = require("../../../config/sequelizeconf");
const feedback = require("../../../models/feedback.model");
const users = require("../../../models/users.model");

exports.createFeedback = async (req, res) => {
  try {
    const {  kritik, saran } = req.body;

    if (!kritik && !saran) {
      return res.status(400).json({ error: 'user_id and at least one of kritik or saran are required.' });
    }

    const results = await feedback.create({ user_id: req.auth._id, kritik, saran });

    res.status(201).json({
      message: 'Feedback created successfully.',
      data: results,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const [results] = await sequelizeConf.query(`
      SELECT 
        f.id AS feedback_id,
        f.kritik,
        f.saran,
        f.createdAt,
        f.updatedAt,
        u.id,
        u.nama,
        u.nim
      FROM feedbacks f
      JOIN users u ON f.user_id = u.id
      ORDER BY f.createdAt DESC
    `);

    res.status(200).json({ data: results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedbacks.', details: error.message });
  }
};