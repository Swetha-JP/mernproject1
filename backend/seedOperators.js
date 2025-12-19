const mongoose = require('mongoose');
const Operator = require('./models/Operator');
require('dotenv').config();

const operators = [
  { name: 'Airtel', code: 'AIRTEL', logo: '📱', commission: 3.5 },
  { name: 'Jio', code: 'JIO', logo: '📲', commission: 3.0 },
  { name: 'Vi (Vodafone Idea)', code: 'VI', logo: '📞', commission: 3.2 },
  { name: 'BSNL', code: 'BSNL', logo: '☎️', commission: 4.0 }
];

async function seedOperators() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://swetha:sswetha123@mernproject.fwp2kyj.mongodb.net/?appName=mernproject');
    console.log('Connected to MongoDB');

    // Clear existing operators
    await Operator.deleteMany({});
    console.log('Cleared existing operators');

    // Insert new operators
    await Operator.insertMany(operators);
    console.log('Operators seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding operators:', error);
    process.exit(1);
  }
}

seedOperators();