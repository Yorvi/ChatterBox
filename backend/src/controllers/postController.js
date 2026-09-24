// backend/src/controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

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
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilePhoto'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'profilePhoto'] },
        {
          model: Comment,
          as: 'comments',
          where: { parentId: null },
          required: false,
          include: [
            { model: User, as: 'author', attributes: ['id', 'username', 'profilePhoto'] },
            {
              model: Comment,
              as: 'replies',
              include: [{ model: User, as: 'author', attributes: ['id', 'username', 'profilePhoto'] }],
            },
          ],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const likeCount = await Like.count({ where: { postId: post.id } });

    res.status(200).json({ ...post.toJSON(), likeCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    if (post.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post.' });
    }

    await post.destroy();
    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const [, created] = await Like.findOrCreate({
      where: { userId: req.user.id, postId },
    });
    const likeCount = await Like.count({ where: { postId } });

    res.status(created ? 201 : 200).json({ liked: true, likeCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await Like.destroy({ where: { userId: req.user.id, postId } });
    const likeCount = await Like.count({ where: { postId } });

    res.status(200).json({ liked: false, likeCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
