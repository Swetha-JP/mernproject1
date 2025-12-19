# Render Deployment Guide

## Files Created for Deployment

1. **render.yaml** - Main configuration for Render services
2. **backend/Dockerfile** - Backend containerization
3. **frontend/Dockerfile** - Frontend containerization  
4. **frontend/nginx.conf** - Nginx configuration for React app
5. **build.sh** - Build script
6. **frontend/src/config.js** - Environment configuration

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repo to Render
3. Render will automatically detect render.yaml and create both services

### Option 2: Manual Setup

#### Backend Deployment:
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI=mongodb+srv://swetha:sswetha123@mernproject.fwp2kyj.mongodb.net/?appName=mernproject`
   - `JWT_SECRET=a8f5f167f44f4964e6c998dee827110c`

#### Frontend Deployment:
1. Create new Web Service on Render
2. Connect same GitHub repository
3. Set build command: `cd frontend && npm install && npm run build`
4. Set start command: `cd frontend && npx serve -s build -l 3000`
5. Add environment variable:
   - `REACT_APP_API_URL=https://your-backend-url.onrender.com`

## Important Notes

- Update frontend URL in backend CORS after deployment
- Backend will be available at: `https://recharge-backend.onrender.com`
- Frontend will be available at: `https://recharge-frontend.onrender.com`
- Free tier services may sleep after inactivity