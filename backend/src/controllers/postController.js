// backend/src/controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
  try {
    const { content, mediaUrl } = req.body;

    const post = await Post.create({
      content,
      mediaUrl,
      userId: req.user.id, // Retrieved from auth middleware
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilePhoto'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
