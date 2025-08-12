const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Define Project schema for checking
const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  technologies: [String],
  imageUrl: String,
  githubUrl: String,
  liveUrl: String,
  featured: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
});

async function checkProjects() {
  try {
    console.log('🔍 Checking existing projects in database...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Get all projects
    const Project = mongoose.model('Project', ProjectSchema);
    const projects = await Project.find({}).sort({ createdAt: -1 });
    
    console.log(`📊 Found ${projects.length} projects:\n`);
    
    projects.forEach((project, index) => {
      console.log(`--- Project ${index + 1} ---`);
      console.log(`ID: ${project._id}`);
      console.log(`Title: ${project.title}`);
      console.log(`Description: ${project.description?.substring(0, 50)}...`);
      console.log(`Image URL: ${project.imageUrl || '❌ MISSING'}`);
      console.log(`Technologies: ${project.technologies?.join(', ') || 'None'}`);
      console.log(`Featured: ${project.featured}`);
      console.log(`Order: ${project.order}`);
      console.log(`Created: ${project.createdAt}`);
      console.log(`Updated: ${project.updatedAt}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error checking projects:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkProjects();
