import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Menu, X, User, Bell, LogOut, Settings, Users, CreditCard } from 'lucide-react';
import { useAuth } from './AuthContext';

const Header = ({ showAuth, setShowAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const userNavItems = [
    { path: '/', label: 'Home' },
    { path: '/recharge', label: 'Recharge' },
    { path: '/plans', label: 'Plans' },
    { path: '/offers', label: 'Offers' },
    { path: '/history', label: 'History' }
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/transactions', label: 'Transactions' }
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <header className="header">
      <div className="nav-container">
        <Link to="/" className="logo">
          <Smartphone size={32} style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' }} />
          <span>RechargeHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          {navItems.map((item) => (
            <motion.div key={item.path} whileHover={{ scale: 1.05 }}>
              <Link 
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* User Actions */}
        <div className="user-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuth(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid white',
                borderRadius: '25px',
                padding: '0.5rem 1rem',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Login
            </motion.button>
          ) : (
            <>
              <motion.button 
                className="notification-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <Bell size={20} />
              </motion.button>
              
              {/* User Menu */}
              <div style={{ position: 'relative' }}>
            <motion.button 
              className="profile-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                background: isAdmin ? 'linear-gradient(135deg, var(--teal-primary), var(--teal-dark))' : 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {user?.name?.charAt(0) || <User size={20} />}
            </motion.button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  background: 'white',
                  borderRadius: '10px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  padding: '0.5rem',
                  minWidth: '200px',
                  zIndex: 1000
                }}
              >
                <div style={{
                  padding: '1rem',
                  borderBottom: '1px solid var(--peach-light)',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ fontWeight: '600', color: 'var(--gray-dark)' }}>
                    {user?.name}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                    {user?.email}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    background: isAdmin ? 'var(--teal-primary)' : 'var(--peach-primary)',
                    color: 'white',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '10px',
                    display: 'inline-block',
                    marginTop: '0.3rem'
                  }}>
                    {isAdmin ? 'Admin' : 'User'}
                  </div>
                </div>
                
                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    padding: '0.8rem',
                    color: 'var(--gray-dark)',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--peach-light)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <Settings size={16} />
                  Profile Settings
                </Link>
                
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    padding: '0.8rem',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: 'var(--error)',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--error)15'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </motion.div>
            )}
              </div>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          className="mobile-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            padding: '1rem',
            display: 'none'
          }}
        >
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              style={{
                display: 'block',
                padding: '1rem',
                color: 'var(--gray-dark)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--peach-light)'
              }}
            >
              {item.label}
            </Link>
          ))}
        </motion.div>
      )}

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowUserMenu(false)}
        />
      )}


    </header>
  );
};

export default Header;