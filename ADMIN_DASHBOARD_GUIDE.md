# Admin Dashboard Guide

## Overview
The admin dashboard provides comprehensive management tools for your agricultural investment platform.

## Access
Navigate to `/admin` to access the admin dashboard.

## Features

### 1. Dashboard (`/admin`)
- **Real-time Statistics**: View total lands, farmer shares, investments, and investors
- **Quick Actions**: Fast access to all admin functions
- **Recent Activity Feed**: Monitor latest platform activities
- **Visual Metrics**: Color-coded stat cards for easy monitoring

### 2. Lands Management (`/admin/lands`)
- View all land listings in table format
- Search lands by name or location
- Filter by status (open, closed, completed)
- Edit land details
- Delete land listings
- View verification status

### 3. Farmer Shares Management (`/admin/farmer-shares`)
- Grid view of all farmer share projects
- Progress bars showing share sales
- Filter by project status
- View detailed project information
- Delete farmer shares
- Monitor verification status

### 4. Farmer Share Details (`/admin/farmer-shares/[id]`)
- Complete farmer information
- Investment details and metrics
- List of all investors
- Update project status
- Verification checklist
- Performance metrics

### 5. Investors Management (`/admin/investors`)
- Complete investor database
- Search functionality
- Total investment tracking
- Returns monitoring
- Project count per investor

### 6. Users Management (`/admin/users`)
- View all platform users
- Filter by role (investor, farmer, admin)
- Search by name or email
- Suspend/activate user accounts
- Monitor user registration dates

### 7. Verifications (`/admin/verifications`)
- Pending verification queue
- Quick approve/reject for:
  - Document verification
  - KYC verification
  - Soil test reports
- Visual cards for easy review
- Separate handling for lands and farmer shares

### 8. Analytics (`/admin/analytics`)
- **Key Metrics**:
  - Average investment per investor
  - Project success rate
  - Average ROI
- **Top Performing Crops**: See which crops attract most investment
- **Investment by Status**: Distribution across project stages
- **Monthly Growth**: Visual chart of platform growth

### 9. Reports (`/admin/reports`)
- Generate custom reports:
  - Investment reports
  - Investor reports
  - Project reports
  - Financial reports
- Select date ranges (week, month, quarter, year)
- Export functionality
- Pre-defined report templates

### 10. Notifications (`/admin/notifications`)
- Send platform-wide notifications
- Target specific user groups:
  - All users
  - Investors only
  - Farmers only
  - Admins only
- Set priority levels (low, normal, high, urgent)
- View recent notification history

### 11. Settings (`/admin/settings`)
- **Financial Settings**:
  - Platform fee percentage
  - Investor/farmer profit split
  - Minimum/maximum investment limits
- **Notification Settings**:
  - Email notifications toggle
  - SMS notifications toggle
- **Approval Settings**:
  - Auto-approval for verified projects

## Navigation
The admin dashboard includes a sticky navigation bar with quick access to all sections.

## API Endpoints

### Dashboard
- `GET /api/admin/dashboard` - Fetch dashboard statistics

### Investors
- `GET /api/admin/investors` - Get all investors with aggregated data

### Analytics
- `GET /api/admin/analytics` - Fetch analytics data

### Verifications
- `GET /api/admin/verifications` - Get pending verifications
- `PUT /api/admin/verifications` - Update verification status

### Users
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users` - Update user status

### Farmer Shares
- `GET /api/farmerShare/[id]` - Get specific farmer share details
- `PUT /api/farmerShare/[id]` - Update farmer share

## Best Practices

1. **Regular Monitoring**: Check the dashboard daily for new verifications
2. **Verification Priority**: Process verifications promptly to maintain trust
3. **Analytics Review**: Weekly review of analytics to identify trends
4. **User Management**: Monitor user activity and address issues quickly
5. **Notifications**: Use notifications sparingly to avoid user fatigue
6. **Reports**: Generate monthly reports for stakeholder review

## Security Notes

- Admin routes should be protected with authentication
- Implement role-based access control
- Log all admin actions for audit trail
- Regular backup of admin settings

## Future Enhancements

- Real-time notifications
- Advanced filtering and sorting
- Bulk operations
- Export to Excel/PDF
- Email integration
- SMS gateway integration
- Advanced analytics with charts
- Audit log viewer
