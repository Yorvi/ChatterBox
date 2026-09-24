// backend/src/controllers/messageController.js
const { Op } = require('sequelize');
const Message = require('../models/Message');
const User = require('../models/User');

// GET /api/messages/:userId - full history with one other user
exports.getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/messages - one row per conversation, most recent message first
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.findAll({
      where: { [Op.or]: [{ senderId: userId }, { receiverId: userId }] },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'profilePhoto'] },
        { model: User, as: 'receiver', attributes: ['id', 'username', 'profilePhoto'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const conversations = new Map();
    for (const message of messages) {
      const other = message.senderId === userId ? message.receiver : message.sender;
      if (!conversations.has(other.id)) {
        conversations.set(other.id, { user: other, lastMessage: message });
      }
    }

    res.status(200).json(Array.from(conversations.values()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
