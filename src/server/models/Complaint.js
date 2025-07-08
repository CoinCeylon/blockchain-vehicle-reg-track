const mongoose = require('mongoose');
const ComplaintSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: null
  },
  status: {
    type: String,
    enum: ['open', 'in progress', 'closed'],
    default: 'open'
  },
  date: {
    type: Date,
    default: Date.now
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  responses: [{
    message: {
      type: String,
      required: true
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    type: String,
    default: null
  },
  resolutionDate: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
});
const Complaint = mongoose.model('Complaint', ComplaintSchema);
module.exports = Complaint;