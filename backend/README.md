# RechargeHub Backend

Complete backend API for the RechargeHub mobile recharge application built with Node.js, Express, and MongoDB.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (User/Admin)
- Password hashing with bcrypt
- Protected routes middleware

### User Management
- User registration and login
- Profile management
- Admin user management (CRUD operations)
- User status management (active/inactive/blocked)

### Transaction Processing
- Mobile recharge processing
- Transaction history tracking
- Real-time status updates
- Commission calculation
- Cashback processing

### Operator Management
- Mobile operator configuration
- Commission rate management
- Transaction limits
- Success rate tracking

### Plan Management
- Recharge plan CRUD operations
- Category-based filtering
- Popular plan marking
- Rating system

### Offer Management
- Promotional offer creation
- Offer code validation
- Category-based offers
- Expiry date management

## 🛠 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## 📦 Installation

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your MongoDB URI and JWT secret.

4. Seed the database:
   ```bash
   npm run seed
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rechargehub
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/:id/status` - Update user status (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Transactions
- `POST /api/transactions/recharge` - Create recharge
- `GET /api/transactions/my-transactions` - Get user transactions
- `GET /api/transactions` - Get all transactions (Admin)
- `GET /api/transactions/:id` - Get transaction by ID
- `PUT /api/transactions/:id/retry` - Retry failed transaction (Admin)

### Operators
- `GET /api/operators` - Get all operators
- `POST /api/operators` - Create operator (Admin)
- `PUT /api/operators/:id` - Update operator (Admin)
- `DELETE /api/operators/:id` - Delete operator (Admin)

### Plans
- `GET /api/plans` - Get all plans
- `POST /api/plans` - Create plan (Admin)
- `PUT /api/plans/:id` - Update plan (Admin)
- `DELETE /api/plans/:id` - Delete plan (Admin)

### Offers
- `GET /api/offers` - Get all offers
- `POST /api/offers/validate` - Validate offer code
- `POST /api/offers` - Create offer (Admin)
- `PUT /api/offers/:id` - Update offer (Admin)
- `DELETE /api/offers/:id` - Delete offer (Admin)

## 🗃 Database Models

### User
- Personal information
- Authentication credentials
- Role and status
- Transaction statistics
- Reward points

### Transaction
- Transaction details
- User reference
- Operator information
- Payment details
- Status tracking

### Operator
- Operator configuration
- Commission rates
- Transaction limits
- Performance metrics

### Plan
- Plan details
- Operator association
- Category classification
- Pricing information

### Offer
- Promotional details
- Discount information
- Validity period
- Usage statistics

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 👥 Default Users

After running the seed script:

**Admin User:**
- Email: admin@rechargehub.com
- Password: admin123

**Test User:**
- Email: user@example.com
- Password: user123

## 🚀 Deployment

1. Set production environment variables
2. Build and deploy to your preferred platform
3. Ensure MongoDB connection is configured
4. Run seed script on production database

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Populate database with initial data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.