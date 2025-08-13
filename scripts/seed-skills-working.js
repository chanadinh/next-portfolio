const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const initialSkills = [
  // Frontend Skills
  {
    name: 'React',
    category: 'frontend',
    proficiency: 'expert',
    order: 1
  },
  {
    name: 'Next.js',
    category: 'frontend',
    proficiency: 'expert',
    order: 2
  },
  {
    name: 'TypeScript',
    category: 'frontend',
    proficiency: 'advanced',
    order: 3
  },
  {
    name: 'Tailwind CSS',
    category: 'frontend',
    proficiency: 'advanced',
    order: 4
  },
  {
    name: 'JavaScript',
    category: 'frontend',
    proficiency: 'expert',
    order: 5
  },
  {
    name: 'HTML/CSS',
    category: 'frontend',
    proficiency: 'expert',
    order: 6
  },
  {
    name: 'Vue.js',
    category: 'frontend',
    proficiency: 'intermediate',
    order: 7
  },
  {
    name: 'Svelte',
    category: 'frontend',
    proficiency: 'beginner',
    order: 8
  },
  {
    name: 'Redux',
    category: 'frontend',
    proficiency: 'advanced',
    order: 9
  },
  {
    name: 'GraphQL',
    category: 'frontend',
    proficiency: 'intermediate',
    order: 10
  },

  // Backend Skills
  {
    name: 'Python',
    category: 'backend',
    proficiency: 'expert',
    order: 11
  },
  {
    name: 'Node.js',
    category: 'backend',
    proficiency: 'advanced',
    order: 12
  },
  {
    name: 'Express.js',
    category: 'backend',
    proficiency: 'advanced',
    order: 13
  },
  {
    name: 'FastAPI',
    category: 'backend',
    proficiency: 'advanced',
    order: 14
  },
  {
    name: 'Django',
    category: 'backend',
    proficiency: 'intermediate',
    order: 15
  },
  {
    name: 'Flask',
    category: 'backend',
    proficiency: 'advanced',
    order: 16
  },
  {
    name: 'Java',
    category: 'backend',
    proficiency: 'intermediate',
    order: 17
  },
  {
    name: 'Spring Boot',
    category: 'backend',
    proficiency: 'beginner',
    order: 18
  },
  {
    name: 'C++',
    category: 'backend',
    proficiency: 'intermediate',
    order: 19
  },
  {
    name: 'REST APIs',
    category: 'backend',
    proficiency: 'expert',
    order: 20
  },

  // Database Skills
  {
    name: 'MongoDB',
    category: 'database',
    proficiency: 'advanced',
    order: 21
  },
  {
    name: 'PostgreSQL',
    category: 'database',
    proficiency: 'intermediate',
    order: 22
  },
  {
    name: 'Redis',
    category: 'database',
    proficiency: 'intermediate',
    order: 23
  },
  {
    name: 'SQL',
    category: 'database',
    proficiency: 'advanced',
    order: 24
  },
  {
    name: 'MySQL',
    category: 'database',
    proficiency: 'intermediate',
    order: 25
  },
  {
    name: 'Elasticsearch',
    category: 'database',
    proficiency: 'beginner',
    order: 26
  },
  {
    name: 'MongoDB Atlas',
    category: 'database',
    proficiency: 'advanced',
    order: 27
  },
  {
    name: 'Data Modeling',
    category: 'database',
    proficiency: 'advanced',
    order: 28
  },

  // DevOps Skills
  {
    name: 'Docker',
    category: 'devops',
    proficiency: 'advanced',
    order: 29
  },
  {
    name: 'AWS',
    category: 'devops',
    proficiency: 'intermediate',
    order: 30
  },
  {
    name: 'Vercel',
    category: 'devops',
    proficiency: 'advanced',
    order: 31
  },
  {
    name: 'Git',
    category: 'devops',
    proficiency: 'expert',
    order: 32
  },
  {
    name: 'CI/CD',
    category: 'devops',
    proficiency: 'intermediate',
    order: 33
  },
  {
    name: 'Kubernetes',
    category: 'devops',
    proficiency: 'beginner',
    order: 34
  },
  {
    name: 'Terraform',
    category: 'devops',
    proficiency: 'beginner',
    order: 35
  },
  {
    name: 'Jenkins',
    category: 'devops',
    proficiency: 'beginner',
    order: 36
  },
  {
    name: 'Linux',
    category: 'devops',
    proficiency: 'advanced',
    order: 37
  },
  {
    name: 'Shell Scripting',
    category: 'devops',
    proficiency: 'intermediate',
    order: 38
  },

  // AI/ML & Other Skills
  {
    name: 'Machine Learning',
    category: 'other',
    proficiency: 'expert',
    order: 39
  },
  {
    name: 'Deep Learning',
    category: 'other',
    proficiency: 'advanced',
    order: 40
  },
  {
    name: 'TensorFlow',
    category: 'other',
    proficiency: 'advanced',
    order: 41
  },
  {
    name: 'PyTorch',
    category: 'other',
    proficiency: 'advanced',
    order: 42
  },
  {
    name: 'Data Analysis',
    category: 'other',
    proficiency: 'expert',
    order: 43
  },
  {
    name: 'Computer Vision',
    category: 'other',
    proficiency: 'advanced',
    order: 44
  },
  {
    name: 'Natural Language Processing',
    category: 'other',
    proficiency: 'advanced',
    order: 45
  },
  {
    name: 'Scikit-learn',
    category: 'other',
    proficiency: 'advanced',
    order: 46
  },
  {
    name: 'Pandas',
    category: 'other',
    proficiency: 'expert',
    order: 47
  },
  {
    name: 'NumPy',
    category: 'other',
    proficiency: 'expert',
    order: 48
  },
  {
    name: 'Matplotlib',
    category: 'other',
    proficiency: 'advanced',
    order: 49
  },
  {
    name: 'Seaborn',
    category: 'other',
    proficiency: 'intermediate',
    order: 50
  },
  {
    name: 'Jupyter Notebooks',
    category: 'other',
    proficiency: 'expert',
    order: 51
  },
  {
    name: 'Data Visualization',
    category: 'other',
    proficiency: 'advanced',
    order: 52
  },
  {
    name: 'Statistical Analysis',
    category: 'other',
    proficiency: 'advanced',
    order: 53
  },
  {
    name: 'A/B Testing',
    category: 'other',
    proficiency: 'intermediate',
    order: 54
  },
  {
    name: 'Model Deployment',
    category: 'other',
    proficiency: 'advanced',
    order: 55
  },
  {
    name: 'MLOps',
    category: 'other',
    proficiency: 'intermediate',
    order: 56
  },
  {
    name: 'Feature Engineering',
    category: 'other',
    proficiency: 'advanced',
    order: 57
  },
  {
    name: 'Hyperparameter Tuning',
    category: 'other',
    proficiency: 'advanced',
    order: 58
  },
  {
    name: 'Ensemble Methods',
    category: 'other',
    proficiency: 'advanced',
    order: 59
  },
  {
    name: 'Neural Networks',
    category: 'other',
    proficiency: 'expert',
    order: 60
  }
];

