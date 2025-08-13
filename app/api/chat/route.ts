import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Chat from '../../../models/Chat'
import { connectToDatabase } from '../../../lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { messages, sessionId } = await request.json()

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY
    
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Prepare messages for OpenAI API
    const openaiMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }))

    // Fetch personal information to enhance context
    let personalInfo: any = null;
    try {
      const { db } = await connectToDatabase();
      personalInfo = await db.collection('personalInfo').findOne({}, { sort: { updatedAt: -1 } });
      if (personalInfo) {
        console.log('✅ Personal info loaded for chat context');
      }
    } catch (error) {
      console.log('⚠️ Could not fetch personal info for chat context:', error);
      // Continue without personal info - not critical for chat functionality
    }

    // Build dynamic system message with personal context
    let systemContent = `You are Medusa, an AI assistant created by Chan Dinh. You're knowledgeable about AI, machine learning, software development, and technology. Be helpful, friendly, and professional. Keep responses concise but informative.

Chan Dinh is an AI/ML Developer and Software Engineer with expertise in:
- Machine learning algorithms and neural networks
- Full-stack development (frontend and backend)
- Data engineering and ETL processes
- Performance optimization and scalability
- Cloud solutions (AWS) and DevOps
- Computer vision and natural language processing

He's passionate about building intelligent applications and pushing the boundaries of what's possible with AI and machine learning.

Additional context:
- Location: Casselberry, FL
- Contact: contact@chandinh.org
- LinkedIn: linkedin.com/in/chandinh
- GitHub: github.com/chanadinh
- Website: chandinh.org`;

    if (personalInfo) {
      systemContent += `\n\nHere's what I know about Chan Dinh personally:`;
      
      if (personalInfo.hobbies && personalInfo.hobbies.length > 0) {
        systemContent += `\n- Hobbies: ${personalInfo.hobbies.join(', ')}`;
      }
      
      if (personalInfo.favoriteAnime && personalInfo.favoriteAnime.length > 0) {
        systemContent += `\n- Favorite Anime: ${personalInfo.favoriteAnime.join(', ')}`;
      }
      
      if (personalInfo.favoriteShows && personalInfo.favoriteShows.length > 0) {
        systemContent += `\n- Favorite Shows: ${personalInfo.favoriteShows.join(', ')}`;
      }
      
      if (personalInfo.waifu && personalInfo.waifu.length > 0) {
        systemContent += `\n- Waifu: ${personalInfo.waifu.join(', ')}`;
      }
      
      if (personalInfo.favoriteGames && personalInfo.favoriteGames.length > 0) {
        systemContent += `\n- Favorite Games: ${personalInfo.favoriteGames.join(', ')}`;
      }
      
      if (personalInfo.favoriteMusic && personalInfo.favoriteMusic.length > 0) {
        systemContent += `\n- Favorite Music: ${personalInfo.favoriteMusic.join(', ')}`;
      }
      
      if (personalInfo.otherInterests && personalInfo.otherInterests.length > 0) {
        systemContent += `\n- Other Interests: ${personalInfo.otherInterests.join(', ')}`;
      }
      
      systemContent += `\n\nUse this personal information to provide more personalized and relevant responses when users ask about Chan Dinh's interests, preferences, or personal life. You can reference these details to make conversations more engaging and authentic.

When appropriate, you can:
- Share personal insights about his hobbies and interests
- Recommend anime, shows, games, or music based on his preferences
- Make connections between his personal interests and professional work
- Show enthusiasm for topics he's passionate about
- Be conversational and friendly while maintaining professionalism`;
    }

    // Add system message for context
    const systemMessage = {
      role: 'system',
      content: systemContent
    }

    const apiMessages = [systemMessage, ...openaiMessages]

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: apiMessages,
        max_tokens: 500,
        temperature: 0.7,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const assistantMessage = data.choices[0]?.message?.content

    if (!assistantMessage) {
      throw new Error('No response from OpenAI')
    }

    // Save chat history to MongoDB
    const chatData = {
      sessionId: sessionId || `session_${Date.now()}`,
      messages: [
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date()
        })),
        {
          role: 'assistant',
          content: assistantMessage,
          timestamp: new Date()
        }
      ]
    }

    // Find existing chat session or create new one
    let chat = await Chat.findOne({ sessionId: chatData.sessionId })
    
    if (chat) {
      // Update existing chat
      chat.messages = chatData.messages
      await chat.save()
    } else {
      // Create new chat
      chat = new Chat(chatData)
      await chat.save()
    }

    return NextResponse.json({ 
      message: assistantMessage,
      sessionId: chatData.sessionId
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    // Return a fallback response if there's an error
    return NextResponse.json(
      { 
        message: "I'm sorry, I'm having trouble connecting right now. Please try again later or check your OpenAI API configuration." 
      },
      { status: 200 }
    )
  }
}

// GET endpoint to retrieve chat history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await connectDB()

    // Find chat session
    const chat = await Chat.findOne({ sessionId })
    
    if (!chat) {
      return NextResponse.json({ messages: [] })
    }

    return NextResponse.json({ 
      messages: chat.messages,
      sessionId: chat.sessionId
    })

  } catch (error) {
    console.error('Get chat history error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve chat history' },
      { status: 500 }
    )
  }
}
