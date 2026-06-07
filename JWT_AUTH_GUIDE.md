# JWT Authentication with Cookies - Implementation Guide

## Overview
Implemented a complete JWT-based authentication system with secure cookie storage for your AgriTrade platform.

## Features Implemented

### 1. JWT Token Management
- Token generation with 7-day expiration
- Token verification and validation
- Secure token storage in HTTP-only cookies

### 2. User Authentication
- User registration with email/password
- User login with credential validation
- Password hashing with bcrypt
- Token-based session management

### 3. Cookie Management
- Secure cookie storage (HTTP-only in production)
- SameSite protection
- 7-day cookie expiration
- Automatic cookie cleanup on logout

### 4. Protected Routes
- Middleware for route protection
- Admin route verification
- Automatic redirect to login for unauthorized access

## File Structure

```
app/
├── api/
│   └── auth/
│       ├── login/route.js       # Login endpoint
│       ├── register/route.js    # Registration endpoint
│       └── verify/route.js      # Token verification
├── contexts/
│   └── AuthContext.js           # Auth state management
├── lib/
│   ├── jwt.js                   # JWT utilities
│   └── cookies.js               # Cookie management
models/
└── user.js                      # User MongoDB model
middleware.ts                    # Route protection
```

## Environment Variables

Add to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**IMPORTANT**: Change `JWT_SECRET` to a strong random string in production!

## API Endpoints

### POST /api/auth/register
Register a new user

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### POST /api/auth/login
Login existing user

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### POST /api/auth/verify
Verify JWT token

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "userId": "user_id",
    "email": "john@example.com",
    "role": "user"
  }
}
```

## Usage in Components

### Using Auth Context

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <button onClick={() => login(email, password)}>Login</button>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Route Example

```javascript
'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected Content</div>;
}
```

## Cookie Manager API

```javascript
import { cookieManager } from '../lib/cookies';

// Set token
cookieManager.setToken(token);

// Get token
const token = cookieManager.getToken();

// Set user data
cookieManager.setUser(userData);

// Get user data
const user = cookieManager.getUser();

// Clear all auth data
cookieManager.clearAuth();
```

## Security Features

1. **Password Hashing**: bcrypt with salt rounds of 10
2. **JWT Expiration**: 7-day token expiration
3. **Secure Cookies**: HTTP-only, SameSite=strict in production
4. **Input Validation**: Email format and password strength checks
5. **Error Handling**: Generic error messages to prevent information leakage

## User Model Schema

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin', 'farmer']),
  phone: String,
  avatar: String,
  isVerified: Boolean,
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

## Testing

### Create Test User

```bash
# Using curl
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Next Steps

1. **Add Email Verification**: Send verification emails on registration
2. **Password Reset**: Implement forgot password functionality
3. **Refresh Tokens**: Add refresh token mechanism for better security
4. **Rate Limiting**: Add rate limiting to prevent brute force attacks
5. **2FA**: Implement two-factor authentication
6. **OAuth**: Complete Google OAuth integration

## Troubleshooting

### Token Not Persisting
- Check browser cookies in DevTools
- Verify `secure` flag is false in development
- Check SameSite settings

### "Invalid Token" Error
- Token may have expired (7 days)
- JWT_SECRET may have changed
- Token may be malformed

### User Not Authenticated After Login
- Check if cookies are being set
- Verify AuthContext is wrapping the app
- Check browser console for errors

## Production Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Add rate limiting
- [ ] Implement refresh tokens
- [ ] Add logging and monitoring
- [ ] Set up error tracking (Sentry, etc.)