async function seedSkillsWorking() {
  try {
    console.log('🚀 Starting working skills seeding process...\n');
    
    // Check MongoDB URI
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('❌ MONGODB_URI not found in environment variables');
      return;
    }
    
    console.log('📋 MongoDB URI:', mongoUri.substring(0, 50) + '...');
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Check database name
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 Database name: ${dbName}`);
    
    // Get the skills collection directly
    const skillsCollection = mongoose.connection.db.collection('skills');
    
    // Check existing skills
    console.log('\n🔍 Checking existing skills...');
    const existingCount = await skillsCollection.countDocuments({});
    console.log(`📊 Found ${existingCount} existing skills`);
    
    // Clear existing skills
    if (existingCount > 0) {
      console.log('🧹 Clearing existing skills...');
      const deleteResult = await skillsCollection.deleteMany({});
      console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing skills`);
    }
    
    // Insert new skills using the collection directly
    console.log('\n📝 Inserting new skills...');
    console.log(`📋 Preparing to insert ${initialSkills.length} skills...`);
    
    // Add timestamps to each skill
    const skillsWithTimestamps = initialSkills.map(skill => ({
      ...skill,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Insert all skills at once
    const insertResult = await skillsCollection.insertMany(skillsWithTimestamps);
    console.log(`✅ Successfully inserted ${insertResult.insertedIds.length} skills!`);
    
    // Verify skills were actually saved
    console.log('\n🔍 Verifying skills in database...');
    const finalCount = await skillsCollection.countDocuments({});
    console.log(`📊 Final skills count in database: ${finalCount}`);
    
    if (finalCount !== initialSkills.length) {
      console.warn(`⚠️  Warning: Expected ${initialSkills.length} skills but found ${finalCount} in database`);
    } else {
      console.log('✅ Skills count matches expected amount!');
    }
    
    // Display skills by category
    console.log('\n📋 Skills by category:');
    
    const categories = ['frontend', 'backend', 'database', 'devops', 'other'];
    for (const category of categories) {
      const categorySkills = await skillsCollection.find({ category }).sort({ order: 1 }).toArray();
      console.log(`\n${category.toUpperCase()} (${categorySkills.length} skills):`);
      categorySkills.forEach(skill => {
        console.log(`  - ${skill.name} (${skill.proficiency})`);
      });
    }
    
    // Test that we can actually retrieve the skills
    console.log('\n🔍 Testing skill retrieval...');
    const sampleSkills = await skillsCollection.find({}).limit(5).toArray();
    console.log('📝 Sample retrieved skills:');
    sampleSkills.forEach(skill => {
      console.log(`  - ${skill.name} (${skill.category}, ${skill.proficiency})`);
    });
    
    console.log('\n🎉 Skills seeding completed successfully!');
    console.log('💡 Your portfolio should now display all 60 skills!');
    
  } catch (error) {
    console.error('❌ Error seeding skills:', error.message);
    console.error('Error details:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seedSkillsWorking();
