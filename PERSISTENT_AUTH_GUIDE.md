# Persistent Authentication Guide

## How It Works

Your JWT authentication is now set up to persist across page refreshes and browser sessions until the cookie expires (7 days).

## Authentication Flow

### 1. Initial Login
```
User enters credentials → API validates → JWT token generated → 
Token stored in cookie → User data stored in cookie → User logged in
```

### 2. Page Refresh / Revisit
```
App loads → AuthContext checks for token in cookies → 
Token found → Verify token with API → Token valid → 
User automatically logged in (no login required)
```

### 3. Token Expiry
```
Token expires after 7 days → Next API call fails → 
Cookies cleared → User redirected to login
```

## Key Features Implemented

### ✅ Automatic Authentication Check
- On app load, AuthContext automatically checks for existing token
- If valid token found, user is logged in automatically
- No need to login again until token expires

### ✅ Cookie Persistence
- Tokens stored in browser cookies (7-day expiration)
- Cookies persist across:
  - Page refreshes
  - Browser restarts
  - Tab closes/opens
  - Navigation between pages

### ✅ Protected Routes
- Middleware checks for token before allowing access
- Automatic redirect to login if not authenticated
- Preserves intended destination URL

### ✅ Auto-Redirect When Logged In
- Login page redirects to /admin if already authenticated
- Register page redirects to /admin if already authenticated
- Prevents unnecessary re-authentication

## Cookie Configuration

```javascript
{
  expires: 7,              // 7 days
  secure: production,      // HTTPS only in production
  sameSite: 'strict',      // CSRF protection
  path: '/'                // Available site-wide
}
```

## Testing the Persistent Auth

### Test 1: Login and Refresh
1. Login with credentials
2. Refresh the page (F5)
3. ✅ Should remain logged in

### Test 2: Close and Reopen Browser
1. Login with credentials
2. Close browser completely
3. Reopen browser and visit site
4. ✅ Should remain logged in

### Test 3: Navigate Away and Back
1. Login with credentials
2. Navigate to external site
3. Come back to your site
4. ✅ Should remain logged in

### Test 4: Multiple Tabs
1. Login in one tab
2. Open new tab with same site
3. ✅ Should be logged in both tabs

### Test 5: Token Expiry
1. Login with credentials
2. Wait 7 days (or manually delete cookies)
3. Try to access protected route
4. ✅ Should redirect to login

## Checking Auth Status in Browser

### View Cookies
1. Open DevTools (F12)
2. Go to Application tab
3. Click Cookies → localhost
4. Look for:
   - `auth_token` - JWT token
   - `user_data` - User information

### Check Auth State
```javascript
// In browser console
document.cookie // View all cookies
```

## User Experience Flow

### First Visit (Not Logged In)
```
Visit site → No token found → Show login page → 
User logs in → Token saved → Redirect to dashboard
```

### Return Visit (Already Logged In)
```
Visit site → Token found → Verify token → 
Token valid → Auto login → Show dashboard
(No login page shown!)
```

### Token Expired
```
Visit site → Token found → Verify token → 
Token expired → Clear cookies → Show login page
```

## Code Examples

### Check if User is Authenticated
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return <div>Welcome {user.name}!</div>;
}
```

### Protected Page Component
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  return <div>Protected Content</div>;
}
```

### Manual Logout
```javascript
import { useAuth } from '../contexts/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>
      Logout
    </button>
  );
}
```

## Security Considerations

### ✅ Implemented
- JWT tokens with expiration
- Secure cookies in production
- SameSite protection against CSRF
- Password hashing with bcrypt
- Token verification on each request

### 🔄 Recommended Additions
- Refresh token mechanism
- Token rotation
- Rate limiting on auth endpoints
- Account lockout after failed attempts
- Email verification
- 2FA (Two-Factor Authentication)

## Troubleshooting

### User Not Staying Logged In

**Check 1: Cookies Enabled**
- Ensure browser allows cookies
- Check browser privacy settings

**Check 2: Cookie Domain**
- Verify cookie domain matches your site
- Check for localhost vs 127.0.0.1 issues

**Check 3: Token Verification**
- Check browser console for errors
- Verify JWT_SECRET is set correctly
- Check API /auth/verify endpoint

**Check 4: Cookie Expiration**
- Check if cookies are expiring too soon
- Verify cookie settings in cookies.js

### Token Verification Fails

**Possible Causes:**
1. JWT_SECRET changed
2. Token format incorrect
3. Token expired
4. Database connection issue

**Solution:**
- Clear cookies and login again
- Check server logs for errors
- Verify JWT_SECRET in .env

### Cookies Not Being Set

**Check:**
1. Response headers include Set-Cookie
2. Cookie domain and path are correct
3. Secure flag matches environment
4. SameSite attribute is compatible

## Environment Variables

Required in `.env`:
```env
JWT_SECRET=your-super-secret-key-change-in-production
NODE_ENV=development
MONGO_URL=your-mongodb-connection-string
```

## Cookie Lifespan

| Action | Cookie Lifespan |
|--------|----------------|
| Login | 7 days |
| Register | 7 days |
| Logout | Immediately deleted |
| Token Expired | Automatically deleted |
| Manual Clear | User can clear anytime |

## Best Practices

1. **Never store sensitive data in cookies** - Only store token and basic user info
2. **Always verify tokens server-side** - Don't trust client-side data
3. **Use HTTPS in production** - Secure flag should be true
4. **Implement refresh tokens** - For better security
5. **Log authentication events** - For security auditing
6. **Handle token expiry gracefully** - Show friendly messages

## Summary

Your authentication system now:
- ✅ Persists login across page refreshes
- ✅ Persists login across browser sessions
- ✅ Automatically logs in returning users
- ✅ Expires after 7 days
- ✅ Redirects to login when needed
- ✅ Prevents re-login when already authenticated
- ✅ Stores tokens securely in cookies
- ✅ Verifies tokens on each request

Users will only need to login once every 7 days!
