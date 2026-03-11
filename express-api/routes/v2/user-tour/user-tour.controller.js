const user_tour = require("../../../models/user_tour.model");

exports.markCompletedUserTour = async (req, res) => {
    try {
        const { tour_key } = req.body;

        if (!tour_key) {
            return res.status(400).json({ error: 'tour key required.' });
        }

        const [results, created] = await user_tour.findOrCreate({
            where: { user_id: req.auth._id, tour_key },
            defaults: { completed: true },
        });

        if (!created) {
            // update kalau sudah ada
            await results.update({ completed: true });
        }

        return res.status(200).json({
            success: true,
            message: "User tour marked as completed",
            data: results,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error.',
            details: error.message,
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const { tour_key } = req.params;

        if (!tour_key) {
            return res.status(400).json({ error: 'tour key required.' });
        }

        const tour = await user_tour.findOne({
            where: { user_id: req.auth._id, tour_key },
        });

        if (!tour) {
            return res.status(404).json({ error: 'Tour not found for this user.' });
        }

        res.status(200).json({ success: true, message: "Tour marked as completed." });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch.', details: error.message });
    }
};
