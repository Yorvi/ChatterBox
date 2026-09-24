// backend/src/controllers/commentController.js
const Comment = require('../models/Comment');
const User = require('../models/User');

exports.createComment = async (req, res) => {
  try {
    const { content, postId, parentId } = req.body;

    const comment = await Comment.create({
      content,
      userId: req.user.id,
      postId,
      parentId: parentId || null,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment.' });
    }

    await comment.destroy();
    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
