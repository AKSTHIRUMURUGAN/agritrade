'use client';

import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const cookieManager = {
  // Set authentication token
  setToken: (token) => {
    Cookies.set(TOKEN_KEY, token, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
  },

  // Get authentication token
  getToken: () => {
    return Cookies.get(TOKEN_KEY);
  },

  // Remove authentication token
  removeToken: () => {
    Cookies.remove(TOKEN_KEY, { path: '/' });
  },

  // Set user data
  setUser: (userData) => {
    Cookies.set(USER_KEY, JSON.stringify(userData), {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
  },

  // Get user data
  getUser: () => {
    const userData = Cookies.get(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // Remove user data
  removeUser: () => {
    Cookies.remove(USER_KEY, { path: '/' });
  },

  // Clear all auth data
  clearAuth: () => {
    Cookies.remove(TOKEN_KEY, { path: '/' });
    Cookies.remove(USER_KEY, { path: '/' });
  }
};
