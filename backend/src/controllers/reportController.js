// backend/src/controllers/reportController.js
const Report = require('../models/Report');

exports.createReport = async (req, res) => {
  try {
    const { targetType, targetId, reason } = req.body;

    if (!['post', 'comment', 'user'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type.' });
    }
    if (!reason) {
      return res.status(400).json({ message: 'A reason is required.' });
    }

    const report = await Report.create({
      reporterId: req.user.id,
      targetType,
      targetId,
      reason,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
