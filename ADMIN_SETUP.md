# Admin Authentication Setup Guide

This guide will help you set up secure admin authentication for your portfolio management system.

## 🔐 Security Features

- **JWT-based authentication** with configurable expiration
- **Protected admin routes** with middleware
- **Client-side authentication** with localStorage
- **Automatic redirects** for unauthorized access
- **Secure logout** functionality

## 📋 Prerequisites

- Next.js project with MongoDB Atlas integration
- Environment variables configured
- Dependencies installed

## 🚀 Quick Setup

### 1. Environment Variables

Add these to your `.env.local` file:

```bash
# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_key_here
```

**⚠️ Security Notes:**
- Use a strong, unique password
- Generate a random JWT secret (at least 32 characters)
- Never commit `.env.local` to version control

### 2. Default Credentials

The system comes with default credentials for development:
- **Username**: `admin`
- **Password**: `admin123`

**⚠️ Change these immediately in production!**

## 🔑 Access Points

### Login Page
- **URL**: `/login`
- **Purpose**: Admin authentication
- **Features**: 
  - Username/password login
  - Error handling
  - Responsive design
  - Loading states

### Admin Dashboard
- **URL**: `/admin`
- **Purpose**: Portfolio content management
- **Features**:
  - Protected access
  - Content overview
  - Logout functionality
  - Tabbed interface

## 🛡️ Security Implementation

### Middleware Protection
- **File**: `middleware.ts`
- **Protects**: All `/admin/*` routes
- **Skips**: `/login` (public access)
- **Features**:
  - JWT token validation
  - Automatic redirects
  - Token expiration checking

### Client-Side Protection
- **Hook**: `useAuth` in `hooks/useAuth.ts`
- **Features**:
  - Authentication state management
  - Token validation
  - Automatic logout on expiration
  - Route protection

### Protected Route Component
- **File**: `components/ProtectedRoute.tsx`
- **Purpose**: Additional client-side security
- **Features**:
  - Authentication checks
  - Loading states
  - Automatic redirects

## 🔧 Customization

### Changing Default Credentials

1. **Update environment variables**:
```bash
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password
```

2. **Restart your development server**

### JWT Configuration

1. **Token expiration** (currently 24 hours):
```typescript
// In app/api/admin/login/route.ts
exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
```

2. **JWT secret**:
```bash
JWT_SECRET=your_very_long_random_secret_key
```

### Styling Customization

The admin interface uses Tailwind CSS classes. You can customize:
- Colors in `tailwind.config.js`
- Component styles in individual files
- Layout and spacing

## 📱 Usage

### First Time Setup

1. **Start your development server**:
```bash
npm run dev
```

2. **Navigate to admin login**:
   ```
   http://localhost:3000/login
   ```

3. **Use default credentials**:
   - Username: `admin`
   - Password: `admin123`

4. **Access dashboard**:
```
http://localhost:3000/admin
```

### Daily Usage

1. **Login** at `/login`
2. **View content** in the dashboard
3. **Logout** using the logout button
4. **Session expires** after 24 hours

## 🚨 Security Best Practices

### Production Deployment

1. **Change default credentials** immediately
2. **Use strong passwords** (12+ characters, mixed case, symbols)
3. **Generate random JWT secret**:
```bash
# Generate a secure secret
openssl rand -base64 32
```

4. **Enable HTTPS** in production
5. **Set secure cookies** if implementing server-side sessions

### Environment Variables

1. **Never commit** `.env.local` to Git
2. **Use different credentials** for development/staging/production
3. **Rotate secrets** periodically
4. **Limit access** to admin credentials

### Network Security

1. **Whitelist IP addresses** if possible
2. **Use VPN** for remote access
3. **Monitor access logs**
4. **Implement rate limiting** for login attempts

## 🔍 Troubleshooting

### Common Issues

#### "Cannot access admin page"
- Check if you're logged in
- Verify JWT token in localStorage
- Check browser console for errors

#### "Login not working"
- Verify environment variables
- Check API endpoint `/api/admin/login`
- Ensure MongoDB connection

#### "Token expired"
- Logout and login again
- Check JWT expiration time
- Verify system clock

### Debug Mode

Enable debug logging by adding to your environment:
```bash
DEBUG=true
```

### Browser Developer Tools

1. **Check localStorage** for `adminToken`
2. **Monitor network requests** to `/api/admin/*`
3. **Check console** for authentication errors

## 📚 API Reference

### Authentication Endpoints

#### POST `/api/admin/login`
- **Purpose**: Admin authentication
- **Body**: `{ username, password }`
- **Response**: `{ success, token, message }`

### Protected Endpoints

All admin routes require valid JWT token in:
- **Header**: `Authorization: Bearer <token>`
- **Cookie**: `adminToken=<token>`

## 🔄 Future Enhancements

### Planned Features

1. **Two-factor authentication** (2FA)
2. **Session management**
3. **User roles and permissions**
4. **Audit logging**
5. **Password reset functionality**

### Customization Ideas

1. **Custom login themes**
2. **Multiple admin users**
3. **API key authentication**
4. **OAuth integration**
5. **LDAP/Active Directory**

## 📞 Support

If you encounter issues:

1. **Check this guide** for common solutions
2. **Review browser console** for errors
3. **Verify environment variables**
4. **Check MongoDB connection**
5. **Restart development server**

## 🔒 Security Checklist

- [ ] Changed default credentials
- [ ] Generated secure JWT secret
- [ ] Environment variables configured
- [ ] HTTPS enabled (production)
- [ ] IP restrictions configured (if applicable)
- [ ] Regular security updates
- [ ] Access monitoring enabled
- [ ] Backup and recovery plan

---

**Remember**: Security is an ongoing process. Regularly review and update your authentication system!
