const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function simpleSkillsTest() {
  try {
    console.log('🔍 Simple skills creation test...\n');
    
    // Check MongoDB URI
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('❌ MONGODB_URI not found in environment variables');
      return;
    }
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Check initial skills count
    const skillsCollection = mongoose.connection.db.collection('skills');
    const initialCount = await skillsCollection.countDocuments({});
    console.log(`📊 Initial skills count: ${initialCount}`);
    
    // Create a simple skill
    console.log('\n📝 Creating a simple skill...');
    
    const simpleSkill = {
      name: 'Simple Test Skill',
      category: 'test',
      proficiency: 'beginner',
      order: 1001,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert the skill
    const result = await skillsCollection.insertOne(simpleSkill);
    console.log(`✅ Skill created with ID: ${result.insertedId}`);
    
    // Check skills count after creation
    const afterCount = await skillsCollection.countDocuments({});
    console.log(`📊 Skills count after creation: ${afterCount}`);
    
    // Verify the skill exists
    const createdSkill = await skillsCollection.findOne({ _id: result.insertedId });
    if (createdSkill) {
      console.log(`✅ Skill verified: ${createdSkill.name} (${createdSkill.category})`);
    } else {
      console.log('❌ Skill not found after creation');
    }
    
    // List all skills
    console.log('\n📝 All skills in collection:');
    const allSkills = await skillsCollection.find({}).toArray();
    allSkills.forEach(skill => {
      console.log(`  - ${skill.name} (${skill.category}, ${skill.proficiency})`);
    });
    
    // Keep the skill for now (don't delete it)
    console.log('\n💾 Skill kept in database for verification');
    
  } catch (error) {
    console.error('❌ Error in simple skills test:', error.message);
  } finally {
    // Don't disconnect - keep connection open to verify data persists
    console.log('\n🔌 Connection kept open for verification');
  }
}

simpleSkillsTest();
