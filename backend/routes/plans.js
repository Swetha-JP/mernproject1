const express = require('express');
const Plan = require('../models/Plan');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all plans
router.get('/', async (req, res) => {
  try {
    const { operator, category, search } = req.query;
    
    let query = { status: 'active' };
    
    if (operator && operator !== 'all') {
      query.operator = { $regex: operator, $options: 'i' };
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { operator: { $regex: search, $options: 'i' } }
      ];
    }

    const plans = await Plan.find(query).sort({ popular: -1, price: 1 });
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create plan (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update plan (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete plan (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;