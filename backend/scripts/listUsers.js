const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'name email address');
    console.log('All users in database:');
    users.forEach(user => {
      console.log(`- Name: ${user.name}, Email: ${user.email}, Address: "${user.address}"`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

listUsers();