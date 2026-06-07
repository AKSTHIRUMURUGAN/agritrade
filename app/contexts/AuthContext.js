'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { cookieManager } from '../lib/cookies';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = cookieManager.getToken();
      const userData = cookieManager.getUser();

      if (token && userData) {
        // Verify token is still valid
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        if (response.ok) {
          setUser(userData);
        } else {
          // Token is invalid, clear auth
          cookieManager.clearAuth();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      cookieManager.clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store token and user data in cookies
      cookieManager.setToken(data.token);
      cookieManager.setUser(data.user);
      setUser(data.user);

      return data;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data in cookies
      cookieManager.setToken(data.token);
      cookieManager.setUser(data.user);
      setUser(data.user);

      return data;
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Get user info from Firebase
      const firebaseUser = result.user;
      
      // Send to backend to create/login user and get JWT
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Google login failed');
      }

      // Store token and user data in cookies
      cookieManager.setToken(data.token);
      cookieManager.setUser(data.user);
      setUser(data.user);

      return data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Firebase signout error:', error);
    }
    
    // Clear cookies and state
    cookieManager.clearAuth();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signup, 
      login, 
      logout, 
      loginWithGoogle, 
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
