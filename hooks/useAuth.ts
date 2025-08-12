'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        // Basic token validation (you can add more sophisticated validation)
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && Date.now() < payload.exp * 1000) {
          setIsAuthenticated(true);
        } else {
          // Token expired
          logout();
        }
      } catch (error) {
        // Invalid token
        logout();
      }
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    router.push('/login');
  };

  return {
    isAuthenticated,
    loading,
    logout,
    checkAuth
  };
}
