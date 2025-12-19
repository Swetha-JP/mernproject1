const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Operator = require('../models/Operator');
const Plan = require('../models/Plan');
const Offer = require('../models/Offer');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Operator.deleteMany({});
    await Plan.deleteMany({});
    await Offer.deleteMany({});

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@rechargehub.com',
      password: 'admin123',
      phone: '+91 9999999999',
      address: 'Mumbai, Maharashtra',
      role: 'admin'
    });
    await admin.save();

    // Create test user
    const user = new User({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      phone: '+91 9876543210',
      address: 'Delhi, Delhi',
      totalRecharges: 15,
      totalSpent: 2500,
      rewardPoints: 250
    });
    await user.save();

    // Create operators
    const operators = [
      {
        name: 'Airtel',
        code: 'AIRTEL',
        logo: '📱',
        commission: 3.5,
        totalTransactions: 15420,
        totalRevenue: 2450000,
        successRate: 99.2
      },
      {
        name: 'Jio',
        code: 'JIO',
        logo: '📲',
        commission: 3.0,
        totalTransactions: 18930,
        totalRevenue: 3200000,
        successRate: 98.8
      },
      {
        name: 'Vi',
        code: 'VI',
        logo: '📞',
        commission: 3.2,
        totalTransactions: 12340,
        totalRevenue: 1890000,
        successRate: 97.5
      },
      {
        name: 'BSNL',
        code: 'BSNL',
        logo: '☎️',
        commission: 4.0,
        maxAmount: 2000,
        totalTransactions: 3450,
        totalRevenue: 450000,
        successRate: 95.2
      }
    ];
    await Operator.insertMany(operators);

    // Create plans
    const plans = [
      {
        operator: 'Airtel',
        category: 'combo',
        price: 199,
        validity: 28,
        data: '1GB/day',
        calls: 'Unlimited',
        sms: '100/day',
        description: 'Perfect for daily usage',
        popular: true,
        rating: 4.5
      },
      {
        operator: 'Jio',
        category: 'data',
        price: 149,
        validity: 28,
        data: '2GB/day',
        calls: 'FUP 1000 mins',
        sms: '100/day',
        description: 'High-speed data plan',
        rating: 4.3
      },
      {
        operator: 'Vi',
        category: 'combo',
        price: 299,
        validity: 28,
        data: '1.5GB/day',
        calls: 'Unlimited',
        sms: 'Unlimited',
        description: 'Complete entertainment package',
        popular: true,
        rating: 4.4
      },
      {
        operator: 'Airtel',
        category: 'talktime',
        price: 99,
        validity: 28,
        data: '200MB',
        calls: 'Unlimited',
        sms: '300',
        description: 'Basic calling plan',
        rating: 4.1
      }
    ];
    await Plan.insertMany(plans);

    // Create offers
    const offers = [
      {
        title: 'First Recharge Bonus',
        description: 'Get 20% extra on your first recharge of ₹100 or more',
        discount: '20%',
        code: 'FIRST20',
        category: 'first-time',
        validTill: new Date('2024-12-31'),
        minAmount: 100,
        maxDiscount: 50,
        featured: true,
        usedBy: 15420,
        rating: 4.8
      },
      {
        title: 'Weekend Cashback',
        description: 'Get 10% cashback on weekend recharges',
        discount: '10%',
        code: 'WEEKEND10',
        category: 'cashback',
        validTill: new Date('2024-12-31'),
        minAmount: 50,
        maxDiscount: 25,
        usedBy: 8930,
        rating: 4.5
      },
      {
        title: 'Mega Bonus Offer',
        description: 'Recharge ₹299 and get ₹50 extra talktime',
        discount: '₹50',
        code: 'MEGA50',
        category: 'bonus',
        validTill: new Date('2024-12-25'),
        minAmount: 299,
        maxDiscount: 50,
        featured: true,
        usedBy: 12340,
        rating: 4.7
      }
    ];
    await Offer.insertMany(offers);

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();