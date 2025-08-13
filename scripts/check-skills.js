const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Import the actual Skill model
let Skill;
try {
  // Try to import the compiled JavaScript version
  const SkillModule = require('../models/Skill.js');
  Skill = SkillModule.default || SkillModule;
  console.log('✅ Skill model imported successfully');
} catch (importError) {
  console.log('⚠️  Could not import Skill model, using fallback schema');
  // Fallback to basic schema
  const SkillSchema = new mongoose.Schema({
    name: String,
    category: String,
    proficiency: String,
    order: Number,
    createdAt: Date,
    updatedAt: Date
  });
  Skill = mongoose.model('Skill', SkillSchema);
}

async function checkSkills() {
  try {
    console.log('🔍 Checking skills in MongoDB...\n');
    
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
    
    // Check skills collection
    // Skill is already defined above
    
    // Count total skills
    const totalSkills = await Skill.countDocuments({});
    console.log(`📊 Total skills in database: ${totalSkills}`);
    
    if (totalSkills === 0) {
      console.log('❌ No skills found in database!');
      
      // Check if the collection exists
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('\n📋 Available collections:');
      collections.forEach(col => {
        console.log(`  - ${col.name}`);
      });
      
    } else {
      // Show some sample skills
      console.log('\n📝 Sample skills:');
      const sampleSkills = await Skill.find({}).limit(10).sort({ order: 1 });
      sampleSkills.forEach(skill => {
        console.log(`  - ${skill.name} (${skill.category}, ${skill.proficiency})`);
      });
      
      // Show skills by category
      console.log('\n📊 Skills by category:');
      const categories = await Skill.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      
      categories.forEach(cat => {
        console.log(`  - ${cat._id}: ${cat.count} skills`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking skills:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkSkills();
