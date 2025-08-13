const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

async function testChatIPStorage() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the Chat model
    const Chat = mongoose.model('Chat', new mongoose.Schema({
      sessionId: String,
      messages: [{
        role: String,
        content: String,
        timestamp: Date
      }],
      userIp: String,
      userAgent: String,
      createdAt: Date,
      updatedAt: Date
    }));

    // Query recent chats to see IP storage
    console.log('\n📊 Recent Chat Sessions with IP Addresses:');
    const recentChats = await Chat.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('sessionId userIp userAgent createdAt messageCount')
      .lean();

    if (recentChats.length === 0) {
      console.log('❌ No chat sessions found in database');
      return;
    }

    recentChats.forEach((chat, index) => {
      console.log(`\n${index + 1}. Session: ${chat.sessionId}`);
      console.log(`   IP: ${chat.userIp || 'Not stored'}`);
      console.log(`   User Agent: ${chat.userAgent || 'Not stored'}`);
      console.log(`   Created: ${new Date(chat.createdAt).toLocaleString()}`);
      console.log(`   Messages: ${chat.messages?.length || 0}`);
    });

    // Get IP statistics
    console.log('\n🌐 IP Address Statistics:');
    const ipStats = await Chat.aggregate([
      { $group: { _id: '$userIp', chatCount: { $sum: 1 } } },
      { $sort: { chatCount: -1 } },
      { $limit: 10 }
    ]);

    ipStats.forEach((stat, index) => {
      console.log(`${index + 1}. ${stat._id || 'Unknown IP'}: ${stat.chatCount} chats`);
    });

    // Get total counts
    const totalChats = await Chat.countDocuments();
    const uniqueIPs = await Chat.distinct('userIp').then(ips => ips.length);
    const totalMessages = await Chat.aggregate([
      { $unwind: '$messages' },
      { $count: 'total' }
    ]).then(result => result[0]?.total || 0);

    console.log('\n📈 Summary:');
    console.log(`Total Chat Sessions: ${totalChats}`);
    console.log(`Unique IP Addresses: ${uniqueIPs}`);
    console.log(`Total Messages: ${totalMessages}`);
    console.log(`Average Messages per Chat: ${totalChats > 0 ? (totalMessages / totalChats).toFixed(2) : 0}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the test
testChatIPStorage();
