const express = require('express');
const Offer = require('../models/Offer');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all offers
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = { 
      status: 'active',
      validTill: { $gte: new Date() }
    };
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const offers = await Offer.find(query).sort({ featured: -1, createdAt: -1 });
    res.json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Validate offer code
router.post('/validate', async (req, res) => {
  try {
    const { code, amount } = req.body;
    
    const offer = await Offer.findOne({
      code: code.toUpperCase(),
      status: 'active',
      validTill: { $gte: new Date() }
    });

    if (!offer) {
      return res.status(404).json({ message: 'Invalid or expired offer code' });
    }

    if (amount < offer.minAmount) {
      return res.status(400).json({ 
        message: `Minimum amount required: ₹${offer.minAmount}` 
      });
    }

    const discountAmount = Math.min(
      offer.discount.includes('%') 
        ? (amount * parseInt(offer.discount)) / 100 
        : parseInt(offer.discount.replace('₹', '')),
      offer.maxDiscount
    );

    res.json({
      success: true,
      offer: {
        title: offer.title,
        code: offer.code,
        discountAmount,
        finalAmount: amount - discountAmount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create offer (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json({ success: true, offer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update offer (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json({ success: true, offer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete offer (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;