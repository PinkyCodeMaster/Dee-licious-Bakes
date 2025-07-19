# Dee-licious Bakes - Maintenance Guide

This document provides detailed maintenance procedures and technical information for the ongoing support of the Dee-licious Bakes website.

**Developed by Scott Jones**

---

## 🔧 Regular Maintenance Schedule

### Weekly Tasks
- [ ] Review error logs in Sentry dashboard
- [ ] Check email delivery rates in Resend dashboard
- [ ] Monitor website performance metrics
- [ ] Backup database (if not automated)

### Monthly Tasks
- [ ] Update dependencies for security patches
- [ ] Review and clean up old user accounts (if needed)
- [ ] Check SSL certificate status
- [ ] Review and optimize database performance

### Quarterly Tasks
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Content and image optimization
- [ ] Backup and disaster recovery testing

## 📊 Monitoring & Analytics

### Sentry Error Monitoring
- **Dashboard:** https://sentry.io/organizations/[org]/projects/
- **Key Metrics:** Error rate, performance issues, user impact
- **Alerts:** Configured for critical errors and performance degradation

### Vercel Analytics
- **Dashboard:** Vercel project dashboard
- **Key Metrics:** Page load times, Core Web Vitals, user engagement
- **Optimization:** Use insights to improve page performance

### Email Delivery (Resend)
- **Dashboard:** https://resend.com/dashboard
- **Key Metrics:** Delivery rate, bounce rate, spam complaints
- **Maintenance:** Monitor sender reputation and deliverability

## 🗄 Database Management

### Connection Details
- **Provider:** Neon (Serverless PostgreSQL)
- **ORM:** Drizzle with TypeScript
- **Migration Tool:** Drizzle Kit

### Common Database Tasks

#### View Database Schema
```bash
pnpm db:studio
```
Opens Drizzle Studio at http://localhost:4983

#### Create New Migration
```bash
# After modifying schema files
pnpm db:generate
pnpm db:migrate
```

#### Direct Schema Push (Development Only)
```bash
pnpm db:up
```

#### Backup Database
```bash
# Using pg_dump (requires PostgreSQL client)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Database Schema Overview

#### Core Tables
- **users** - Customer and admin accounts
- **sessions** - Authentication sessions
- **accounts** - Social login connections
- **products** - Bakery items and services
- **orders** - Customer orders and status
- **messages** - Customer-bakery communications
- **carts** - Shopping cart data

## 📧 Email System Management

### Email Templates Location
```
src/emails/templates/
├── cake-welcome.tsx          # New customer welcome
├── account-deleted.tsx       # Account deletion confirmation
├── change-email.tsx          # Email change verification
├── reset-password.tsx        # Password reset
├── verify-email.tsx          # Email verification
└── cake-unsubscribe-confirmation.tsx
```

### Email Configuration
- **Service:** Resend
- **From Address:** info@deeliciousbakes.co.uk
- **Templates:** React Email with bakery branding
- **Delivery:** Transactional emails for auth and orders

### Testing Email Templates
```bash
pnpm emails
```
Opens email preview server at http://localhost:4000

## 🔐 Security Management

### Authentication System
- **Provider:** Better Auth
- **Features:** Email/password, social logins, session management
- **Social Providers:** Google, Facebook, Microsoft (configurable)

### Security Best Practices
1. **Regular Updates:** Keep all dependencies current
2. **Environment Variables:** Never commit secrets to version control
3. **Database Security:** Use connection pooling and encrypted connections
4. **Input Validation:** All forms use Zod validation schemas
5. **Error Handling:** Sensitive information never exposed in error messages

### User Management
- **Admin Access:** Managed through database user roles
- **Account Deletion:** Includes email confirmation and data cleanup
- **Password Security:** Handled by Better Auth with proper hashing

## 🚀 Deployment & Updates

### Production Deployment Process

1. **Pre-deployment Checklist**
   - [ ] All tests passing
   - [ ] Environment variables configured
   - [ ] Database migrations ready
   - [ ] Email templates tested

2. **Deployment Steps**
   ```bash
   # Build and test locally
   pnpm build
   pnpm start
   
   # Deploy to production (Vercel)
   git push origin main
   
   # Run migrations if needed
   pnpm db:migrate
   ```

3. **Post-deployment Verification**
   - [ ] Website loads correctly
   - [ ] Authentication works
   - [ ] Email sending functional
   - [ ] Database connections stable
   - [ ] Error monitoring active

### Environment Variables Checklist

#### Required for Production
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
BETTER_AUTH_SECRET="secure-random-string"
BETTER_AUTH_URL="https://deeliciousbakes.co.uk"

# Email
RESEND_API_KEY="re_..."

# Monitoring
SENTRY_DSN="https://..."
```

#### Optional (Social Login)
```env
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
FACEBOOK_CLIENT_ID="..."
FACEBOOK_CLIENT_SECRET="..."
MICROSOFT_CLIENT_ID="..."
MICROSOFT_CLIENT_SECRET="..."
```

## 🐛 Troubleshooting Guide

### Common Issues

#### Database Connection Errors
```bash
# Check database status
pnpm db:studio

# Verify connection string
echo $DATABASE_URL

# Test connection
pnpm db:pull
```

#### Email Delivery Issues
1. Check Resend dashboard for delivery status
2. Verify sender domain configuration
3. Review email template syntax
4. Check environment variables

#### Authentication Problems
1. Verify Better Auth configuration
2. Check social provider credentials
3. Review session storage
4. Validate redirect URLs

#### Performance Issues
1. Review Vercel Analytics
2. Check Sentry performance monitoring
3. Optimize database queries
4. Review image optimization

### Log Analysis

#### Application Logs
- **Location:** Vercel dashboard or server logs
- **Key Information:** Request errors, database issues, authentication failures

#### Error Tracking
- **Sentry Dashboard:** Detailed error reports with stack traces
- **Email Alerts:** Configured for critical issues
- **Performance Monitoring:** Slow query detection

## 📞 Support Contacts

### Technical Support
**Scott Jones - Web Developer**
- Email: [your-email@example.com]
- Available for: Bug fixes, feature updates, technical consultation

### Service Providers
- **Hosting:** Vercel Support
- **Database:** Neon Support
- **Email:** Resend Support
- **Monitoring:** Sentry Support

### Emergency Procedures
1. **Website Down:** Check Vercel status, review error logs
2. **Database Issues:** Contact Neon support, check connection limits
3. **Email Problems:** Verify Resend service status
4. **Security Breach:** Immediately rotate secrets, review access logs

---

## 📋 Maintenance Checklist Template

### Monthly Maintenance Report

**Date:** ___________  
**Performed by:** ___________

#### System Health
- [ ] Website loading properly
- [ ] Database performance acceptable
- [ ] Email delivery rates normal
- [ ] Error rates within acceptable limits

#### Security Review
- [ ] Dependencies updated
- [ ] No critical security alerts
- [ ] SSL certificate valid
- [ ] Access logs reviewed

#### Performance Metrics
- [ ] Page load times < 3 seconds
- [ ] Core Web Vitals passing
- [ ] Database query performance acceptable
- [ ] Email delivery rate > 95%

#### Issues Identified
- Issue 1: ___________
- Resolution: ___________
- Issue 2: ___________
- Resolution: ___________

#### Recommendations
- ___________
- ___________

**Next Review Date:** ___________

---

*This maintenance guide ensures the continued reliable operation of the Dee-licious Bakes website and provides clear procedures for ongoing technical support.*