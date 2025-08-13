# 🚀 Chan Dinh - AI/ML Developer Portfolio (Next.js) - Complete Documentation

A comprehensive guide covering all aspects of this modern, responsive portfolio website built with Next.js 14, showcasing expertise in Machine Learning, Artificial Intelligence, and Software Development.

---

## 📚 Table of Contents

1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Technologies Used](#️-technologies-used)
4. [Getting Started](#-getting-started)
5. [Environment Setup](#-environment-setup)
6. [Database Setup](#-database-setup)
7. [Admin System](#-admin-system)
8. [Skills Management](#-skills-management)
9. [Analytics Dashboard](#-analytics-dashboard)
10. [Contact Form & Email Setup](#-contact-form--email-setup)
11. [Chat System with IP Tracking](#-chat-system-with-ip-tracking)
12. [Logo & Asset Management](#-logo--asset-management)
13. [Project Structure](#-project-structure)
14. [Customization](#-customization)
15. [Deployment](#-deployment)
16. [Development](#-development)
17. [Troubleshooting](#-troubleshooting)
18. [API Reference](#-api-reference)
19. [Future Enhancements](#-future-enhancements)

---

## 🎯 Project Overview

A modern, responsive portfolio website built with Next.js 14, showcasing expertise in Machine Learning, Artificial Intelligence, and Software Development. The portfolio features a comprehensive admin system, dynamic content management, analytics dashboard, and advanced features like chat IP tracking and custom email integration.

## ✨ Features

* **Modern Design**: Clean white theme with blue accents and subtle patterns
* **Responsive Layout**: Optimized for all devices and screen sizes
* **Interactive Elements**: Smooth animations and transitions using Framer Motion
* **Project Showcase**: Featured ML/AI projects with live links and GitHub repositories
* **Professional Branding**: Personal logo and custom styling
* **Contact Form**: Interactive contact form with custom email domain integration
* **Performance Optimized**: Built with Next.js for optimal performance and SEO
* **Admin Dashboard**: Secure content management system with JWT authentication
* **MongoDB Integration**: Dynamic content from MongoDB Atlas database
* **Skills Management**: Full CRUD operations for managing technical skills
* **Analytics Dashboard**: Vercel Analytics integration with fallback to mock data
* **Chat System**: AI-powered chat with Medusa, featuring IP tracking and analytics
* **Custom Email**: Professional email setup with custom domain support
* **Asset Management**: Cloudflare R2 integration for logo and image hosting

## 🛠️ Technologies Used

* **Framework**: Next.js 14 with App Router
* **Frontend**: React 18, TypeScript
* **Styling**: Tailwind CSS with custom components
* **Animations**: Framer Motion for smooth interactions
* **Icons**: Lucide React for consistent iconography
* **Database**: MongoDB with Mongoose
* **Authentication**: JWT-based admin system
* **Email Services**: Resend, SendGrid, or Mailgun integration
* **Cloud Storage**: Cloudflare R2 for asset hosting
* **Deployment**: Vercel (recommended) or any hosting platform

## 🎯 Featured Projects

1. **Project Pæmon - AI Web App**  
   * Pokémon-inspired AI companion generator  
   * Won Best Personal Project at Nosu AI Hackathon ($650)  
   * Technologies: Next.js, OpenAI GPT-3.5, Stable Diffusion

2. **MNIST Digit Classifier**  
   * Machine learning for digit recognition  
   * Neural network implementation and evaluation  
   * Technologies: Python, PyTorch, Neural Networks

3. **Bike Sharing Demand Prediction**  
   * Automated ML using AutoGluon  
   * Time series forecasting expertise  
   * Technologies: Python, AutoGluon, Time Series

4. **Dog Breed Classifier**  
   * Computer vision with PyTorch  
   * CNN architecture evaluation  
   * Technologies: Python, PyTorch, Computer Vision

5. **Medusa Bot - Discord Bot**  
   * Multi-API Discord bot  
   * REST API integration and event handling  
   * Technologies: JavaScript, Node.js, Discord.js

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+ 
* npm or yarn
* MongoDB Atlas account (free tier available)
* Email service account (Resend, SendGrid, or Mailgun)
* Cloudflare R2 account (for asset hosting)

### Installation

```bash
# Clone the repository
git clone https://github.com/chanadinh/portfolio.git

# Navigate to project directory
cd portfolio

# Install dependencies
npm install

# Set up environment variables (see Environment Setup section)
# Create .env.local file

# Seed database with sample data
npm run seed

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🔧 Environment Setup

Create a `.env.local` file in your project root with the following variables:

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_key_here

# OpenAI API (for chat functionality)
OPENAI_API_KEY=your_openai_api_key_here

# Vercel Analytics (optional)
VERCEL_ANALYTICS_ID=your_analytics_id_here

# Email Service Configuration
EMAIL_SERVICE=resend  # or 'sendgrid' or 'mailgun'

# Your Custom Domain Email Addresses
CONTACT_EMAIL=contact@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com

# Email Service API Keys (choose one based on your service)
RESEND_API_KEY=your_resend_api_key_here
SENDGRID_API_KEY=your_sendgrid_api_key_here
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=yourdomain.com

# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET_NAME=your-r2-bucket-name
CLOUDFLARE_R2_PUBLIC_DOMAIN=your-r2-public-domain
```

---

## 🗄️ Database Setup

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Choose the free tier (M0)

### 2. Set Up Database
1. Click "Build a Database"
2. Choose "FREE" tier
3. Select your preferred cloud provider and region
4. Click "Create"

### 3. Configure Access
1. **Database Access**: Create a username and password
2. **Network Access**: Allow access from anywhere (for development)
3. **Get Connection String**: Copy the connection string and update your `.env.local`

### 4. Database Models

#### Projects
- `title`: Project name
- `description`: Project description
- `technologies`: Array of technologies used
- `imageUrl`: Project image URL
- `githubUrl`: GitHub repository URL
- `liveUrl`: Live demo URL
- `featured`: Boolean for featured projects
- `order`: Display order

#### Skills
- `name`: Skill name
- `category`: frontend, backend, database, devops, or other
- `proficiency`: beginner, intermediate, advanced, or expert
- `icon`: Optional icon identifier
- `order`: Display order

#### About
- `title`: Professional title
- `subtitle`: Professional subtitle
- `description`: About description
- `highlights`: Array of key highlights
- `imageUrl`: Profile image URL
- `order`: Display order

#### Contact
- `name`: Sender's name
- `email`: Sender's email address
- `subject`: Message subject
- `message`: Message content
- `createdAt`: Timestamp when message was sent
- `updatedAt`: Timestamp when message was last updated

#### Chat (NEW)
- `sessionId`: Unique chat session identifier
- `messages`: Array of chat messages with role, content, and timestamp
- `userIp`: Client IP address (for analytics and security)
- `userAgent`: Browser/device information
- `createdAt`: When chat session started
- `updatedAt`: Last activity timestamp

---

## 🔐 Admin System

### Access
- **Login**: `/login`
- **Dashboard**: `/admin`
- **Default Credentials**: `admin` / `admin123`

### Features
- Secure JWT authentication
- Protected admin routes
- Content management interface
- MongoDB data overview
- Skills management (CRUD operations)
- Projects management
- Analytics dashboard
- Chat analytics with IP tracking

### Security Setup
1. **Change default credentials** immediately in production
2. **Generate secure JWT secret**:
   ```bash
   openssl rand -base64 32
   ```
3. **Use strong passwords** (12+ characters, mixed case, symbols)
4. **Enable HTTPS** in production

### Admin Routes Protection
- **Middleware**: `middleware.ts` protects all `/admin/*` routes
- **Client-side**: `useAuth` hook manages authentication state
- **Protected Routes**: `ProtectedRoute` component for additional security

---

## 🎯 Skills Management System

### Features
- **Full CRUD Operations**: Create, Read, Update, Delete skills
- **Category Management**: Organize skills by frontend, backend, database, devops, and other
- **Proficiency Levels**: beginner, intermediate, advanced, expert
- **Ordering System**: Control the display order of skills
- **Admin Interface**: Full management through the admin dashboard

### Current Skills (60 Total)
- **Frontend** (10): React, Next.js, TypeScript, Tailwind CSS, JavaScript, HTML/CSS, Vue.js, Svelte, Redux, GraphQL
- **Backend** (10): Python, Node.js, Express.js, FastAPI, Django, Flask, Java, Spring Boot, C++, REST APIs
- **Database** (8): MongoDB, PostgreSQL, Redis, SQL, MySQL, Elasticsearch, MongoDB Atlas, Data Modeling
- **DevOps** (10): Docker, AWS, Vercel, Git, CI/CD, Kubernetes, Terraform, Jenkins, Linux, Shell Scripting
- **Other** (22): All AI/ML related - Machine Learning, Deep Learning, TensorFlow, PyTorch, Data Analysis, Computer Vision, NLP, etc.

### Skills API Endpoints
- **GET** `/api/skills` - Fetch all skills
- **POST** `/api/skills` - Create new skill
- **PUT** `/api/skills` - Update existing skill
- **DELETE** `/api/skills?id={skillId}` - Delete skill

### Managing Skills
1. **Access**: Go to `/admin` → Skills tab
2. **Add**: Click "Add Skill" button
3. **Edit**: Click pencil icon on any skill
4. **Delete**: Click trash icon with confirmation
5. **Reorder**: Change order values to control display sequence

---

## 📊 Analytics Dashboard

### Current Status
✅ Analytics component added to root layout  
✅ Dashboard component updated to fetch real data  
✅ API endpoint created for analytics data  
✅ Chat analytics with IP tracking implemented  
⚠️ **Vercel Analytics API integration needs completion**

### Setup Steps
1. **Deploy to Vercel**: `vercel deploy`
2. **Enable Web Analytics**: Go to Vercel dashboard → Analytics tab → Enable
3. **Wait 24-48 hours** for initial data collection
4. **Complete API integration** (placeholder function in API route)

### Features
- **Smart Fallback**: Gracefully switches between real and mock data
- **Clear Status**: Visual indicators show whether real analytics are active
- **Time Ranges**: 24h, 7d, 30d filtering options
- **Key Metrics**: Page views, visitors, time on site, bounce rate
- **Traffic Sources**: Referrer analysis and device types
- **Chat Analytics**: Comprehensive chat statistics with IP tracking

---

## 📞 Contact Form & Email Setup

### Features
- **MongoDB Integration**: Messages saved to database
- **Input Validation**: Required fields, email format validation
- **Error Handling**: Database connection error handling
- **User Feedback**: Success/error messages
- **Form State**: Loading states during submission
- **Custom Email Domain**: Professional email addresses
- **Instant Notifications**: Get notified immediately when someone contacts you

### Email Service Options

#### **Resend (Recommended - Free Tier)**
- **Free**: 3,000 emails/month
- **Easy Setup**: Simple API integration
- **Custom Domain**: Full support for custom domains
- **Reliable**: Enterprise-grade infrastructure

#### **SendGrid**
- **Free**: 100 emails/day
- **Popular**: Widely used service
- **Good Documentation**: Extensive guides available

#### **Mailgun**
- **Free**: 5,000 emails/month for 3 months
- **Developer Friendly**: Good API design
- **Custom Domain**: Full support

### Setup Instructions

#### **Step 1: Choose Your Email Service**
1. Sign up for your preferred email service
2. Verify your email address
3. Get your API key from the dashboard

#### **Step 2: Configure Environment Variables**
Add these to your `.env.local` file:

```bash
# Email Service Configuration
EMAIL_SERVICE=resend  # or 'sendgrid' or 'mailgun'

# Your Custom Domain Email Addresses
CONTACT_EMAIL=contact@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com

# Email Service API Keys (choose one based on your service)
RESEND_API_KEY=your_resend_api_key_here
SENDGRID_API_KEY=your_sendgrid_api_key_here
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=yourdomain.com
```

#### **Step 3: Custom Domain Email Setup**
1. In your email service dashboard, go to "Domains"
2. Add your custom domain
3. Follow the DNS setup instructions
4. Wait for DNS verification (usually 5-10 minutes)

#### **Step 4: Test Your Setup**
1. Start your development server: `npm run dev`
2. Go to your contact form
3. Submit a test message
4. Check your custom domain email for the notification

### API Endpoints
- **POST** `/api/contact` - Submit contact form message
- **GET** `/api/contact` - Retrieve all messages (admin)

### Email Templates
The system automatically creates professional email templates:

```
Subject: New Contact Form Submission - Portfolio: [User's Subject]

New Contact Form Submission

Name: [User's Name]
Email: [User's Email]
Subject: [User's Subject]
Message: [User's Message]
Timestamp: [Submission Time]

---
Sent from your portfolio contact form
```

---

## 💬 Chat System with IP Tracking

### Overview
The chat system now automatically captures and stores the IP address of users engaging in conversations with the Medusa AI assistant. This provides valuable analytics and security monitoring capabilities.

### Features

#### 1. IP Address Capture
- **Automatic Detection**: Captures client IP addresses from various HTTP headers
- **Proxy Support**: Handles forwarded IP addresses from load balancers and CDNs
- **Fallback Handling**: Gracefully handles cases where IP cannot be determined

#### 2. User Agent Tracking
- **Browser Information**: Stores user agent strings for device/browser identification
- **Device Classification**: Identifies mobile, tablet, and desktop users

#### 3. MongoDB Storage
- **Enhanced Schema**: Updated Chat model with `userIp` and `userAgent` fields
- **Indexed Fields**: IP addresses are indexed for efficient querying
- **Session Persistence**: IP information is maintained across chat sessions

### Technical Implementation

#### Database Schema Updates
```typescript
// Updated Chat model
interface IChat {
  sessionId: string;
  messages: IMessage[];
  userIp: string;        // NEW: Client IP address
  userAgent?: string;    // NEW: User agent string
  createdAt: Date;
  updatedAt: Date;
}
```

#### IP Address Detection
The system checks multiple headers in order of preference:

1. **X-Forwarded-For**: For proxy/load balancer scenarios
2. **X-Real-IP**: For reverse proxy configurations
3. **Connection Remote Address**: Direct connection fallback
4. **Default**: Returns 'unknown' if no IP can be determined

```typescript
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  // Additional fallback logic...
}
```

### API Endpoints

#### POST `/api/chat`
- Captures IP and user agent on each message
- Stores data in MongoDB with chat history
- Updates existing sessions with current IP information

#### GET `/api/chat/analytics`
- Provides comprehensive chat analytics
- Includes IP-based statistics and user behavior insights
- Real-time data with 5-minute refresh intervals

### Analytics Dashboard

#### Summary Metrics
- Total chat sessions
- Total messages exchanged
- Unique IP addresses
- Average messages per chat
- Active chats today

#### IP-Based Insights
- **Top IP Addresses**: Most active users by chat count
- **Recent Sessions**: Latest chat activity with IP details
- **Daily Statistics**: 7-day trend analysis
- **Device Classification**: Mobile vs desktop usage patterns

#### Chat Content Viewer
- **Expandable Preview**: Click chevron to see messages inline
- **Full Modal View**: Click maximize button for complete conversation
- **Message Details**: User vs AI messages with timestamps
- **Session Metadata**: IP, device, and timing information

### Security & Privacy

#### Data Protection
- IP addresses are stored for legitimate business purposes
- No personal information is extracted from IP addresses
- Data retention policies can be implemented

#### Monitoring Capabilities
- Detect unusual chat patterns
- Identify potential abuse or spam
- Monitor geographic distribution of users
- Track peak usage times

### Usage Examples

#### View Chat Analytics
1. Navigate to Admin Dashboard
2. Select "Analytics" tab
3. View "Chat Analytics" section
4. Monitor real-time statistics

#### Test IP Tracking
```bash
# Run the test script to verify IP storage
node scripts/test-chat-ip.js
```

#### Query IP Data Directly
```typescript
// Get chats from specific IP
const chats = await Chat.find({ userIp: '192.168.1.100' });

// Get IP statistics
const ipStats = await Chat.aggregate([
  { $group: { _id: '$userIp', chatCount: { $sum: 1 } } },
  { $sort: { chatCount: -1 } }
]);
```

### Configuration

#### Environment Variables
```bash
MONGODB_URI=mongodb://localhost:27017/portfolio
OPENAI_API_KEY=your_openai_key
```

#### MongoDB Indexes
```javascript
// IP address index for efficient querying
db.chats.createIndex({ "userIp": 1 })

// Session ID index (existing)
db.chats.createIndex({ "sessionId": 1 })
```

---

## 🎨 Logo & Asset Management

### What We Accomplished
1. **✅ Logo Uploaded to R2**: Successfully uploaded your logo (`public/images/logo.png`) to Cloudflare R2 bucket
2. **✅ Email Template Updated**: Modified the auto-reply email to use the R2-hosted logo
3. **✅ Configuration Centralized**: Created a centralized logo configuration for easy future updates

### Files Modified

#### `lib/email.ts`
- Added `LOGO_CONFIG` constant with R2 logo URL
- Updated auto-reply email template to use R2 logo
- Added `updateLogoUrl()` utility function for future updates

#### `scripts/upload-logo-to-r2.js` (New)
- Script to upload logo to R2 bucket
- Includes environment variable validation
- Saves upload information for reference

#### `scripts/test-email-logo.js` (New)
- Test script to verify logo integration
- Generates sample email for inspection

### R2 Logo URL
**Current Logo URL**: `https://pub-82d1a72b4d7f43a5b4a34f4664d53892.r2.dev/assets/logo-1755061334783.png`

**R2 Key**: `assets/logo-1755061334783.png`

### How to Update Logo in Future

#### Option 1: Use the Utility Function
```typescript
import { updateLogoUrl } from './lib/email';

// Update to new logo URL
updateLogoUrl('https://new-logo-url.com/logo.png', 'New Logo Alt Text');
```

#### Option 2: Manual Update
1. Upload new logo to R2 using the upload script
2. Update `LOGO_CONFIG.url` in `lib/email.ts`
3. Optionally update `LOGO_CONFIG.alt` if needed

### Testing
Run the test script to verify logo integration:
```bash
node scripts/test-email-logo.js
```

This will:
- Verify logo configuration
- Generate a sample email with logo
- Save test email to `test-email-logo.html` for inspection

### Environment Variables Required
Make sure these are set in your `.env.local`:
```
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET_NAME=your-r2-bucket-name
CLOUDFLARE_R2_PUBLIC_DOMAIN=your-r2-public-domain
```

### Email Benefits
- **Faster Loading**: Logo served from R2 CDN instead of your server
- **Better Reliability**: R2's global infrastructure ensures logo loads quickly
- **Professional Appearance**: Logo now appears in all auto-reply emails
- **Easy Updates**: Centralized configuration makes logo updates simple

### Logo Styling
The logo in the email is styled with:
- 80x80px dimensions
- Circular white background
- Subtle shadow effects
- Centered positioning in header
- Responsive design for mobile devices

---

## 📁 Project Structure

```
portfolio/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard routes
│   ├── api/               # API endpoints
│   │   ├── chat/          # Chat functionality with IP tracking
│   │   ├── chat/analytics # Chat analytics API
│   │   └── ...            # Other API endpoints
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Homepage component
├── components/             # Reusable components
│   ├── Hero.tsx           # Hero section with animations
│   ├── About.tsx          # About section
│   ├── Skills.tsx         # Skills showcase
│   ├── Projects.tsx       # Projects grid
│   ├── Contact.tsx        # Contact form and info
│   ├── Admin.tsx          # Admin dashboard
│   ├── AnalyticsDashboard.tsx # Analytics display
│   ├── ChatAnalytics.tsx  # Chat analytics with IP tracking
│   ├── MedusaChat.tsx     # AI chat interface
│   └── Footer.tsx         # Footer component
├── models/                 # MongoDB models
│   ├── Project.ts         # Project schema
│   ├── Skill.ts           # Skill schema
│   ├── About.ts           # About schema
│   ├── Contact.ts         # Contact schema
│   └── Chat.ts            # Chat schema with IP tracking
├── lib/                    # Utility libraries
│   ├── mongodb.ts         # Database connection
│   ├── email.ts           # Email configuration and utilities
│   └── s3.ts              # S3/R2 upload utilities
├── scripts/                # Database seeding and utility scripts
│   ├── test-chat-ip.js    # Test chat IP tracking
│   ├── upload-logo-to-r2.js # Logo upload to R2
│   └── ...                # Other utility scripts
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

---

## 🎨 Customization

### Colors and Theme
The portfolio uses a custom color scheme defined in `tailwind.config.js`:
- **Primary**: Blue (#3b82f6)
- **Secondary**: Dark Blue (#1e40af)
- **Background**: White with subtle patterns
- **Accents**: Blue gradients and shadows

### Adding New Projects
Edit `components/Projects.tsx` and add new projects to the `projects` array:

```typescript
{
  id: 6,
  title: "Your New Project",
  description: "Project description here",
  technologies: ["Tech1", "Tech2"],
  image: "image-url",
  github: "github-url",
  live: "live-url",
  featured: false
}
```

### Modifying Skills
1. **Access admin panel**: `/admin` → Skills tab
2. **Add new skills**: Use the "Add Skill" button
3. **Edit existing skills**: Click pencil icon
4. **Reorder skills**: Change order values
5. **Delete skills**: Click trash icon with confirmation

---

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push
4. Enable Web Analytics in Vercel dashboard

### Other Platforms
The project can be deployed to any hosting platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

---

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data
- `npm run seed:skills` - Seed skills database

### Code Quality
- ESLint configuration for code standards
- TypeScript for type safety
- Prettier for code formatting (recommended)

---

## 📱 Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet**: Responsive grid layouts
- **Desktop**: Full-featured experience with hover effects
- **Breakpoints**: Uses Tailwind's responsive utilities

---

## 🚨 Security Best Practices

### Production Deployment
1. **Change default credentials** immediately
2. **Use strong passwords** (12+ characters, mixed case, symbols)
3. **Generate random JWT secret** (32+ characters)
4. **Enable HTTPS** in production
5. **Set secure cookies** if implementing server-side sessions

### Environment Variables
1. **Never commit** `.env.local` to Git
2. **Use different credentials** for development/staging/production
3. **Rotate secrets** periodically
4. **Limit access** to admin credentials

---

## 🔍 Troubleshooting

### Common Issues

#### MongoDB Connection
- Verify connection string in `.env.local`
- Check IP whitelist in MongoDB Atlas
- Ensure username/password are correct

#### Admin Access
- Check if you're logged in
- Verify JWT token in localStorage
- Check browser console for errors

#### Skills Not Displaying
- Check MongoDB connection and data seeding
- Verify API endpoints are working
- Run `npm run seed:skills` to populate database

#### Analytics Issues
- Check if Vercel Analytics is enabled in dashboard
- Verify environment variables
- Wait 24-48 hours after enabling analytics

#### Chat IP Tracking Issues
- Check MongoDB connection and Chat model
- Verify API endpoints are working
- Run `node scripts/test-chat-ip.js` to test
- Check browser console for errors

#### Email Setup Issues
- Verify email service API keys
- Check DNS configuration for custom domain
- Test with simple email first
- Check email service dashboard for status

### Debug Commands
```bash
# Check MongoDB connection
node scripts/check-skills.js

# Seed skills data
npm run seed:skills

# Test chat IP tracking
node scripts/test-chat-ip.js

# Test email logo integration
node scripts/test-email-logo.js

# View database contents
# Use MongoDB Compass or mongo shell
```

---

## 📚 API Reference

### Authentication Endpoints
- **POST** `/api/admin/login` - Admin authentication

### Content Endpoints
- **GET/POST** `/api/projects` - Projects management
- **GET/POST** `/api/skills` - Skills management
- **GET/POST** `/api/about` - About information
- **GET/POST** `/api/contact` - Contact form
- **GET/POST** `/api/chat` - Chat functionality
- **GET** `/api/chat/analytics` - Chat analytics with IP tracking
- **GET/POST** `/api/analytics` - General analytics data

### File Upload
- **POST** `/api/upload` - Image upload to S3/R2

---

## 🔄 Future Enhancements

### Planned Features
1. **Two-factor authentication** (2FA)
2. **Session management**
3. **User roles and permissions**
4. **Audit logging**
5. **Password reset functionality**
6. **Skill icons and visual representation**
7. **Progress tracking for skills**
8. **Bulk operations for content management**
9. **Geographic IP mapping for chat analytics**
10. **Advanced threat detection for chat system**
11. **Automated abuse prevention**
12. **Enhanced privacy controls for IP data**
13. **Data export functionality for analytics**
14. **Email templates with HTML formatting**
15. **Auto-reply functionality for contact form**
16. **Email analytics and delivery tracking**
17. **Advanced spam protection**
18. **Email scheduling capabilities**

### Integration Opportunities
- Security monitoring systems
- User behavior analytics
- Geographic user insights
- Performance optimization
- Advanced email marketing tools
- Security and compliance platforms

---

## 📞 Contact

* **GitHub**: [@chanadinh](https://github.com/chanadinh)
* **LinkedIn**: [Chan Dinh](https://linkedin.com/in/chandinh)
* **Email**: contact@chandinh.org
* **Website**: [chandinh.org](https://chandinh.org)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

* Built with Next.js 14
* Styled with Tailwind CSS
* Icons from Lucide React
* Animations with Framer Motion
* Database integration with MongoDB Atlas
* Admin system with JWT authentication
* Chat system with OpenAI integration
* Email services (Resend, SendGrid, Mailgun)
* Cloud storage with Cloudflare R2

---

⭐ **Star this repository if you found it helpful!**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you have any questions or need help customizing this portfolio, please open an issue on GitHub.

---

## 📋 Complete Feature Checklist

### Core Portfolio Features
- [x] Modern, responsive design
- [x] Project showcase with live links
- [x] Skills management system
- [x] About section with professional info
- [x] Contact form with validation
- [x] Smooth animations and transitions

### Admin System
- [x] JWT-based authentication
- [x] Protected admin routes
- [x] Content management interface
- [x] Skills CRUD operations
- [x] Projects management
- [x] Contact messages viewing

### Database Integration
- [x] MongoDB Atlas connection
- [x] Mongoose models and schemas
- [x] Database seeding scripts
- [x] API endpoints for all models
- [x] Error handling and validation

### Analytics & Monitoring
- [x] Vercel Analytics integration
- [x] Fallback to mock data
- [x] Chat analytics with IP tracking
- [x] User behavior insights
- [x] Real-time data updates

### Chat System
- [x] AI-powered chat with Medusa
- [x] IP address tracking
- [x] User agent detection
- [x] Session management
- [x] Chat analytics dashboard
- [x] Message content viewing

### Email Integration
- [x] Custom domain email setup
- [x] Multiple email service support
- [x] Professional email templates
- [x] Instant notifications
- [x] Spam protection

### Asset Management
- [x] Cloudflare R2 integration
- [x] Logo hosting and management
- [x] Image upload system
- [x] CDN optimization

### Security Features
- [x] JWT authentication
- [x] Protected routes
- [x] Input validation
- [x] Rate limiting
- [x] Secure environment variables

---

**Last Updated**: December 2024  
**Status**: ✅ Complete and Production Ready  
**Version**: 2.0.0 - Enhanced with Chat IP Tracking, Custom Email, and Asset Management
