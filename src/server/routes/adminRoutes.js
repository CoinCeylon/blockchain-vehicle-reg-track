const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Complaint = require('../models/Complaint');
const Transaction = require('../models/Transaction');
const {
  isAdmin
} = require('../middleware/authMiddleware');

router.use(isAdmin);
// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({
      createdAt: -1
    });
    res.status(200).json({
      users
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('vehicles');
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
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
// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const {
      role,
      isVerified,
      officerVerified
    } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    // Update user fields
    if (role) user.role = role;
    if (isVerified !== undefined) user.isVerified = isVerified;
    if (officerVerified !== undefined) user.officerVerified = officerVerified;
    await user.save();
    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        officerVerified: user.officerVerified
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Disable user
router.post('/users/:id/disable', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    // Don't allow disabling other admins
    if (user.role === 'admin' && user._id.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Cannot disable another admin account'
      });
    }
    user.isVerified = false;
    if (user.role === 'officer') user.officerVerified = false;
    await user.save();
    res.status(200).json({
      message: 'User disabled successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        isVerified: user.isVerified,
        officerVerified: user.officerVerified
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Verify officer
router.post('/officers/:id/verify', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    if (user.role !== 'officer') {
      return res.status(400).json({
        message: 'User is not an officer'
      });
    }
    user.officerVerified = true;
    user.isVerified = true;
    await user.save();
    res.status(200).json({
      message: 'Officer verified successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        officerVerified: user.officerVerified
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Get all flagged vehicles
router.get('/flagged-vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      status: 'flagged'
    }).populate('owner', 'username walletAddress').populate('flaggedBy', 'username role').sort({
      flaggedDate: -1
    });
    res.status(200).json({
      vehicles
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Resolve flagged vehicle
router.post('/flagged-vehicles/:id/resolve', async (req, res) => {
  try {
    const {
      resolution,
      status
    } = req.body;
    if (!resolution) {
      return res.status(400).json({
        message: 'Resolution is required'
      });
    }
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        message: 'Valid status (active or inactive) is required'
      });
    }
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }
    if (vehicle.status !== 'flagged') {
      return res.status(400).json({
        message: 'Vehicle is not flagged'
      });
    }
    // Update vehicle status
    vehicle.status = status;
    vehicle.flaggedReason = null;
    vehicle.flaggedBy = null;
    vehicle.flaggedDate = null;
    // Create transaction record
    const transaction = new Transaction({
      type: 'other',
      vehicle: vehicle._id,
      fromUser: req.user.id,
      date: Date.now(),
      status: 'completed',
      description: `Flagged vehicle resolved: ${resolution}`,
      reason: resolution
    });
    await transaction.save();
    // Add transaction to vehicle
    vehicle.transactions.push(transaction._id);
    // Save vehicle
    await vehicle.save();
    res.status(200).json({
      message: 'Flagged vehicle resolved successfully',
      vehicle
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Get all complaints
router.get('/complaints', async (req, res) => {
  try {
    const {
      status
    } = req.query;
    const query = {};
    if (status) query.status = status;
    const complaints = await Complaint.find(query).populate('from', 'username').populate('assignedTo', 'username role').populate('vehicle', 'licensePlate make model').sort({
      date: -1
    });
    res.status(200).json({
      complaints
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Get complaint by ID
router.get('/complaints/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('from', 'username').populate('assignedTo', 'username role').populate('vehicle', 'licensePlate make model year').populate('responses.from', 'username role');
    if (!complaint) {
      return res.status(404).json({
        message: 'Complaint not found'
      });
    }
    res.status(200).json({
      complaint
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Respond to complaint
router.post('/complaints/:id/respond', async (req, res) => {
  try {
    const {
      message
    } = req.body;
    if (!message) {
      return res.status(400).json({
        message: 'Response message is required'
      });
    }
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        message: 'Complaint not found'
      });
    }
    // Add response
    complaint.responses.push({
      message,
      from: req.user.id,
      date: Date.now()
    });
    // Update status if it's open
    if (complaint.status === 'open') {
      complaint.status = 'in progress';
    }
    // Assign to current admin if not assigned
    if (!complaint.assignedTo) {
      complaint.assignedTo = req.user.id;
    }
    await complaint.save();
    res.status(200).json({
      message: 'Response added successfully',
      complaint
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Resolve complaint
router.post('/complaints/:id/resolve', async (req, res) => {
  try {
    const {
      resolution
    } = req.body;
    if (!resolution) {
      return res.status(400).json({
        message: 'Resolution is required'
      });
    }
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        message: 'Complaint not found'
      });
    }
    if (complaint.status === 'closed') {
      return res.status(400).json({
        message: 'Complaint is already closed'
      });
    }
    // Update complaint
    complaint.status = 'closed';
    complaint.resolution = resolution;
    complaint.resolutionDate = Date.now();
    // Add resolution as response
    complaint.responses.push({
      message: `Complaint resolved: ${resolution}`,
      from: req.user.id,
      date: Date.now()
    });
    await complaint.save();
    res.status(200).json({
      message: 'Complaint resolved successfully',
      complaint
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Reopen complaint
router.post('/complaints/:id/reopen', async (req, res) => {
  try {
    const {
      reason
    } = req.body;
    if (!reason) {
      return res.status(400).json({
        message: 'Reason for reopening is required'
      });
    }
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        message: 'Complaint not found'
      });
    }
    if (complaint.status !== 'closed') {
      return res.status(400).json({
        message: 'Complaint is not closed'
      });
    }
    // Update complaint
    complaint.status = 'in progress';
    complaint.resolution = null;
    complaint.resolutionDate = null;
    // Add reopening as response
    complaint.responses.push({
      message: `Complaint reopened: ${reason}`,
      from: req.user.id,
      date: Date.now()
    });
    await complaint.save();
    res.status(200).json({
      message: 'Complaint reopened successfully',
      complaint
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Get system statistics
router.get('/statistics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const pendingVehicles = await Vehicle.countDocuments({
      status: 'pending'
    });
    const flaggedVehicles = await Vehicle.countDocuments({
      status: 'flagged'
    });
    const activeVehicles = await Vehicle.countDocuments({
      status: 'active'
    });
    const totalOfficers = await User.countDocuments({
      role: 'officer'
    });
    const pendingOfficers = await User.countDocuments({
      role: 'officer',
      officerVerified: false
    });
    const totalTransactions = await Transaction.countDocuments();
    const openComplaints = await Complaint.countDocuments({
      status: 'open'
    });
    // Recent activity
    const recentTransactions = await Transaction.find().sort({
      date: -1
    }).limit(10).populate('fromUser', 'username').populate('toUser', 'username').populate('vehicle', 'licensePlate');
    res.status(200).json({
      statistics: {
        users: {
          total: totalUsers,
          officers: {
            total: totalOfficers,
            pending: pendingOfficers
          }
        },
        vehicles: {
          total: totalVehicles,
          active: activeVehicles,
          pending: pendingVehicles,
          flagged: flaggedVehicles
        },
        transactions: {
          total: totalTransactions
        },
        complaints: {
          open: openComplaints
        }
      },
      recentActivity: recentTransactions
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
module.exports = router;