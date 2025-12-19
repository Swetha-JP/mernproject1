# RechargeHub - Mobile Recharge Application

A modern, feature-rich mobile recharge application built with React and styled with a beautiful peach color palette.

## 🌟 Features

### Dual Portal System
- **User Portal** - Complete recharge experience for end users
- **Admin Portal** - Comprehensive management dashboard for administrators
- **Role-based Access** - Automatic routing based on user role
- **Secure Authentication** - Login/Register with demo credentials

### User Portal Features
- **Instant Mobile Recharge** - Lightning-fast recharges in under 10 seconds
- **Multi-Operator Support** - Airtel, Jio, Vi, BSNL and more
- **Smart Plan Selection** - Browse and filter recharge plans
- **Exclusive Offers** - Cashback deals and promotional codes
- **Transaction History** - Complete recharge history with filters
- **User Profile Management** - Comprehensive profile and settings

### Admin Portal Features
- **Dashboard Analytics** - Real-time statistics and insights
- **User Management** - View, edit, block/unblock users
- **Transaction Management** - Monitor all transactions with detailed filtering
- **Operator Management** - Configure operators, commissions, and limits
- **Revenue Tracking** - Commission and revenue analytics
- **System Monitoring** - Success rates and performance metrics

### User Experience
- **Responsive Design** - Works seamlessly on all devices
- **Smooth Animations** - Powered by Framer Motion
- **Intuitive Navigation** - Easy-to-use interface
- **Real-time Feedback** - Toast notifications and loading states
- **Dual Color Palette** - Modern peach & teal color scheme

### Technical Features
- **React Router** - Client-side routing with protected routes
- **Context API** - State management for authentication
- **Local Storage** - Persistent user data and preferences
- **Form Validation** - Comprehensive input validation
- **Search & Filter** - Advanced filtering across all modules
- **Responsive Grid** - Flexible layout system

## 🎨 Design System

### Color Palette
**Peach Theme (User Portal)**
- **Primary**: #FFB07A (Peach)
- **Secondary**: #FFCBA4 (Light Peach)
- **Accent**: #FF6B35 (Orange)

**Teal Theme (Admin Portal)**
- **Primary**: #20B2AA (Teal)
- **Secondary**: #48CAE4 (Light Teal)
- **Accent**: #00B4D8 (Blue Teal)

**System Colors**
- **Success**: #28A745 (Green)
- **Warning**: #FFC107 (Yellow)
- **Error**: #DC3545 (Red)

### Typography
- **Font Family**: Inter, system fonts
- **Headings**: Bold weights (600-800)
- **Body**: Regular weight (400-500)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials
**Admin Access:**
- Email: admin@rechargehub.com
- Password: admin123

**User Access:**
- Email: user@example.com
- Password: user123

## 📱 Pages & Components

### User Portal Pages
- **Home** - Landing page with features and quick actions
- **Recharge** - Multi-step recharge form with operator selection
- **Plans** - Browse and filter recharge plans
- **Offers** - View promotional offers and deals
- **History** - Transaction history with advanced filtering
- **Profile** - User profile and account management

### Admin Portal Pages
- **Dashboard** - Analytics and system overview
- **User Management** - Manage all registered users
- **Transaction Management** - Monitor and manage transactions
- **Operator Management** - Configure mobile operators

### Authentication
- **Login** - Secure login with demo credentials
- **Register** - User registration with validation

### Components
- **Header** - Role-based navigation with user menu
- **AuthContext** - Authentication state management
- **Toast** - Notification system for user feedback
- **Cards** - Reusable card components
- **Forms** - Styled form inputs and validation

## 🛠️ Built With

- **React** - Frontend framework
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **CSS3** - Custom styling with CSS variables

## 📦 Project Structure

```
src/
├── components/          # Reusable components
│   ├── AuthContext.js   # Authentication context
│   ├── Header.js        # Navigation header
│   ├── Login.js         # Login component
│   ├── Register.js      # Registration component
│   └── Toast.js         # Notification system
├── pages/              # User portal pages
│   ├── Home.js
│   ├── Recharge.js
│   ├── Plans.js
│   ├── Offers.js
│   ├── History.js
│   └── Profile.js
├── admin/              # Admin portal pages
│   ├── AdminDashboard.js
│   ├── UserManagement.js
│   ├── TransactionManagement.js
│   └── OperatorManagement.js
├── utils/              # Utility functions
│   ├── constants.js
│   └── helpers.js
├── App.js              # Main app component
├── App.css             # Global styles
└── index.js            # Entry point
```

## 🎯 Future Enhancements

- **Backend Integration** - Connect to real APIs
- **Payment Gateway** - Integrate payment processing
- **Push Notifications** - Real-time notifications
- **Offline Support** - PWA capabilities
- **Multi-language** - Internationalization support
- **Dark Mode** - Theme switching
- **Analytics** - User behavior tracking

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@rechargehub.com or create an issue in the repository.

---

Made with ❤️ using React and a beautiful peach color palette