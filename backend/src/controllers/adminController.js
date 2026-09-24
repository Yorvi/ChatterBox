// backend/src/controllers/adminController.js
const Report = require('../models/Report');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [{ model: User, as: 'reporter', attributes: ['id', 'username'] }],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'resolved' | 'dismissed'

    if (!['resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ message: "Status must be 'resolved' or 'dismissed'." });
    }

    const [updated] = await Report.update({ status }, { where: { id } });
    if (!updated) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.status(200).json({ message: 'Report updated.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const result = await Post.destroy({ where: { id: req.params.id } });
    if (!result) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.status(200).json({ message: 'Post deleted by admin.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const result = await Comment.destroy({ where: { id: req.params.id } });
    if (!result) {
      return res.status(404).json({ message: 'Comment not found.' });
    }
    res.status(200).json({ message: 'Comment deleted by admin.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await User.destroy({ where: { id: req.params.id } });
    if (!result) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted by admin.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
