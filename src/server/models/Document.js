const mongoose = require('mongoose');
const DocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['purchase', 'insurance', 'emissions', 'registration', 'verification', 'other'],
    required: true
  },
  ipfsHash: {
    type: String,
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    default: null
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  verificationDate: {
    type: Date,
    default: null
  },
  transactionHash: {
    type: String,
    default: null
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
});
const Document = mongoose.model('Document', DocumentSchema);
module.exports = Document;