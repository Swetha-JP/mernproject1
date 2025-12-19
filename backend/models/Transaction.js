const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  operator: {
    type: String,
    required: true
  },
  circle: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true
  },
  offerApplied: {
    type: String,
    default: null
  },
  cashback: {
    type: Number,
    default: 0
  },
  commission: {
    type: Number,
    default: 0
  },
  gateway: {
    type: String,
    default: 'Razorpay'
  },
  gatewayTransactionId: {
    type: String,
    default: null
  },
  failureReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);