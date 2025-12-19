const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const operatorRoutes = require('./routes/operators');
const planRoutes = require('./routes/plans');
const offerRoutes = require('./routes/offers');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://mernproject1-frontend.onrender.com', 'https://mernproject1-frontend-*.onrender.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/operators', operatorRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/offers', offerRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'RechargeHub Backend API is running!' });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'RechargeHub API v1.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      transactions: '/api/transactions',
      operators: '/api/operators',
      plans: '/api/plans',
      offers: '/api/offers'
    }
  });
});

// MongoDB Connection (Local)
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://swetha:swetha123@mernproject.fwp2kyj.mongodb.net/?appName=mernproject')
  .then(() => console.log('MongoDB connected locally'))
  .catch(err => console.log('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});