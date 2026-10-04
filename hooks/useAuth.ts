'use client';
import { useCallback, useEffect, useState } from 'react';
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const checkAuth = useCallback(async () => {
    try { setIsAuthenticated((await fetch('/api/admin/session', { cache: 'no-store' })).ok); }
    catch { setIsAuthenticated(false); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void checkAuth(); }, [checkAuth]);
  const logout = async () => {
    const response = await fetch('/api/admin/logout', { method: 'POST' });
    if (response.ok) { localStorage.removeItem('adminToken'); window.location.assign('/login'); }
  };
  return { isAuthenticated, loading, logout, checkAuth };
}
