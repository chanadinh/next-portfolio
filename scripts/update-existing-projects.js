const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Define Project schema
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

async function updateExistingProjects() {
  try {
    console.log('🔍 Updating existing projects with placeholder images...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    const Project = mongoose.model('Project', ProjectSchema);
    
    // Find projects without imageUrl
    const projectsWithoutImages = await Project.find({ imageUrl: { $exists: false } });
    console.log(`📊 Found ${projectsWithoutImages.length} projects without images:\n`);
    
    // Placeholder images (you can replace these with actual project images later)
    const placeholderImages = [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d3080a35?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop'
    ];
    
    for (let i = 0; i < projectsWithoutImages.length; i++) {
      const project = projectsWithoutImages[i];
      const placeholderImage = placeholderImages[i % placeholderImages.length];
      
      console.log(`🖼️  Updating "${project.title}" with placeholder image...`);
      
      await Project.findByIdAndUpdate(project._id, {
        imageUrl: placeholderImage,
        updatedAt: new Date()
      });
      
      console.log(`✅ Updated project: ${project.title}`);
    }
    
    console.log('\n🎉 All projects updated successfully!');
    
    // Show final status
    const allProjects = await Project.find({});
    console.log(`\n📊 Final status: ${allProjects.length} total projects`);
    
    allProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} - ${project.imageUrl ? '✅ Has Image' : '❌ No Image'}`);
    });
    
  } catch (error) {
    console.error('❌ Error updating projects:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

updateExistingProjects();
