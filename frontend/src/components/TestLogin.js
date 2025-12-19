import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const TestLogin = () => {
  const { login, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleTestLogin = async () => {
    setLoading(true);
    try {
      // Clear any existing invalid tokens first
      localStorage.removeItem('token');
      localStorage.removeItem('user_data');
      
      const result = await login({
        email: 'test@example.com',
        password: 'password123'
      });
      
      if (result.success) {
        alert('Login successful! You can now recharge.');
        // Force page refresh to update all components
        window.location.reload();
      } else {
        alert('Login failed: ' + result.error);
      }
    } catch (error) {
      alert('Login error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div style={{ padding: '1rem', background: '#e8f5e8', border: '1px solid #4caf50', borderRadius: '8px', margin: '1rem 0' }}>
        <h4>✅ Logged in as: {user.name}</h4>
        <p>Email: {user.email}</p>
        <p>You can now use the recharge functionality!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', margin: '1rem 0' }}>
      <h4>⚠️ Not logged in</h4>
      <p>Click the button below to login with test credentials:</p>
      <button 
        onClick={handleTestLogin} 
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Logging in...' : 'Login with Test Account'}
      </button>
      <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
        Credentials: test@example.com / password123
      </p>
    </div>
  );
};

export default TestLogin;