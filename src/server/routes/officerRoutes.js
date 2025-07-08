const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Document = require('../models/Document');
const Transaction = require('../models/Transaction');
const {
  isOfficer
} = require('../middleware/authMiddleware');
const {
  uploadToIPFS
} = require('../utils/ipfsUtils');
// All routes in this file require officer role
router.use(isOfficer);
// Get pending vehicle registrations
router.get('/pending-registrations', async (req, res) => {
  try {
    const pendingVehicles = await Vehicle.find({
      status: 'pending'
    }).populate('owner', 'username walletAddress').populate('documents').sort({
      createdAt: -1
    });
    res.status(200).json({
      vehicles: pendingVehicles
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Get approved vehicle registrations
router.get('/approved-registrations', async (req, res) => {
  try {
    // Find vehicles that were approved by this officer
    const approvedVehicles = await Vehicle.find({
      status: 'active',
      verifiedBy: req.user.id
    }).populate('owner', 'username walletAddress').sort({
      verificationDate: -1
    });
    res.status(200).json({
      vehicles: approvedVehicles
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Get rejected vehicle registrations
router.get('/rejected-registrations', async (req, res) => {
  try {
    // Find rejected transactions by this officer
    const rejectedTransactions = await Transaction.find({
      fromUser: req.user.id,
      type: 'registration',
      status: 'rejected'
    }).populate({
      path: 'vehicle',
      populate: {
        path: 'owner',
        select: 'username walletAddress'
      }
    }).sort({
      date: -1
    });
    const vehicleIds = rejectedTransactions.map(tx => tx.vehicle._id);
    // Get the vehicles
    const rejectedVehicles = await Vehicle.find({
      _id: {
        $in: vehicleIds
      },
      status: 'inactive'
    }).populate('owner', 'username walletAddress');
    res.status(200).json({
      vehicles: rejectedVehicles,
      transactions: rejectedTransactions
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Get pending document verifications
router.get('/pending-documents', async (req, res) => {
  try {
    const pendingDocuments = await Document.find({
      verified: false
    }).populate('user', 'username').populate({
      path: 'vehicle',
      select: 'licensePlate make model year owner',
      populate: {
        path: 'owner',
        select: 'username walletAddress'
      }
    }).sort({
      uploadDate: -1
    });
    res.status(200).json({
      documents: pendingDocuments
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Submit officer verification documents
router.post('/verification', async (req, res) => {
  try {
    const {
      documents
    } = req.body;
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({
        message: 'Verification documents are required'
      });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    if (user.role !== 'officer') {
      return res.status(400).json({
        message: 'Only officers can submit verification documents'
      });
    }
    // Upload documents to IPFS
    for (const docData of documents) {
      // Upload document to IPFS
      const ipfsHash = await uploadToIPFS(docData.file, docData.mimeType);
      // Create document record
      const document = new Document({
        name: docData.name,
        type: 'verification',
        ipfsHash,
        user: user._id,
        mimeType: docData.mimeType,
        size: docData.size,
        description: docData.description || 'Officer verification document'
      });
      await document.save();
      // Add document to user's verification documents
      user.verificationDocuments.push(document._id);
    }
    // Update user
    user.officerVerified = false; // Reset to false until admin approves
    await user.save();
    res.status(200).json({
      message: 'Verification documents submitted successfully. Awaiting admin approval.',
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
// Get officer statistics
router.get('/statistics', async (req, res) => {
  try {
    const approvedVehicles = await Vehicle.countDocuments({
      status: 'active',
      verifiedBy: req.user.id
    });
    const pendingVehicles = await Vehicle.countDocuments({
      status: 'pending'
    });
    const verifiedDocuments = await Document.countDocuments({
      verifiedBy: req.user.id,
      verified: true
    });
    const pendingDocuments = await Document.countDocuments({
      verified: false
    });
    // Recent activity
    const recentTransactions = await Transaction.find({
      fromUser: req.user.id
    }).sort({
      date: -1
    }).limit(10).populate('vehicle', 'licensePlate make model').populate('document', 'name type');
    res.status(200).json({
      statistics: {
        vehicles: {
          approved: approvedVehicles,
          pending: pendingVehicles
        },
        documents: {
          verified: verifiedDocuments,
          pending: pendingDocuments
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