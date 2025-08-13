import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import Chat from '../../../../models/Chat'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeMessages = searchParams.get('includeMessages') === 'true'
    
    // Connect to MongoDB
    await connectDB()

    // Get analytics data
    const [
      totalChats,
      totalMessages,
      uniqueIPs,
      recentChats,
      topIPs,
      dailyStats
    ] = await Promise.all([
      // Total number of chat sessions
      Chat.countDocuments(),
      
      // Total number of messages across all chats
      Chat.aggregate([
        { $unwind: '$messages' },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0),
      
      // Count unique IP addresses
      Chat.distinct('userIp').then(ips => ips.length),
      
      // Recent chat sessions (last 10)
      Chat.find()
        .sort({ updatedAt: -1 })
        .limit(10)
        .select(includeMessages ? 'sessionId userIp userAgent updatedAt messages createdAt' : 'sessionId userIp userAgent updatedAt messages createdAt')
        .lean(),
      
      // Top IP addresses by chat count
      Chat.aggregate([
        { $group: { _id: '$userIp', chatCount: { $sum: 1 }, messageCount: { $sum: { $size: '$messages' } } } },
        { $sort: { chatCount: -1 } },
        { $limit: 10 }
      ]),
      
      // Daily statistics for the last 7 days
      Chat.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
        { $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          chatCount: { $sum: 1 },
          messageCount: { $sum: { $size: '$messages' } }
        }},
        { $sort: { _id: 1 } }
      ])
    ])

    // Format recent chats for better readability
    const formattedRecentChats = recentChats.map(chat => ({
      sessionId: chat.sessionId || 'unknown',
      userIp: chat.userIp || 'unknown',
      userAgent: chat.userAgent || 'unknown',
      messageCount: chat.messages?.length || 0,
      lastActivity: chat.updatedAt,
      createdAt: chat.createdAt,
      messages: includeMessages ? chat.messages : undefined,
      isActive: chat.updatedAt && Date.now() - new Date(chat.updatedAt).getTime() < 24 * 60 * 60 * 1000 // Active within 24 hours
    }))

    // Format top IPs
    const formattedTopIPs = topIPs.map(ip => ({
      ip: ip._id || 'unknown',
      chatCount: ip.chatCount || 0,
      messageCount: ip.messageCount || 0,
      averageMessagesPerChat: ip.chatCount > 0 ? Math.round((ip.messageCount / ip.chatCount) * 100) / 100 : 0
    }))

    // Calculate additional statistics
    const averageMessagesPerChat = totalChats > 0 ? Math.round((totalMessages / totalChats) * 100) / 100 : 0
    const activeChatsToday = recentChats.filter(chat => 
      chat.updatedAt && Date.now() - new Date(chat.updatedAt).getTime() < 24 * 60 * 60 * 1000
    ).length

    return NextResponse.json({
      summary: {
        totalChats,
        totalMessages,
        uniqueIPs,
        averageMessagesPerChat,
        activeChatsToday
      },
      recentChats: formattedRecentChats,
      topIPs: formattedTopIPs,
      dailyStats,
      timestamp: new Date().toISOString(),
      includeMessages
    })

  } catch (error) {
    console.error('Chat analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve chat analytics' },
      { status: 500 }
    )
  }
}
