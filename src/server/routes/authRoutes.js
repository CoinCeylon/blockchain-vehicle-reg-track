const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  authenticateJWT
} = require('../middleware/authMiddleware');
// Register a new user
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role
    } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{
        email
      }, {
        username
      }]
    });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email or username'
      });
    }
    // For officer role, ensure officerId is provided
    if (role === 'officer' && !req.body.officerId) {
      return res.status(400).json({
        message: 'Officer ID is required for officer registration'
      });
    }
    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: role || 'user',
      officerId: req.body.officerId || null,
      officerVerified: false // Officers need verification by admin
    });
    await user.save();
    // Generate JWT token
    const token = jwt.sign({
      id: user._id,
      role: user.role
    }, process.env.JWT_SECRET || 'Vcrypt_secret_key', {
      expiresIn: '7d'
    });
    // Return user info without password
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isWalletConnected: user.isWalletConnected,
      walletAddress: user.walletAddress,
      officerVerified: user.officerVerified
    };
    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Login user
router.post('/login', async (req, res) => {
  try {
    const {
      username,
      password
    } = req.body;
    // Find user
    const user = await User.findOne({
      username
    });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }
    // Update last active timestamp
    user.lastActive = Date.now();
    await user.save();
    // Generate JWT token
    const token = jwt.sign({
      id: user._id,
      role: user.role
    }, process.env.JWT_SECRET || 'Vcrypt_secret_key', {
      expiresIn: '7d'
    });
    // Return user info without password
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isWalletConnected: user.isWalletConnected,
      walletAddress: user.walletAddress,
      stakeAddress: user.stakeAddress,
      walletName: user.walletName,
      officerVerified: user.officerVerified
    };
    res.status(200).json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Get current user
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    // Update last active timestamp
    user.lastActive = Date.now();
    await user.save();
    res.status(200).json({
      user
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Update wallet connection
router.post('/wallet', authenticateJWT, async (req, res) => {
  try {
    const {
      walletAddress,
      stakeAddress,
      walletName,
      isWalletConnected
    } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    // Update wallet info
    user.walletAddress = walletAddress || user.walletAddress;
    user.stakeAddress = stakeAddress || user.stakeAddress;
    user.walletName = walletName || user.walletName;
    user.isWalletConnected = isWalletConnected !== undefined ? isWalletConnected : user.isWalletConnected;
    user.lastActive = Date.now();
    await user.save();
    res.status(200).json({
      message: 'Wallet connection updated',
      user: {
        id: user._id,
        username: user.username,
        walletAddress: user.walletAddress,
        stakeAddress: user.stakeAddress,
        walletName: user.walletName,
        isWalletConnected: user.isWalletConnected,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
module.exports = router;