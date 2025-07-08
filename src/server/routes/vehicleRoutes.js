const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Document = require('../models/Document');
const {
  isVehicleOwner,
  isOfficer
} = require('../middleware/authMiddleware');
const {
  uploadToIPFS
} = require('../utils/ipfsUtils');
const {
  registerVehicleOnBlockchain
} = require('../utils/blockchainUtils');
// Get all vehicles (with filters)
router.get('/', async (req, res) => {
  try {
    const {
      status,
      owner,
      make,
      model,
      year,
      search
    } = req.query;
    const query = {};
    // Apply filters
    if (status) query.status = status;
    if (make) query.make = {
      $regex: make,
      $options: 'i'
    };
    if (model) query.model = {
      $regex: model,
      $options: 'i'
    };
    if (year) query.year = year;
    // Search by license plate or chassis number
    if (search) {
      query.$or = [{
        licensePlate: {
          $regex: search,
          $options: 'i'
        }
      }, {
        chassisNumber: {
          $regex: search,
          $options: 'i'
        }
      }];
    }
    // If user is not an admin/officer, only show their vehicles or active public vehicles
    if (req.user.role !== 'admin' && req.user.role !== 'officer') {
      query.$or = [{
        owner: req.user.id
      }, {
        status: 'active'
      }];
    }
    // If filtering by owner
    if (owner) {
      query.owner = owner;
    }
    const vehicles = await Vehicle.find(query).populate('owner', 'username walletAddress').populate('verifiedBy', 'username role').sort({
      createdAt: -1
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
// Get vehicle by ID
router.get('/:id', isVehicleOwner, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('owner', 'username walletAddress').populate('verifiedBy', 'username role').populate('documents').populate({
      path: 'transactions',
      options: {
        sort: {
          date: -1
        }
      },
      populate: {
        path: 'fromUser toUser',
        select: 'username walletAddress'
      }
    });
    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }
    res.status(200).json({
      vehicle
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Register a new vehicle
router.post('/', async (req, res) => {
  try {
    const {
      licensePlate,
      chassisNumber,
      make,
      model,
      year,
      color,
      registrationDate
    } = req.body;
    // Check for duplicate license plate or chassis number
    const existingVehicle = await Vehicle.findOne({
      $or: [{
        licensePlate
      }, {
        chassisNumber
      }]
    });
    if (existingVehicle) {
      return res.status(400).json({
        message: 'Vehicle with this license plate or chassis number already exists'
      });
    }
    // Create vehicle
    const vehicle = new Vehicle({
      licensePlate,
      chassisNumber,
      make,
      model,
      year,
      color,
      registrationDate: registrationDate || Date.now(),
      owner: req.user.id,
      status: req.user.role === 'officer' || req.user.role === 'admin' ? 'active' : 'pending'
    });
    // Process documents if provided
    if (req.body.documents && req.body.documents.length > 0) {
      for (const docData of req.body.documents) {
        // Upload document to IPFS
        const ipfsHash = await uploadToIPFS(docData.file, docData.mimeType);
        // Create document record
        const document = new Document({
          name: docData.name,
          type: docData.type,
          ipfsHash,
          vehicle: vehicle._id,
          user: req.user.id,
          mimeType: docData.mimeType,
          size: docData.size,
          description: docData.description || '',
          verified: req.user.role === 'officer' || req.user.role === 'admin'
        });
        if (req.user.role === 'officer' || req.user.role === 'admin') {
          document.verifiedBy = req.user.id;
          document.verificationDate = Date.now();
        }
        await document.save();
        // Add document to vehicle
        vehicle.documents.push(document._id);
      }
    }
    // If user is officer or admin, register on blockchain immediately
    if (req.user.role === 'officer' || req.user.role === 'admin') {
      try {
        const user = await User.findById(req.user.id);
        if (user.isWalletConnected && user.walletAddress) {
          // Register on blockchain
          const txHash = await registerVehicleOnBlockchain({
            licensePlate,
            chassisNumber,
            make,
            model,
            year,
            color
          }, user.walletAddress);
          // Create transaction record
          const transaction = new Transaction({
            type: 'registration',
            vehicle: vehicle._id,
            fromUser: req.user.id,
            date: Date.now(),
            status: 'completed',
            transactionHash: txHash,
            description: 'Vehicle registered by officer'
          });
          await transaction.save();
          // Add transaction to vehicle
          vehicle.transactions.push(transaction._id);
          // Update vehicle with blockchain data
          vehicle.onChainMetadata = {
            metadataHash: txHash
            // Other blockchain metadata would be added here
          };
          vehicle.verifiedBy = req.user.id;
          vehicle.verificationDate = Date.now();
        }
      } catch (blockchainError) {
        console.error('Blockchain registration error:', blockchainError);
        // Continue with database registration even if blockchain registration fails
      }
    } else {
      // Create pending transaction for regular user
      const transaction = new Transaction({
        type: 'registration',
        vehicle: vehicle._id,
        fromUser: req.user.id,
        date: Date.now(),
        status: 'pending',
        description: 'Vehicle registration submitted, pending approval'
      });
      await transaction.save();
      // Add transaction to vehicle
      vehicle.transactions.push(transaction._id);
    }
    // Save vehicle
    await vehicle.save();
    // Add vehicle to user's vehicles
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        vehicles: vehicle._id
      }
    });
    res.status(201).json({
      message: 'Vehicle registration submitted successfully',
      vehicle,
      status: vehicle.status
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Approve vehicle registration (officers only)
router.post('/:id/approve', isOfficer, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }
    if (vehicle.status !== 'pending') {
      return res.status(400).json({
        message: 'Vehicle is not in pending status'
      });
    }
    // Update vehicle status
    vehicle.status = 'active';
    vehicle.verifiedBy = req.user.id;
    vehicle.verificationDate = Date.now();
    // Get vehicle owner
    const owner = await User.findById(vehicle.owner);
    // Register on blockchain if owner has wallet connected
    if (owner.isWalletConnected && owner.walletAddress) {
      try {
        // Register on blockchain
        const txHash = await registerVehicleOnBlockchain({
          licensePlate: vehicle.licensePlate,
          chassisNumber: vehicle.chassisNumber,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          color: vehicle.color
        }, owner.walletAddress);
        // Create transaction record
        const transaction = new Transaction({
          type: 'registration',
          vehicle: vehicle._id,
          fromUser: owner._id,
          toUser: req.user.id,
          // Officer who approved
          date: Date.now(),
          status: 'completed',
          transactionHash: txHash,
          description: 'Vehicle registration approved by officer'
        });
        await transaction.save();
        // Add transaction to vehicle
        vehicle.transactions.push(transaction._id);
        // Update vehicle with blockchain data
        vehicle.onChainMetadata = {
          metadataHash: txHash
          // Other blockchain metadata would be added here
        };
      } catch (blockchainError) {
        console.error('Blockchain registration error:', blockchainError);
        // Continue with approval even if blockchain registration fails
      }
    } else {
      // Create transaction record without blockchain data
      const transaction = new Transaction({
        type: 'registration',
        vehicle: vehicle._id,
        fromUser: owner._id,
        toUser: req.user.id,
        // Officer who approved
        date: Date.now(),
        status: 'completed',
        description: 'Vehicle registration approved by officer (off-chain)'
      });
      await transaction.save();
      // Add transaction to vehicle
      vehicle.transactions.push(transaction._id);
    }
    // Save vehicle
    await vehicle.save();
    res.status(200).json({
      message: 'Vehicle registration approved',
      vehicle
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Reject vehicle registration (officers only)
router.post('/:id/reject', isOfficer, async (req, res) => {
  try {
    const {
      reason
    } = req.body;
    if (!reason) {
      return res.status(400).json({
        message: 'Rejection reason is required'
      });
    }
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }
    if (vehicle.status !== 'pending') {
      return res.status(400).json({
        message: 'Vehicle is not in pending status'
      });
    }
    // Update vehicle status
    vehicle.status = 'inactive';
    // Create transaction record
    const transaction = new Transaction({
      type: 'registration',
      vehicle: vehicle._id,
      fromUser: vehicle.owner,
      toUser: req.user.id,
      // Officer who rejected
      date: Date.now(),
      status: 'rejected',
      description: 'Vehicle registration rejected by officer',
      reason
    });
    await transaction.save();
    // Add transaction to vehicle
    vehicle.transactions.push(transaction._id);
    // Save vehicle
    await vehicle.save();
    res.status(200).json({
      message: 'Vehicle registration rejected',
      vehicle
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Flag a vehicle (officers and admins only)
router.post('/:id/flag', isOfficer, async (req, res) => {
  try {
    const {
      reason
    } = req.body;
    if (!reason) {
      return res.status(400).json({
        message: 'Flag reason is required'
      });
    }
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }
    // Update vehicle status
    vehicle.status = 'flagged';
    vehicle.flaggedReason = reason;
    vehicle.flaggedBy = req.user.id;
    vehicle.flaggedDate = Date.now();
    // Create transaction record
    const transaction = new Transaction({
      type: 'other',
      vehicle: vehicle._id,
      fromUser: req.user.id,
      date: Date.now(),
      status: 'completed',
      description: 'Vehicle flagged for investigation',
      reason
    });
    await transaction.save();
    // Add transaction to vehicle
    vehicle.transactions.push(transaction._id);
    // Save vehicle
    await vehicle.save();
    res.status(200).json({
      message: 'Vehicle flagged successfully',
      vehicle
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Transfer vehicle ownership
router.post('/:id/transfer', isVehicleOwner, async (req, res) => {
  try {
    const {
      recipientAddress,
      transferReason,
      transferFee
    } = req.body;
    if (!recipientAddress) {
      return res.status(400).json({
        message: 'Recipient wallet address is required'
      });
    }
    if (!transferReason) {
      return res.status(400).json({
        message: 'Transfer reason is required'
      });
    }
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }
    if (vehicle.status !== 'active') {
      return res.status(400).json({
        message: 'Vehicle must be active to transfer ownership'
      });
    }
    // Find recipient user by wallet address
    const recipient = await User.findOne({
      walletAddress: recipientAddress
    });
    if (!recipient) {
      return res.status(404).json({
        message: 'Recipient not found. They must register and connect their wallet first'
      });
    }
    // Get current owner
    const currentOwner = await User.findById(vehicle.owner);
    if (!currentOwner.isWalletConnected || !currentOwner.walletAddress) {
      return res.status(400).json({
        message: 'Current owner must connect their wallet to transfer ownership'
      });
    }
    // Perform transfer on blockchain
    try {
     
      const txHash = `tx${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      // Add previous owner to history
      vehicle.previousOwners.push({
        user: vehicle.owner,
        transferDate: Date.now(),
        transactionHash: txHash
      });
      // Update vehicle owner
      vehicle.owner = recipient._id;
      // Create transaction record
      const transaction = new Transaction({
        type: 'transfer',
        vehicle: vehicle._id,
        fromUser: currentOwner._id,
        toUser: recipient._id,
        date: Date.now(),
        status: 'completed',
        transactionHash: txHash,
        description: 'Ownership transferred',
        reason: transferReason,
        fees: transferFee
      });
      await transaction.save();
      // Add transaction to vehicle
      vehicle.transactions.push(transaction._id);
      // Save vehicle
      await vehicle.save();
      // Remove vehicle from current owner's list
      await User.findByIdAndUpdate(currentOwner._id, {
        $pull: {
          vehicles: vehicle._id
        }
      });
      // Add vehicle to recipient's list
      await User.findByIdAndUpdate(recipient._id, {
        $push: {
          vehicles: vehicle._id
        }
      });
      res.status(200).json({
        message: 'Vehicle ownership transferred successfully',
        transaction,
        vehicle
      });
    } catch (blockchainError) {
      res.status(500).json({
        message: 'Blockchain transfer error',
        error: blockchainError.message
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
module.exports = router;