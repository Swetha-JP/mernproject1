import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  Phone,
  MapPin,
  Smartphone,
  UserCheck
} from 'lucide-react';

const Register = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await register(formData);
    
    if (!result.success) {
      setErrors({ general: result.error });
    }
    
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card"
      style={{ maxWidth: '500px', margin: '2rem auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, var(--teal-primary), var(--peach-primary))',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          color: 'white'
        }}>
          <Smartphone size={40} style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' }} />
        </div>
        <h2 style={{ color: 'var(--gray-dark)', marginBottom: '0.5rem' }}>
          Create Account
        </h2>
        <p style={{ color: 'var(--gray-medium)' }}>
          Join RechargeHub and start recharging
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">
              <User size={16} style={{ marginRight: '0.5rem' }} />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
            {errors.name && (
              <div style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                {errors.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Phone size={16} style={{ marginRight: '0.5rem' }} />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter phone number"
              required
            />
            {errors.phone && (
              <div style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                {errors.phone}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <Mail size={16} style={{ marginRight: '0.5rem' }} />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your email"
            required
          />
          {errors.email && (
            <div style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
              {errors.email}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <MapPin size={16} style={{ marginRight: '0.5rem' }} />
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your address"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <UserCheck size={16} style={{ marginRight: '0.5rem' }} />
            Account Type
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
              style={{
                padding: '0.75rem 1.5rem',
                border: `2px solid ${formData.role === 'user' ? 'var(--peach-primary)' : 'var(--gray-light)'}`,
                borderRadius: '8px',
                background: formData.role === 'user' ? 'var(--peach-primary)' : 'white',
                color: formData.role === 'user' ? 'white' : 'var(--gray-medium)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flex: 1,
                justifyContent: 'center'
              }}
            >
              <User size={16} />
              User
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
              style={{
                padding: '0.75rem 1.5rem',
                border: `2px solid ${formData.role === 'admin' ? 'var(--teal-primary)' : 'var(--gray-light)'}`,
                borderRadius: '8px',
                background: formData.role === 'admin' ? 'var(--teal-primary)' : 'white',
                color: formData.role === 'admin' ? 'white' : 'var(--gray-medium)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flex: 1,
                justifyContent: 'center'
              }}
            >
              <UserCheck size={16} />
              Admin
            </motion.button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">
              <Lock size={16} style={{ marginRight: '0.5rem' }} />
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Create password"
                style={{ paddingRight: '3rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--gray-medium)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <div style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                {errors.password}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={16} style={{ marginRight: '0.5rem' }} />
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Confirm password"
                style={{ paddingRight: '3rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--gray-medium)',
                  cursor: 'pointer'
                }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>

        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'var(--error)',
              color: 'white',
              padding: '0.8rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}
          >
            {errors.general}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="btn btn-primary"
          style={{ 
            width: '100%', 
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, var(--teal-primary), var(--peach-primary))'
          }}
        >
          {loading ? (
            <div className="spinner" style={{ width: '20px', height: '20px' }} />
          ) : (
            'Create Account'
          )}
        </motion.button>

        <div style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--gray-medium)' }}>
            Already have an account?{' '}
          </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--teal-primary)',
              cursor: 'pointer',
              fontWeight: '600',
              textDecoration: 'underline'
            }}
          >
            Sign In
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Register;