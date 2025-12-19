// API endpoints
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// App constants
export const APP_NAME = 'RechargeHub';
export const APP_VERSION = '1.0.0';

// Operators
export const OPERATORS = {
  AIRTEL: 'airtel',
  JIO: 'jio',
  VI: 'vi',
  BSNL: 'bsnl'
};

// Transaction statuses
export const TRANSACTION_STATUS = {
  SUCCESS: 'success',
  PENDING: 'pending',
  FAILED: 'failed'
};

// Payment methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  WALLET: 'wallet',
  NETBANKING: 'netbanking'
};

// Local storage keys
export const STORAGE_KEYS = {
  USER_DATA: 'recharge_user_data',
  TRANSACTION_HISTORY: 'recharge_transaction_history',
  PREFERENCES: 'recharge_preferences'
};

// Animation variants
export const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 }
  }
};