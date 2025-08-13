# 🚀 Chan Dinh - AI/ML Developer Portfolio (Next.js)

A modern, responsive portfolio website built with Next.js 14, showcasing expertise in Machine Learning, Artificial Intelligence, and Software Development.

## ✨ Features

* **Modern Design**: Clean white theme with blue accents and subtle patterns
* **Responsive Layout**: Optimized for all devices and screen sizes
* **Interactive Elements**: Smooth animations and transitions using Framer Motion
* **Project Showcase**: Featured ML/AI projects with live links and GitHub repositories
* **Professional Branding**: Personal logo and custom styling
* **Contact Form**: Interactive contact form for potential clients and collaborators
* **Performance Optimized**: Built with Next.js for optimal performance and SEO
* **Admin Dashboard**: Secure content management system with JWT authentication
* **MongoDB Integration**: Dynamic content from MongoDB Atlas database
* **Skills Management**: Full CRUD operations for managing technical skills
* **Analytics Dashboard**: Vercel Analytics integration with fallback to mock data

## 🛠️ Technologies Used

* **Framework**: Next.js 14 with App Router
* **Frontend**: React 18, TypeScript
* **Styling**: Tailwind CSS with custom components
* **Animations**: Framer Motion for smooth interactions
* **Icons**: Lucide React for consistent iconography
* **Database**: MongoDB with Mongoose
* **Authentication**: JWT-based admin system
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

## 🚀 Getting Started

### Prerequisites

* Node.js 18+ 
* npm or yarn
* MongoDB Atlas account (free tier available)

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
```

## 🗄️ MongoDB Atlas Setup

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

## 📊 Analytics Dashboard

### Current Status
✅ Analytics component added to root layout  
✅ Dashboard component updated to fetch real data  
✅ API endpoint created for analytics data  
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

## 📞 Contact Form Setup

### Features
- **MongoDB Integration**: Messages saved to database
- **Input Validation**: Required fields, email format validation
- **Error Handling**: Database connection error handling
- **User Feedback**: Success/error messages
- **Form State**: Loading states during submission

### API Endpoints
- **POST** `/api/contact` - Submit contact form message
- **GET** `/api/contact` - Retrieve all messages (admin)

### Database Schema
- `name` (required): Sender's name
- `email` (required): Sender's email address
- `subject` (required): Message subject
- `message` (required): Message content
- `createdAt`: Timestamp when message was sent
- `updatedAt`: Timestamp when message was last updated

## 🗄️ Database Seeding

### Available Scripts
```bash
# Seed all data (projects, skills, about, contacts)
npm run seed

# Seed skills only (60 pre-configured skills)
npm run seed:skills
```

### Initial Data
The seeding scripts will populate your database with:
- **Projects**: Sample ML/AI projects
- **Skills**: 60 comprehensive technical skills
- **About**: Professional information
- **Contacts**: Sample contact messages

## 📁 Project Structure

```
portfolio/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard routes
│   ├── api/               # API endpoints
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
│   └── Footer.tsx         # Footer component
├── models/                 # MongoDB models
│   ├── Project.ts         # Project schema
│   ├── Skill.ts           # Skill schema
│   ├── About.ts           # About schema
│   └── Contact.ts         # Contact schema
├── lib/                    # Utility libraries
│   ├── mongodb.ts         # Database connection
│   └── s3.ts              # S3 upload utilities
├── scripts/                # Database seeding scripts
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

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

## 📱 Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet**: Responsive grid layouts
- **Desktop**: Full-featured experience with hover effects
- **Breakpoints**: Uses Tailwind's responsive utilities

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

### Debug Commands
```bash
# Check MongoDB connection
node scripts/check-skills.js

# Seed skills data
npm run seed:skills

# View database contents
# Use MongoDB Compass or mongo shell
```

## 📚 API Reference

### Authentication Endpoints
- **POST** `/api/admin/login` - Admin authentication

### Content Endpoints
- **GET/POST** `/api/projects` - Projects management
- **GET/POST** `/api/skills` - Skills management
- **GET/POST** `/api/about` - About information
- **GET/POST** `/api/contact` - Contact form
- **GET/POST** `/api/chat` - Chat functionality
- **GET/POST** `/api/analytics` - Analytics data

### File Upload
- **POST** `/api/upload` - Image upload to S3/R2

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

## 📞 Contact

* **GitHub**: [@chanadinh](https://github.com/chanadinh)
* **LinkedIn**: [Chan Dinh](https://linkedin.com/in/chandinh)
* **Email**: contact@chandinh.org
* **Website**: [chandinh.org](https://chandinh.org)

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

* Built with Next.js 14
* Styled with Tailwind CSS
* Icons from Lucide React
* Animations with Framer Motion
* Database integration with MongoDB Atlas
* Admin system with JWT authentication

---

⭐ **Star this repository if you found it helpful!**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you have any questions or need help customizing this portfolio, please open an issue on GitHub.
