# AgriTrade Admin Dashboard Setup Instructions

## Overview
Professional admin dashboard with Firebase authentication and Razorpay payment integration for agricultural investment platform.

## Features Implemented

### Authentication (Firebase)
- Email/Password registration and login
- Google OAuth authentication
- Protected admin routes
- User session management
- Logout functionality

### Admin Dashboard
- **Main Dashboard** (`/admin`)
  - Real-time statistics
  - Quick action buttons
  - Recent activity feed
  
- **Lands Management** (`/admin/lands`)
  - View, edit, delete lands
  - Search and filter functionality
  
- **Farmer Shares** (`/admin/farmer-shares`)
  - Manage farmer share projects
  - Track investment progress
  
- **Investors** (`/admin/investors`)
  - View all investors
  - Track investments and returns
  
- **Verifications** (`/admin/verifications`)
  - Approve/reject documents
  - KYC verification
  - Soil test verification
  
- **Analytics** (`/admin/analytics`)
  - Investment metrics
  - Performance charts
  - Top crops analysis
  
- **Reports** (`/admin/reports`)
  - Generate custom reports
  - Export functionality
  
- **Settings** (`/admin/settings`)
  - Platform configuration
  - Fee management
  - Notification settings

### Payment Integration (Razorpay)
- Secure payment processing
- Order creation and verification
- Investment tracking
- Payment history

### User Features
- Investment portfolio (`/user/investments`)
- Payment integration
- Investment tracking

## Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Variables**
Your `.env` file already contains:
- Firebase configuration
- Razorpay credentials
- MongoDB connection
- JWT secret

3. **Run Development Server**
```bash
npm run dev
```

## Usage

### Authentication
1. **Register**: Navigate to `/register`
   - Email/password signup
   - Google OAuth option
   
2. **Login**: Navigate to `/login`
   - Email/password login
   - Google OAuth option

### Admin Access
- After login, access admin dashboard at `/admin`
- All admin routes are protected and require authentication

### Making Payments
Use the `PaymentButton` component:

```jsx
import PaymentButton from '@/components/PaymentButton';

<PaymentButton
  amount={5000}
  projectName="Wheat Farming Project"
  projectId="project_id_here"
  onPaymentSuccess={(response) => {
    console.log('Payment successful:', response);
  }}
/>
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

#### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment signature

#### Investment
- `POST /api/investment` - Record investment
- `GET /api/investment?userId=xxx` - Get user investments

#### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/investors` - List all investors
- `GET /api/admin/analytics` - Analytics data
- `GET /api/admin/verifications` - Pending verifications
- `PUT /api/admin/verifications` - Update verification status

## File Structure

```
app/
├── admin/                    # Admin dashboard pages
│   ├── page.js              # Main dashboard
│   ├── lands/               # Lands management
│   ├── farmer-shares/       # Farmer shares management
│   ├── investors/           # Investors management
│   ├── verifications/       # Verification management
│   ├── analytics/           # Analytics page
│   ├── reports/             # Reports page
│   └── settings/            # Settings page
├── login/                   # Login page
├── register/                # Registration page
├── user/
│   └── investments/         # User investments page
└── api/
    ├── admin/               # Admin API routes
    ├── payment/             # Payment API routes
    └── investment/          # Investment API routes

components/
├── Header.js                # Main navigation header
├── AdminNav.js              # Admin navigation
├── ProtectedRoute.js        # Route protection HOC
└── PaymentButton.js         # Razorpay payment button

contexts/
└── AuthContext.js           # Firebase auth context

lib/
├── firebase.js              # Firebase configuration
└── razorpay.js              # Razorpay utilities
```

## Security Notes

1. **Firebase Auth**: All authentication is handled by Firebase
2. **Protected Routes**: Admin routes require authentication
3. **Payment Verification**: All payments are verified server-side
4. **Environment Variables**: Keep `.env` file secure and never commit to git

## Testing

### Test Razorpay Integration
Use test credentials:
- Key ID: `rzp_test_bVLHtVTa4tthE2`
- Test cards: https://razorpay.com/docs/payments/payments/test-card-details/

### Test Firebase Auth
- Create test accounts via `/register`
- Test Google OAuth in development

## Production Deployment

1. Update Firebase config for production domain
2. Update Razorpay keys to live credentials
3. Set proper CORS policies
4. Enable Firebase security rules
5. Set up proper MongoDB indexes

## Support

For issues or questions:
1. Check Firebase console for auth errors
2. Check Razorpay dashboard for payment issues
3. Review browser console for client-side errors
4. Check server logs for API errors
