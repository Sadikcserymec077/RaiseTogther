import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const { data } = await userApi.getMe();
          if (data.success) {
            setUser(data.data);
            localStorage.setItem('user', JSON.stringify(data.data));
          }
        } catch (error) {
          console.error('Failed to verify session', error);
          // Only clear local storage if the user is completely unauthorized, not for network errors
          if (error.response && error.response.status === 401) {
              logout();
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    if (data.success) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      
      const userData = {
        id: data.data.userId,
        name: data.data.name,
        email: data.data.email,
        roles: data.data.roles
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return data;
    }
  };

  const logout = () => {
    authApi.logout().catch(console.error); // Best effort backend logout
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isAuthenticated, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
