const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const Vehicle = require('../models/Vehicle');
const Transaction = require('../models/Transaction');
const {
  isVehicleOwner,
  isOfficer
} = require('../middleware/authMiddleware');
const {
  uploadToIPFS,
  getFromIPFS
} = require('../utils/ipfsUtils');
// Upload a document
router.post('/', async (req, res) => {
  try {
    const {
      name,
      type,
      vehicleId,
      file,
      mimeType,
      size,
      description
    } = req.body;
    if (!name || !type || !vehicleId || !file || !mimeType) {
      return res.status(400).json({
        message: 'Missing required fields'
      });
    }
    // Check if vehicle exists and user has permission
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }
    // Check if user is owner or officer/admin
    if (vehicle.owner.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'officer') {
      return res.status(403).json({
        message: 'Not authorized to upload documents for this vehicle'
      });
    }
    // Upload to IPFS
    const ipfsHash = await uploadToIPFS(file, mimeType);
    // Create document
    const document = new Document({
      name,
      type,
      ipfsHash,
      vehicle: vehicleId,
      user: req.user.id,
      mimeType,
      size,
      description: description || '',
      verified: req.user.role === 'officer' || req.user.role === 'admin'
    });
    if (req.user.role === 'officer' || req.user.role === 'admin') {
      document.verifiedBy = req.user.id;
      document.verificationDate = Date.now();
    }
    await document.save();
    // Add document to vehicle
    await Vehicle.findByIdAndUpdate(vehicleId, {
      $push: {
        documents: document._id
      }
    });
    // Create transaction record
    const transaction = new Transaction({
      type: 'document',
      vehicle: vehicleId,
      fromUser: req.user.id,
      document: document._id,
      date: Date.now(),
      status: 'completed',
      description: `Document "${name}" uploaded`
    });
    await transaction.save();
    // Add transaction to vehicle
    await Vehicle.findByIdAndUpdate(vehicleId, {
      $push: {
        transactions: transaction._id
      }
    });
    res.status(201).json({
      message: 'Document uploaded successfully',
      document
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Get document by ID
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate('user', 'username').populate('verifiedBy', 'username role');
    if (!document) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }
    // Check if user has permission
    const vehicle = await Vehicle.findById(document.vehicle);
    if (!vehicle) {
      return res.status(404).json({
        message: 'Associated vehicle not found'
      });
    }
    // Check if user is owner, document uploader, or officer/admin
    if (vehicle.owner.toString() !== req.user.id && document.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'officer') {
      return res.status(403).json({
        message: 'Not authorized to access this document'
      });
    }
    res.status(200).json({
      document
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Get document content from IPFS
router.get('/:id/content', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }
    // Check if user has permission
    const vehicle = await Vehicle.findById(document.vehicle);
    if (!vehicle) {
      return res.status(404).json({
        message: 'Associated vehicle not found'
      });
    }
    // Check if user is owner, document uploader, or officer/admin
    if (vehicle.owner.toString() !== req.user.id && document.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'officer') {
      return res.status(403).json({
        message: 'Not authorized to access this document'
      });
    }
    // Get document from IPFS
    const content = await getFromIPFS(document.ipfsHash);
    // Set content type based on document's mimeType
    res.setHeader('Content-Type', document.mimeType);
    res.send(content);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Verify document (officers only)
router.post('/:id/verify', isOfficer, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }
    if (document.verified) {
      return res.status(400).json({
        message: 'Document is already verified'
      });
    }
    // Update document
    document.verified = true;
    document.verifiedBy = req.user.id;
    document.verificationDate = Date.now();
    await document.save();
    // Create transaction record
    const transaction = new Transaction({
      type: 'verification',
      vehicle: document.vehicle,
      fromUser: req.user.id,
      document: document._id,
      date: Date.now(),
      status: 'completed',
      description: `Document "${document.name}" verified`
    });
    await transaction.save();
    // Add transaction to vehicle
    await Vehicle.findByIdAndUpdate(document.vehicle, {
      $push: {
        transactions: transaction._id
      }
    });
    res.status(200).json({
      message: 'Document verified successfully',
      document
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
// Get all documents for a vehicle
router.get('/vehicle/:vehicleId', isVehicleOwner, async (req, res) => {
  try {
    const documents = await Document.find({
      vehicle: req.params.vehicleId
    }).populate('user', 'username').populate('verifiedBy', 'username role').sort({
      uploadDate: -1
    });
    res.status(200).json({
      documents
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
module.exports = router;