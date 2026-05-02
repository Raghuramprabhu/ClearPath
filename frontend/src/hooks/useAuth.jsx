import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gsiReady, setGsiReady] = useState(false);

  // Check if user is already logged in via httpOnly cookie
  useEffect(() => {
    authApi.getMe()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Wait for Google Identity Services script to load
  useEffect(() => {
    const checkGsi = () => {
      if (window.google && window.google.accounts) {
        setGsiReady(true);
      } else {
        setTimeout(checkGsi, 100);
      }
    };
    checkGsi();
  }, []);

  const handleCredentialResponse = useCallback(async (response) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (res.ok) setUser(data.user);
    } catch (error) {
      console.error('Login error:', error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    gsiReady,
    handleCredentialResponse,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
