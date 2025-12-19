const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  discount: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['cashback', 'bonus', 'first-time', 'trending'],
    required: true
  },
  validTill: {
    type: Date,
    required: true
  },
  minAmount: {
    type: Number,
    required: true
  },
  maxDiscount: {
    type: Number,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  usedBy: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 4.0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Offer', offerSchema);