'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkAuth = () => {
      try {
        const token = localStorage.getItem('adminToken');
        console.log('Checking auth, token:', token ? 'exists' : 'missing');
        
        if (!token) {
          console.log('No token found, redirecting to login');
          // Use window.location to prevent redirect loops
          window.location.href = '/login';
          return;
        }

        // Basic token validation
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        
        if (payload.exp && Date.now() < payload.exp * 1000) {
          console.log('Token valid, setting authenticated');
          setIsAuthenticated(true);
        } else {
          console.log('Token expired, redirecting to login');
          localStorage.removeItem('adminToken');
          // Use window.location to prevent redirect loops
          window.location.href = '/login';
        }
      } catch (error) {
        console.log('Token validation error:', error);
        // Invalid token
        localStorage.removeItem('adminToken');
        // Use window.location to prevent redirect loops
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    // Add longer delay to prevent race conditions
    const timer = setTimeout(checkAuth, 1000);
    
    return () => clearTimeout(timer);
  }, [mounted]);

  // Don't render anything until mounted to avoid SSR issues
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Show loading while checking authentication
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
