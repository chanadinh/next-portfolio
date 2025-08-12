# MongoDB Atlas Integration Setup Guide

This guide will help you set up MongoDB Atlas integration for your Next.js portfolio project.

## Prerequisites

- MongoDB Atlas account (free tier available)
- Node.js and npm installed
- Your Next.js project set up

## Step 1: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Choose the free tier (M0)

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Select "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

## Step 2: Configure Environment Variables

1. **Create `.env.local` file** in your project root:
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

2. **Replace placeholders**:
   - `<username>`: Your MongoDB Atlas username
   - `<password>`: Your MongoDB Atlas password
   - `<cluster>`: Your cluster name
   - `<database>`: Your database name (e.g., `portfolio`)

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Seed Your Database

1. **Run the seeding script**:
```bash
npm run seed
```

This will populate your database with:
- Sample projects
- Sample skills
- Sample about information

## Step 5: Start Development Server

```bash
npm run dev
```

Your portfolio will now fetch data from MongoDB Atlas!

## Database Models

### Projects
- `title`: Project name
- `description`: Project description
- `technologies`: Array of technologies used
- `imageUrl`: Project image URL
- `githubUrl`: GitHub repository URL
- `liveUrl`: Live demo URL
- `featured`: Boolean for featured projects
- `order`: Display order

### Skills
- `name`: Skill name
- `category`: frontend, backend, database, devops, or other
- `proficiency`: beginner, intermediate, advanced, or expert
- `icon`: Optional icon identifier
- `order`: Display order

### About
- `title`: Professional title
- `subtitle`: Professional subtitle
- `description`: About description
- `highlights`: Array of key highlights
- `imageUrl`: Profile image URL
- `order`: Display order

## API Endpoints

- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Create new project
- `GET /api/skills` - Fetch all skills
- `POST /api/skills` - Create new skill
- `GET /api/about` - Fetch about information
- `POST /api/about` - Create about information

## Customization

1. **Modify sample data** in `scripts/seed-data.ts`
2. **Update components** to display your data
3. **Add new fields** to models as needed
4. **Create new API endpoints** for additional functionality

## Troubleshooting

### Connection Issues
- Verify your connection string is correct
- Check that your IP is whitelisted
- Ensure username/password are correct

### Data Not Loading
- Check browser console for errors
- Verify API endpoints are working
- Check MongoDB Atlas logs

### Build Issues
- Ensure all dependencies are installed
- Check TypeScript compilation
- Verify import paths are correct

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for sensitive data
- Consider implementing authentication for admin operations
- Use MongoDB Atlas security features (IP whitelisting, etc.)

## Next Steps

- Add authentication for admin panel
- Implement CRUD operations for content management
- Add image upload functionality
- Create admin dashboard for content management
- Add analytics and monitoring

## Support

If you encounter issues:
1. Check MongoDB Atlas documentation
2. Review Next.js API routes documentation
3. Check browser console for errors
4. Verify database connection and data
