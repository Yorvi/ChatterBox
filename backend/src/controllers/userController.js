// src/controllers/userController.js
const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single user's public profile
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update the caller's own profile (or, if admin, anyone's)
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== Number(id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this profile.' });
    }

    const { bio, profilePhoto, coverPhoto } = req.body;
    const [updated] = await User.update(
      { bio, profilePhoto, coverPhoto },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a user by ID (self, or admin)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== Number(id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this user.' });
    }

    const result = await User.destroy({ where: { id } });
    if (result) {
      res.status(200).json({ message: 'User deleted successfully.' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
};
