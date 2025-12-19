import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/helpers';
import io from 'socket.io-client';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = storage.get('user_data');
    const token = storage.get('token');
    
    if (storedUser && token) {
      // Validate token before setting user
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp > currentTime) {
          setUser(storedUser);
        } else {
          // Token expired, clear storage
          storage.remove('user_data');
          storage.remove('token');
        }
      } catch (error) {
        // Invalid token, clear storage
        storage.remove('user_data');
        storage.remove('token');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      // Initialize socket connection when user logs in
      const socketConnection = io(process.env.REACT_APP_API_URL || 'http://localhost:3001', {
        auth: {
          token: storage.get('token')
        }
      });
      setSocket(socketConnection);

      return () => {
        socketConnection.disconnect();
      };
    } else {
      // Disconnect socket when user logs out
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  const login = async (credentials) => {
    try {
      const { authAPI } = await import('../utils/api');
      const response = await authAPI.login(credentials);
      
      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        storage.set('user_data', userData);
        storage.set('token', response.data.token);
        return { success: true, user: userData };
      } else {
        return { success: false, error: 'Login failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const { authAPI } = await import('../utils/api');
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        const user = response.data.user;
        setUser(user);
        storage.set('user_data', user);
        storage.set('token', response.data.token);
        return { success: true, user };
      } else {
        return { success: false, error: 'Registration failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    storage.remove('user_data');
    storage.remove('token');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    storage.set('user_data', updatedUser);
  };

  const value = {
    user,
    socket,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};