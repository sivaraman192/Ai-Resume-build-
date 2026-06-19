import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('resumeforge_token'));
  const [loading, setLoading] = useState(true);

  const syncAuth = () => {
    const storedToken = localStorage.getItem('resumeforge_token');
    const storedUser = localStorage.getItem('resumeforge_user');
    setToken(storedToken);
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setLoading(false);
  };

  useEffect(() => {
    syncAuth();

    // Listen to changes in auth state from anywhere in the app
    window.addEventListener('auth-change', syncAuth);
    return () => {
      window.removeEventListener('auth-change', syncAuth);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, password);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
