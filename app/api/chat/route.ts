import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Chat from '../../../models/Chat'

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

    // Add system message for context
    const systemMessage = {
      role: 'system',
      content: `You are Medusa, an AI assistant created by Chan Dinh. You're knowledgeable about AI, machine learning, software development, and technology. Be helpful, friendly, and professional. Keep responses concise but informative.`
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
