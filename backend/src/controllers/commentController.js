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
