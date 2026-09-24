// backend/src/controllers/friendRequestController.js
const { Op } = require('sequelize');
const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');
const { notifyUser } = require('../socket');

exports.sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    if (Number(receiverId) === senderId) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
    }

    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const existing = await FriendRequest.findOne({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });
    if (existing) {
      return res.status(400).json({ message: `A friend request already exists (${existing.status}).` });
    }

    const request = await FriendRequest.create({ senderId, receiverId, status: 'pending' });

    notifyUser(receiverId, 'notification:friendRequest', {
      requestId: request.id,
      from: { id: req.user.id, username: req.user.username },
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'accept' | 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: "Action must be 'accept' or 'reject'." });
    }

    const request = await FriendRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found.' });
    }
    if (request.receiverId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to respond to this request.' });
    }

    request.status = action === 'accept' ? 'accepted' : 'rejected';
    await request.save();

    if (request.status === 'accepted') {
      notifyUser(request.senderId, 'notification:friendRequestAccepted', {
        requestId: request.id,
        by: { id: req.user.id, username: req.user.username },
      });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listPending = async (req, res) => {
  try {
    const requests = await FriendRequest.findAll({
      where: { receiverId: req.user.id, status: 'pending' },
      include: [{ model: User, as: 'sender', attributes: ['id', 'username', 'profilePhoto'] }],
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const accepted = await FriendRequest.findAll({
      where: {
        status: 'accepted',
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'profilePhoto'] },
        { model: User, as: 'receiver', attributes: ['id', 'username', 'profilePhoto'] },
      ],
    });

    const friends = accepted.map((request) =>
      request.senderId === userId ? request.receiver : request.sender
    );

    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
