const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Operator = require('../models/Operator');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// CSRF protection middleware
router.use((req, res, next) => {
  const token = req.headers['x-csrf-token'] || req.headers['csrf-token'];
  if (req.method !== 'GET' && !token) {
    return res.status(403).json({ success: false, message: 'CSRF token required' });
  }
  next();
});

// Create recharge transaction
router.post('/recharge', auth, async (req, res) => {
  try {
    console.log('Recharge request received:', req.body);
    console.log('User:', req.user);
    
    const { phoneNumber, operator, circle, amount, paymentMethod, offerApplied } = req.body;
    
    // Validate required fields
    if (!phoneNumber || !operator || !circle || !amount || !paymentMethod) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: phoneNumber, operator, circle, amount, paymentMethod' 
      });
    }
    
    // Validate phone number format
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid phone number format' 
      });
    }
    
    // Validate amount
    if (amount < 10 || amount > 5000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount must be between ₹10 and ₹5000' 
      });
    }

    // Generate transaction ID
    const transactionId = 'TXN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 7).toUpperCase();

    // Get operator details for commission calculation
    const operatorData = await Operator.findOne({ code: operator.toUpperCase() });
    const commission = operatorData ? (amount * operatorData.commission) / 100 : 0;

    // Calculate cashback (mock logic)
    let cashback = 0;
    if (offerApplied) {
      cashback = Math.min(amount * 0.1, 50); // 10% cashback, max 50
    }

    const transaction = new Transaction({
      transactionId,
      userId: req.user._id,
      phoneNumber,
      operator,
      circle,
      amount,
      paymentMethod,
      offerApplied,
      cashback,
      commission,
      status: 'pending'
    });

    await transaction.save();

    // Emit live update (temporarily disabled)
    // io.emit('transactionUpdate', {
    //   transactionId: transaction.transactionId,
    //   status: transaction.status,
    //   userId: req.user._id
    // });

    // Simulate payment processing
    setTimeout(async () => {
      try {
        const success = Math.random() > 0.1; // 90% success rate
        
        transaction.status = success ? 'success' : 'failed';
        if (!success) {
          transaction.failureReason = 'Payment gateway error';
        }

        await transaction.save();

        // Emit live update for status change (temporarily disabled)
        // io.emit('transactionUpdate', {
        //   transactionId: transaction.transactionId,
        //   status: transaction.status,
        //   userId: req.user._id
        // });

        if (success) {
          // Update user stats
          await User.findByIdAndUpdate(req.user._id, {
            $inc: {
              totalRecharges: 1,
              totalSpent: amount,
              rewardPoints: Math.floor(amount / 10)
            }
          });

          // Update operator stats
          if (operatorData) {
            await Operator.findByIdAndUpdate(operatorData._id, {
              $inc: {
                totalTransactions: 1,
                totalRevenue: amount
              }
            });
          }
        }
      } catch (error) {
        console.error('Transaction update error:', error);
      }
    }, 2000);

    res.status(201).json({
      success: true,
      transaction: {
        transactionId: transaction.transactionId,
        status: transaction.status,
        amount: transaction.amount,
        cashback: transaction.cashback
      }
    });
  } catch (error) {
    console.error('Recharge transaction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during transaction processing' 
    });
  }
});

// Get user transactions
router.get('/my-transactions', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = { userId: req.user._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const transactions = await Transaction.find(query)
      .populate('userId', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve transactions' 
    });
  }
});

// Get all transactions (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { search, status, operator, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (operator && operator !== 'all') {
      query.operator = { $regex: operator, $options: 'i' };
    }

    const transactions = await Transaction.find(query)
      .populate('userId', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve transactions' 
    });
  }
});

// Get transaction by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      transactionId: req.params.id
    }).populate('userId', 'name email');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user owns transaction or is admin
    if (transaction.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ success: true, transaction });
  } catch (error) {
    console.error('Get transaction by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve transaction' 
    });
  }
});

// Retry failed transaction (Admin only)
router.put('/:id/retry', adminAuth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ transactionId: req.params.id });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'failed') {
      return res.status(400).json({ message: 'Only failed transactions can be retried' });
    }

    transaction.status = 'pending';
    transaction.failureReason = null;
    await transaction.save();

    res.json({ success: true, transaction });
  } catch (error) {
    console.error('Retry transaction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retry transaction' 
    });
  }
});

module.exports = router;