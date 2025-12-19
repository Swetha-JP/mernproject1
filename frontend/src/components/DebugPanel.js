import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DebugPanel = () => {
  const { user } = useAuth();
  const [backendStatus, setBackendStatus] = useState('checking...');
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkBackend();
    checkToken();
  }, []);

  const checkBackend = async () => {
    try {
      const response = await fetch('http://localhost:3001/api');
      if (response.ok) {
        setBackendStatus('✅ Connected');
      } else {
        setBackendStatus('❌ Backend error');
      }
    } catch (error) {
      setBackendStatus('❌ Backend not running');
    }
  };

  const checkToken = () => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken ? '✅ Token exists' : '❌ No token');
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '1rem',
      fontSize: '0.8rem',
      zIndex: 1000,
      minWidth: '200px'
    }}>
      <h5>Debug Info</h5>
      <div>Backend: {backendStatus}</div>
      <div>Auth Token: {token}</div>
      <div>User: {user ? `✅ ${user.name}` : '❌ Not logged in'}</div>
      <button 
        onClick={() => { checkBackend(); checkToken(); }}
        style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
      >
        Refresh
      </button>
    </div>
  );
};

export default DebugPanel;