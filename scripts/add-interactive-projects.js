const { MongoClient } = require('mongodb');

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

async function addInteractiveProjects() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const projectsCollection = db.collection('projects');
    
    // Check if projects already exist
    const existingFlappy = await projectsCollection.findOne({ title: 'Flappy Ado' });
    const existingGraph = await projectsCollection.findOne({ title: 'Graphing Calculator' });
    
    if (existingFlappy) {
      console.log('⚠️ Flappy Ado project already exists');
    } else {
      // Add Flappy Ado project
      const flappyAdoProject = {
        title: 'Flappy Ado',
        description: 'An interactive Flappy Bird-style game built with React, Canvas API, and MongoDB. Features include dynamic background music that changes pitch based on player click speed, high score tracking with IP-based user identification, mobile-optimized gameplay, and a comprehensive dashboard system.',
        technologies: ['React', 'Next.js', 'TypeScript', 'Canvas API', 'MongoDB', 'Tailwind CSS', 'Framer Motion', 'Web Audio API'],
        imageUrl: '/images/ado.png', // Using existing Ado image
        githubUrl: 'https://github.com/yourusername/portfolio',
        liveUrl: '/flappyado',
        featured: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const flappyResult = await projectsCollection.insertOne(flappyAdoProject);
      console.log('✅ Added Flappy Ado project:', flappyResult.insertedId);
    }
    
    if (existingGraph) {
      console.log('⚠️ Graphing Calculator project already exists');
    } else {
      // Add Graphing Calculator project
      const graphingCalculatorProject = {
        title: 'Graphing Calculator',
        description: 'A powerful web-based graphing calculator that can plot mathematical functions, equations, and data. Features include real-time function plotting, multiple function support, zoom and pan capabilities, and a responsive design that works on all devices.',
        technologies: ['React', 'Next.js', 'TypeScript', 'Canvas API', 'Math.js', 'Tailwind CSS', 'Framer Motion'],
        imageUrl: '/images/calculator.png', // You'll need to add this image
        githubUrl: 'https://github.com/yourusername/portfolio',
        liveUrl: '/graph',
        featured: true,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const graphResult = await projectsCollection.insertOne(graphingCalculatorProject);
      console.log('✅ Added Graphing Calculator project:', graphResult.insertedId);
    }
    
    // Display all projects
    const allProjects = await projectsCollection.find({}).sort({ order: 1 }).toArray();
    console.log('\n📋 All Projects:');
    allProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (Order: ${project.order}, Featured: ${project.featured})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
addInteractiveProjects();
