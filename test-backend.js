const axios = require('axios');

async function testBackend() {
  try {
    console.log('Testing backend connection...');
    
    // Test basic connection
    const response = await axios.get('http://localhost:3001/api');
    console.log('✅ Backend is running:', response.data);
    
    // Test if MongoDB is connected (this will fail if auth is required)
    try {
      const healthCheck = await axios.get('http://localhost:3001/');
      console.log('✅ Health check passed:', healthCheck.data);
    } catch (error) {
      console.log('⚠️  Health check failed, but backend is running');
    }
    
  } catch (error) {
    console.error('❌ Backend connection failed:');
    console.error('Error:', error.message);
    console.error('Make sure:');
    console.error('1. Backend server is running (npm run dev in backend folder)');
    console.error('2. MongoDB is running');
    console.error('3. Port 3001 is not blocked');
  }
}

testBackend();