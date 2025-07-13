import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authAPI } from '../utils/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user and tokens are stored in localStorage
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    
    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Hardcoded demo users
      const demoUsers = [
        {
          id: '1',
          email: 'admin@school.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          phoneNumber: '+91 9876543210',
          status: 'active',
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: '2',
          email: 'teacher@school.com',
          firstName: 'Teacher',
          lastName: 'User',
          role: 'teacher',
          phoneNumber: '+91 9876543211',
          status: 'active',
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: '3',
          email: 'student@school.com',
          firstName: 'Student',
          lastName: 'User',
          role: 'student',
          phoneNumber: '+91 9876543212',
          status: 'active',
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: '4',
          email: 'parent@school.com',
          firstName: 'Parent',
          lastName: 'User',
          role: 'parent',
          phoneNumber: '+91 9876543213',
          status: 'active',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ];
      
      // Find user by email and password (password is always 'password' for demo)
      const foundUser = demoUsers.find(u => u.email === email);
      
      if (foundUser && password === 'password') {
        setUser(foundUser as User);
        localStorage.setItem('user', JSON.stringify(foundUser));
        localStorage.setItem('accessToken', 'demo-token');
        localStorage.setItem('refreshToken', 'demo-refresh-token');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};