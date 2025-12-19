import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './components/AuthContext';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import Recharge from './pages/Recharge';
import History from './pages/History';
import Profile from './pages/Profile';
import Plans from './pages/Plans';
import Offers from './pages/Offers';
import AdminDashboard from './admin/AdminDashboard';
import UserManagement from './admin/UserManagement';
import TransactionManagement from './admin/TransactionManagement';
import PlanManagement from './admin/PlanManagement';
import SystemAnalytics from './admin/SystemAnalytics';
import './App.css';

const AuthWrapper = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, var(--peach-light) 0%, var(--white) 100%)'
      }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user && showAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--peach-light) 0%, var(--white) 100%)',
        padding: '2rem 0'
      }}>
        {showRegister ? (
          <Register onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <Login onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  return <AppContent showAuth={showAuth} setShowAuth={setShowAuth} />;
};

const AppContent = ({ showAuth, setShowAuth }) => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="app">
      <Header showAuth={showAuth} setShowAuth={setShowAuth} />
      <motion.main 
        className="main-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          {user && isAdmin ? (
            // Admin Routes
            <>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/transactions" element={<TransactionManagement />} />
              <Route path="/admin/operators" element={<PlanManagement />} />
              <Route path="/admin/analytics" element={<SystemAnalytics />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </>
          ) : user ? (
            // Authenticated User Routes
            <>
              <Route path="/" element={<Home />} />
              <Route path="/recharge" element={<Recharge />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            // Public Routes (No Authentication Required)
            <>
              <Route path="/" element={<Home />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/recharge" element={<div style={{textAlign: 'center', padding: '2rem'}}><h2>Please login to recharge</h2><button onClick={() => setShowAuth(true)} className="btn btn-primary">Login</button></div>} />
              <Route path="/history" element={<div style={{textAlign: 'center', padding: '2rem'}}><h2>Please login to view history</h2><button onClick={() => setShowAuth(true)} className="btn btn-primary">Login</button></div>} />
              <Route path="/profile" element={<div style={{textAlign: 'center', padding: '2rem'}}><h2>Please login to view profile</h2><button onClick={() => setShowAuth(true)} className="btn btn-primary">Login</button></div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </motion.main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;