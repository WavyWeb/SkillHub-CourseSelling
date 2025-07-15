import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Admin } from '../types';

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, userData: User | Admin, isAdminUser?: boolean) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedAdmin = localStorage.getItem('admin');
    const storedIsAdmin = localStorage.getItem('isAdmin');

    if (storedToken) {
      setToken(storedToken);
      if (storedIsAdmin === 'true' && storedAdmin) {
        setAdmin(JSON.parse(storedAdmin));
      } else if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, userData: User | Admin, isAdminUser = false) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('isAdmin', isAdminUser.toString());

    if (isAdminUser) {
      setAdmin(userData as Admin);
      setUser(null);
      localStorage.setItem('admin', JSON.stringify(userData));
      localStorage.removeItem('user');
    } else {
      setUser(userData as User);
      setAdmin(null);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.removeItem('admin');
    }
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('isAdmin');
  };

  const value: AuthContextType = {
    user,
    admin,
    token,
    isAuthenticated: !!token,
    isAdmin: !!admin,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};