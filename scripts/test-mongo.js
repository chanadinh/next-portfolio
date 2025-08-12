const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Define Project schema for testing
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  technologies: [{
    type: String,
    required: true,
    trim: true
  }],
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  liveUrl: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

async function testMongoDB() {
  try {
    console.log('🔍 Testing MongoDB connection...\n');
    
    // Check MongoDB URI
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('❌ MONGODB_URI not found in environment variables');
      return;
    }
    
    console.log('📋 MongoDB URI:', mongoUri.substring(0, 50) + '...');
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Create test project
    const Project = mongoose.model('Project', ProjectSchema);
    
    const testProject = {
      title: 'Test Project',
      description: 'This is a test project for MongoDB verification',
      technologies: ['Test', 'MongoDB'],
      imageUrl: 'https://example.com/test-image.jpg',
      githubUrl: 'https://github.com/test',
      liveUrl: 'https://test-project.com',
      featured: false,
      order: 0
    };
    
    console.log('\n📝 Creating test project...');
    const createdProject = await Project.create(testProject);
    console.log('✅ Test project created successfully!');
    console.log('📊 Project ID:', createdProject._id);
    console.log('📊 Project Title:', createdProject.title);
    
    // Fetch all projects
    console.log('\n📥 Fetching all projects...');
    const allProjects = await Project.find({});
    console.log(`✅ Found ${allProjects.length} projects in database`);
    
    // Clean up test project
    console.log('\n🧹 Cleaning up test project...');
    await Project.findByIdAndDelete(createdProject._id);
    console.log('✅ Test project deleted successfully!');
    
    console.log('\n🎉 MongoDB test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing MongoDB:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testMongoDB();
