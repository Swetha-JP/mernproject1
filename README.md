# RechargeHub - MERN Stack Application

A full-stack mobile recharge application built with MongoDB, Express.js, React, and Node.js.

## Features

- User authentication and authorization
- Mobile recharge functionality
- Transaction history
- Admin dashboard
- Real-time notifications with Socket.io
- Responsive design

## Tech Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **Real-time**: Socket.io

## Deployment

This application is configured for deployment on Render.com using the included `render.yaml` configuration.

### Environment Variables

Create a `.env` file in the backend directory:

```
PORT=10000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

### Local Development

1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Start backend: `npm run dev`
5. Start frontend: `npm start`

## Live Demo

- Backend API: [Deployed on Render]
- Frontend: [Deployed on Render]