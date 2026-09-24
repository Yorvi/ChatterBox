// backend/src/socket.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const logger = require('./utils/logger');

let io;
// userId -> Set of connected socket ids (a user can have multiple tabs/devices open)
const onlineUsers = new Map();

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
    },
  });

  // Every socket must present the same JWT used for REST auth
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;

    // Every socket for this user joins a personal room so we can target
    // notifications/messages at "this user" regardless of how many tabs they have open.
    socket.join(`user:${userId}`);

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);
    io.emit('presence:online', { userId });

    socket.on('message:send', async ({ receiverId, content }) => {
      try {
        const message = await Message.create({ senderId: userId, receiverId, content });
        const payload = {
          id: message.id,
          senderId: userId,
          receiverId,
          content,
          read: false,
          createdAt: message.createdAt,
        };
        io.to(`user:${receiverId}`).emit('message:new', payload);
        socket.emit('message:sent', payload);
      } catch (error) {
        logger.error('message:send error', { error: error.message });
        socket.emit('message:error', { error: error.message });
      }
    });

    socket.on('message:typing', ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit('message:typing', { senderId: userId });
    });

    socket.on('message:read', async ({ messageId }) => {
      try {
        const message = await Message.findByPk(messageId);
        if (message && message.receiverId === userId) {
          message.read = true;
          await message.save();
          io.to(`user:${message.senderId}`).emit('message:read', { messageId });
        }
      } catch (error) {
        logger.error('message:read error', { error: error.message });
      }
    });

    socket.on('disconnect', () => {
      const sockets = onlineUsers.get(userId);
      if (!sockets) return;

      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(userId);
        io.emit('presence:offline', { userId });
      }
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io has not been initialized. Call initSocket(server) first.');
  }
  return io;
}

// Fire a one-off event at a user (used for friend-request notifications, etc.)
// Safe to call before the socket layer is up - it just becomes a no-op.
function notifyUser(userId, event, payload) {
  if (io) {
    io.to(`user:${userId}`).emit(event, payload);
  }
}

module.exports = { initSocket, getIO, notifyUser };
