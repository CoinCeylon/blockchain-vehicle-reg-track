const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['registration', 'transfer', 'document', 'verification', 'other'],
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    default: null
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'rejected'],
    default: 'pending'
  },
  transactionHash: {
    type: String,
    default: null
  },
  blockHeight: {
    type: Number,
    default: null
  },
  fees: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: ''
  },
  metadata: {
    type: Object,
    default: {}
  },
  reason: {
    type: String,
    default: null
  }
});
const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;