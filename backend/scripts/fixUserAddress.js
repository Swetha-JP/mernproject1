const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const fixUserAddress = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find user with email pooja@gmail.com and fix address
    const user = await User.findOne({ email: 'pooja@gmail.com' });
    
    if (user) {
      console.log('Found user:', user.name);
      console.log('Current address:', user.address);
      
      // If address is same as email, clear it
      if (user.address === user.email) {
        user.address = '';
        await user.save();
        console.log('Fixed: Address cleared (was same as email)');
      } else {
        console.log('Address is already correct');
      }
    } else {
      console.log('User not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixUserAddress();