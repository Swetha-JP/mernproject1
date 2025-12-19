const express = require('express');
const Operator = require('../models/Operator');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all operators
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const operators = await Operator.find(query).sort({ name: 1 });
    res.json({ success: true, operators });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create operator (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const operator = new Operator(req.body);
    await operator.save();
    res.status(201).json({ success: true, operator });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update operator (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const operator = await Operator.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!operator) {
      return res.status(404).json({ message: 'Operator not found' });
    }

    res.json({ success: true, operator });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete operator (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const operator = await Operator.findByIdAndDelete(req.params.id);
    if (!operator) {
      return res.status(404).json({ message: 'Operator not found' });
    }
    res.json({ success: true, message: 'Operator deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;