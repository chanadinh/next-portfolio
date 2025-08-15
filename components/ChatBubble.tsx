'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2, ChevronUp, ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // OpenAI API integration
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const botMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or check your OpenAI API key.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsMinimized(false)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed top-24 right-6 z-50"
      >
        <button
          onClick={toggleChat}
          className="w-16 h-16 bg-black hover:bg-gray-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-32 right-6 z-50 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-black to-gray-700 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                    <Image
                      src="/medusa.ico"
                      alt="Medusa Bot Avatar"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">MedusaChat</h3>
                    <p className="text-xs text-gray-200">AI Assistant</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMinimize}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={toggleChat}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Content */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Messages */}
                  <div className="h-80 overflow-y-auto p-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-400 mt-16">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden">
                          <Image
                            src="/medusa.ico"
                            alt="Medusa Bot"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm">Start chatting with Medusa!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((message, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs px-3 py-2 rounded-2xl shadow-sm ${
                              message.role === 'user' 
                                ? 'bg-black text-white' 
                                : 'bg-white border border-gray-200 text-gray-800'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                {message.role === 'user' ? (
                                  <User className="w-3 h-3" />
                                ) : (
                                  <div className="w-3 h-3 rounded-full overflow-hidden">
                                    <Image
                                      src="/medusa.ico"
                                      alt="Medusa"
                                      width={12}
                                      height={12}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <span className="text-xs font-medium">
                                  {message.role === 'user' ? 'You' : 'Medusa'}
                                </span>
                                <span className="text-xs opacity-70">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed break-words">
                                {message.content}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                        
                        {loading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                          >
                            <div className="bg-white border border-gray-200 px-3 py-2 rounded-2xl shadow-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full overflow-hidden">
                                  <Image
                                    src="/medusa.ico"
                                    alt="Medusa"
                                    width={12}
                                    height={12}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-800">Medusa</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Loader2 className="w-3 h-3 animate-spin text-black" />
                                <span className="text-xs text-gray-600">Typing...</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        disabled={loading}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    
                    {/* API Status */}
                    <div className="mt-2 text-center">
                      <p className="text-xs text-gray-500">
                        💡 Powered by OpenAI GPT
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
