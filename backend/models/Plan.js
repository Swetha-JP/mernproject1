const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  operator: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['data', 'talktime', 'sms', 'combo'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  validity: {
    type: Number,
    required: true
  },
  data: {
    type: String,
    required: true
  },
  calls: {
    type: String,
    required: true
  },
  sms: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 4.0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', planSchema);