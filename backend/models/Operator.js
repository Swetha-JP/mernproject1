const mongoose = require('mongoose');

const operatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  logo: {
    type: String,
    default: '📱'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  commission: {
    type: Number,
    required: true,
    default: 3.0
  },
  minAmount: {
    type: Number,
    default: 10
  },
  maxAmount: {
    type: Number,
    default: 5000
  },
  totalTransactions: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 99.0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Operator', operatorSchema);