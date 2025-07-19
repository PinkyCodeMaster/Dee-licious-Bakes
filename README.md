# Dee-licious Bakes - Professional Bakery Website

A modern, responsive website built specifically for Dee-licious Bakes, featuring online ordering, customer management, and administrative tools tailored for bakery operations.

**Developed by Scott Jones**  
Professional web development services for small businesses

---

## 🏪 About Dee-licious Bakes

**Owner:** Deanna Jones  
**Address:** The Penruddocke Arms Hindon Rd, Salisbury SP3 5EL  
**Email:** info@deeliciousbakes.co.uk  
**Website:** https://deeliciousbakes.co.uk/

Dee-licious Bakes is a boutique bakery specializing in custom cakes, artisanal pastries, and bespoke baked goods for special occasions. This website provides customers with an easy way to browse products, place orders, and communicate directly with the bakery.

## ✨ Key Features

### Customer Experience
- **Product Showcase** - Beautiful gallery of cakes, pastries, and baked goods
- **Custom Order Requests** - Easy-to-use forms for special occasion cakes
- **Customer Accounts** - Order history and profile management
- **Direct Messaging** - Communication channel with the bakery
- **Responsive Design** - Optimized for mobile, tablet, and desktop

### Business Management
- **Order Management** - Track and manage customer orders
- **Customer Communication** - Built-in messaging system
- **User Administration** - Customer account oversight
- **Email Notifications** - Automated customer communications
- **Secure Authentication** - Multiple login options including social providers

### Technical Excellence
- **Modern Framework** - Built with Next.js 15 and React 19
- **Fast Performance** - Optimized with Turbopack for lightning-fast loading
- **Secure Database** - PostgreSQL with Drizzle ORM for data integrity
- **Professional Email** - Branded transactional emails via Resend
- **Error Monitoring** - Sentry integration for proactive issue resolution

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- pnpm package manager
- PostgreSQL database (Neon recommended)
- Email service account (Resend)

### Installation

1. **Clone and Install**
   ```bash
   git clone https://github.com/PinkyCodeMaster/dee-licious-bakes
   cd dee-licious-bakes
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following environment variables:
   ```env
   # Database
   DATABASE_URL="your-postgresql-connection-string"
   
   # Authentication
   BETTER_AUTH_SECRET="your-auth-secret"
   BETTER_AUTH_URL="http://localhost:3000"
   
   # Email Service
   RESEND_API_KEY="your-resend-api-key"
   
   # Social Authentication (Optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   FACEBOOK_CLIENT_ID="your-facebook-client-id"
   FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
   
   # Error Monitoring
   SENTRY_DSN="your-sentry-dsn"
   ```

3. **Database Setup**
   ```bash
   pnpm db:generate  # Generate migration files
   pnpm db:migrate   # Run migrations
   pnpm db:seed      # Seed with initial data
   ```

4. **Start Development Server**
   ```bash
   pnpm dev
   ```
   
   Visit http://localhost:3000 to see your bakery website.

## 📋 Available Commands

### Development
```bash
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run code linting
```

### Database Management
```bash
pnpm db:generate      # Generate new migrations
pnpm db:migrate       # Apply pending migrations
pnpm db:up            # Push schema changes directly
pnpm db:studio        # Open database management interface
pnpm db:seed          # Populate database with sample data
```

### Email Development
```bash
pnpm emails           # Preview email templates (localhost:4000)
```

## 🛠 Technology Stack

### Core Framework
- **Next.js 15.4.1** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Turbopack** - Ultra-fast bundler for development

### Database & Authentication
- **PostgreSQL** - Reliable, scalable database
- **Drizzle ORM** - Type-safe database operations
- **Better Auth** - Modern authentication with social providers
- **Neon** - Serverless PostgreSQL hosting

### UI & Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Email & Communications
- **React Email** - Modern email template system
- **Resend** - Reliable email delivery service
- **Branded Templates** - Custom bakery-themed emails

### Monitoring & Analytics
- **Sentry** - Error tracking and performance monitoring
- **Vercel Analytics** - Website performance insights

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Admin and account management
│   ├── (home)/            # Public pages
│   └── api/               # API endpoints
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Admin interface components
│   └── ui/                # shadcn/ui component library
├── db/                    # Database configuration
│   ├── schema/            # Database schema definitions
│   └── migrations/        # Database migration files
├── emails/                # Email templates and utilities
│   ├── templates/         # Bakery-branded email templates
│   └── components/        # Email-specific components
└── lib/                   # Shared utilities and configurations
    ├── auth.ts            # Authentication configuration
    ├── constants/         # Bakery brand constants
    └── validations/       # Form validation schemas
```

## 👥 User Roles & Access

### Customers
- Browse bakery products and services
- Create accounts and manage profiles
- Place orders and track order history
- Send messages to the bakery
- Receive order confirmations and updates

### Bakery Staff (Admin)
- Manage customer orders and inquiries
- View and respond to customer messages
- Oversee user accounts and access
- Access administrative dashboard
- Monitor website activity and performance

## 📧 Email System

The website includes a comprehensive email system with bakery-branded templates:

- **Welcome Emails** - Greet new customers with bakery branding
- **Order Confirmations** - Professional order receipts
- **Password Reset** - Secure account recovery
- **Account Notifications** - Important account updates

All emails feature consistent Dee-licious Bakes branding and professional styling.

## 🔒 Security Features

- **Secure Authentication** - Multiple login options with session management
- **Data Protection** - Encrypted database connections and secure data handling
- **Input Validation** - Comprehensive form validation and sanitization
- **Error Monitoring** - Proactive security issue detection
- **Role-Based Access** - Proper user permission management

## 🚀 Deployment

### Production Deployment

1. **Build the Application**
   ```bash
   pnpm build
   ```

2. **Environment Variables**
   Ensure all production environment variables are configured:
   - Database connection string
   - Authentication secrets
   - Email service credentials
   - Social login credentials (if used)
   - Monitoring service keys

3. **Database Migration**
   ```bash
   pnpm db:migrate
   ```

4. **Start Production Server**
   ```bash
   pnpm start
   ```

### Recommended Hosting
- **Vercel** - Seamless Next.js deployment with automatic scaling
- **Neon** - Serverless PostgreSQL with automatic backups
- **Resend** - Reliable email delivery with excellent deliverability

## 🔧 Maintenance & Support

### Regular Maintenance Tasks

1. **Database Backups**
   - Neon provides automatic backups
   - Consider additional backup strategies for critical data

2. **Security Updates**
   - Keep dependencies updated regularly
   - Monitor Sentry for security alerts

3. **Performance Monitoring**
   - Review Vercel Analytics for performance insights
   - Monitor email delivery rates in Resend dashboard

4. **Content Updates**
   - Update product images and descriptions seasonally
   - Refresh bakery information as needed

### Support Contact

For technical support, maintenance, or feature requests:

**Scott Jones - Web Developer**  
Email: [info@wolfpackdefence.co.uk]  
Professional web development services

---

## 📄 License

This website was custom-built for Dee-licious Bakes by Scott Jones. All rights reserved.

**Client:** Deanna Jones, Dee-licious Bakes  
**Developer:** Scott Jones  
**Completion Date:** 19/07/2025

---

*This professional bakery website represents a complete digital solution tailored specifically for Dee-licious Bakes' business needs, combining modern web technology with user-friendly design to help grow the bakery's online presence and streamline customer interactions.*