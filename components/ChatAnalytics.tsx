'use client'
import styles from './portfolio/editorial.module.css';

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  MessageSquare, 
  Globe, 
  Activity, 
  TrendingUp, 
  Clock,
  Eye,
  Smartphone,
  Monitor,
  X,
  ChevronDown,
  ChevronRight,
  Maximize2
} from 'lucide-react'

interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatAnalytics {
  summary: {
    totalChats: number
    totalMessages: number
    uniqueIPs: number
    averageMessagesPerChat: number
    activeChatsToday: number
  }
  recentChats: Array<{
    sessionId: string
    userIp: string
    userAgent: string
    messageCount: number
    lastActivity: string
    isActive: boolean
    messages?: IMessage[]
    createdAt?: string
  }>
  topIPs: Array<{
    ip: string
    chatCount: number
    messageCount: number
    averageMessagesPerChat: number
  }>
  dailyStats: Array<{
    _id: string
    chatCount: number
    messageCount: number
  }>
  timestamp: string
}

export default function ChatAnalytics() {
  const [analytics, setAnalytics] = useState<ChatAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [expandedChats, setExpandedChats] = useState<Set<string>>(new Set())
  const [showChatModal, setShowChatModal] = useState(false)
  const [selectedChatData, setSelectedChatData] = useState<any>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/chat/analytics?includeMessages=true')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
    // Refresh analytics every 5 minutes
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const formatIP = (ip: string) => {
    if (ip === 'unknown' || ip === '::1') return 'Local/Unknown'
    return ip
  }

  const formatUserAgent = (userAgent: string) => {
    if (!userAgent || userAgent === 'unknown') return 'Unknown'
    if (userAgent.includes('Mobile')) return 'Mobile'
    if (userAgent.includes('Tablet')) return 'Tablet'
    return 'Desktop'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const toggleChatExpansion = (sessionId: string) => {
    const newExpanded = new Set(expandedChats)
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId)
    } else {
      newExpanded.add(sessionId)
    }
    setExpandedChats(newExpanded)
  }

  const openChatModal = (chat: any) => {
    setSelectedChatData(chat)
    setShowChatModal(true)
  }

  const fetchChatMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat?sessionId=${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        // Update the analytics state with the fetched messages
        if (analytics) {
          const updatedChats = analytics.recentChats.map(chat => 
            chat.sessionId === sessionId 
              ? { ...chat, messages: data.messages }
              : chat
          )
          setAnalytics({ ...analytics, recentChats: updatedChats })
        }
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error)
    }
  }

  if (loading) {
    return (
      <p role="status" className={styles.inlineLoading}>Loading conversation insights…</p>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error loading analytics: {error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-[#ff6248] text-[#101214] rounded-none hover:bg-[#ff806a] transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!analytics || !analytics.summary) {
    return <div className="text-center py-8">No analytics data available</div>
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#f8f5ef] p-6 rounded-none shadow-none border border-[#c9c5be]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#626663]">Total Chats</p>
              <p className="text-2xl font-bold text-[#101214]">{analytics.summary.totalChats || 0}</p>
            </div>
            <Users className="w-8 h-8 text-[#b53523]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#f8f5ef] p-6 rounded-none shadow-none border border-[#c9c5be]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#626663]">Total Messages</p>
              <p className="text-2xl font-bold text-[#101214]">{analytics.summary.totalMessages || 0}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-[#b53523]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#f8f5ef] p-6 rounded-none shadow-none border border-[#c9c5be]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#626663]">Unique IPs</p>
              <p className="text-2xl font-bold text-[#101214]">{analytics.summary.uniqueIPs || 0}</p>
            </div>
            <Globe className="w-8 h-8 text-[#b53523]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#f8f5ef] p-6 rounded-none shadow-none border border-[#c9c5be]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#626663]">Avg Messages/Chat</p>
              <p className="text-2xl font-bold text-[#101214]">{analytics.summary.averageMessagesPerChat || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#b53523]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#f8f5ef] p-6 rounded-none shadow-none border border-[#c9c5be]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#626663]">Active Today</p>
              <p className="text-2xl font-bold text-[#101214]">{analytics.summary.activeChatsToday || 0}</p>
            </div>
            <Activity className="w-8 h-8 text-[#b53523]" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Chats with Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#f8f5ef] p-6 rounded-none shadow-none border border-[#c9c5be]"
        >
          <h3 className="text-lg font-semibold text-[#101214] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#b53523]" />
            Recent Chat Sessions with Content
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {(analytics.recentChats || []).map((chat, index) => (
              <div
                key={chat.sessionId}
                className={`p-4 rounded-none border ${
                  chat.isActive ? 'border-green-200 bg-green-50' : 'border-[#c9c5be] bg-[#eeeae2]'
                }`}
              >
                {/* Chat Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#444843]">
                      {formatIP(chat.userIp)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      chat.isActive ? 'bg-green-100 text-green-800' : 'bg-[#e2ded6] text-[#626663]'
                    }`}>
                      {chat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openChatModal(chat)}
                      className="p-1 hover:bg-[#f3d3c9] rounded-none transition-colors text-[#a12e20]"
                      title="View full chat"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleChatExpansion(chat.sessionId)}
                      className="p-1 hover:bg-[#d5d0c7] rounded-none transition-colors"
                    >
                      {expandedChats.has(chat.sessionId) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Chat Info */}
                <div className="flex items-center gap-2 text-xs text-[#626663] mb-3">
                  <span>{formatUserAgent(chat.userAgent)}</span>
                  <span>•</span>
                  <span>{chat.messageCount} messages</span>
                  <span>•</span>
                  <span>Last: {formatDate(chat.lastActivity)}</span>
                </div>

                {/* Chat Messages (Expandable) */}
                {expandedChats.has(chat.sessionId) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-[#c9c5be]"
                  >
                    {!chat.messages ? (
                      <div className="text-center py-2">
                        <button
                          onClick={() => fetchChatMessages(chat.sessionId)}
                          className="px-3 py-1 bg-[#ff6248] text-[#101214] text-xs rounded-none hover:bg-[#ff806a] transition-colors"
                        >
                          Load Messages
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {chat.messages.map((message, msgIndex) => (
                          <div
                            key={msgIndex}
                            className={`p-2 rounded-none text-xs ${
                              message.role === 'user' 
                                ? 'bg-[#f3d3c9] text-[#7f281c] ml-4'
                                : 'bg-[#e2ded6] text-[#303431] mr-4'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-xs">
                                {message.role === 'user' ? '👤 User' : '🤖 Medusa'}
                              </span>
                              <span className="text-xs opacity-70">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-xs leading-relaxed break-words">
                              {message.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top IPs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#f8f5ef] p-6 rounded-none shadow-none border border-[#c9c5be]"
        >
          <h3 className="text-lg font-semibold text-[#101214] mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#b53523]" />
            Top IP Addresses
          </h3>
          <div className="space-y-3">
            {(analytics.topIPs || []).map((ip, index) => (
              <div key={ip.ip} className="flex items-center justify-between p-3 bg-[#eeeae2] rounded-none">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#444843]">
                    {index + 1}.
                  </span>
                  <div>
                    <div className="font-medium text-[#101214]">{formatIP(ip.ip)}</div>
                    <div className="text-xs text-[#626663]">
                      {ip.chatCount} chats • {ip.messageCount} messages
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-[#b53523]">
                    {ip.averageMessagesPerChat}
                  </div>
                  <div className="text-xs text-[#626663]">avg/chat</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Daily Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-[#f8f5ef] p-6 rounded-none shadow-none border border-[#c9c5be]"
      >
        <h3 className="text-lg font-semibold text-[#101214] mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#b53523]" />
          Daily Statistics (Last 7 Days)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {(analytics.dailyStats || []).map((day) => (
            <div key={day._id} className="text-center p-3 bg-[#eeeae2] rounded-none">
              <div className="text-sm font-medium text-[#101214] mb-1">
                {new Date(day._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="text-lg font-bold text-[#b53523]">{day.chatCount}</div>
              <div className="text-xs text-[#626663]">{day.messageCount} msgs</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Last Updated */}
      <div className="text-center text-sm text-[#626663]">
        Last updated: {formatDate(analytics.timestamp)}
      </div>

      {/* Chat Content Modal */}
      {showChatModal && selectedChatData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#f8f5ef] rounded-none p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">Full Chat Conversation</h3>
                <p className="text-sm text-[#626663] mt-1">
                  Session: {selectedChatData.sessionId} • IP: {formatIP(selectedChatData.userIp)} • 
                  Device: {formatUserAgent(selectedChatData.userAgent)}
                </p>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-2 hover:bg-[#e2ded6] rounded-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedChatData.messages ? (
                selectedChatData.messages.map((message: IMessage, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-none ${
                      message.role === 'user' 
                        ? 'bg-[#f3e0d9] border-l-4 border-[#b53523]'
                        : 'bg-[#eeeae2] border-l-4 border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`font-semibold ${
                        message.role === 'user' ? 'text-[#7f281c]' : 'text-[#444843]'
                      }`}>
                        {message.role === 'user' ? '👤 User' : '🤖 Medusa'}
                      </span>
                      <span className="text-sm text-[#626663]">
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[#303431] leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#626663]">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-[#a5a29b]" />
                  <p>No messages available for this chat session</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-[#c9c5be] text-sm text-[#626663]">
              <p>Session started: {selectedChatData.createdAt ? formatDate(selectedChatData.createdAt) : 'Unknown'}</p>
              <p>Last activity: {formatDate(selectedChatData.lastActivity)}</p>
              <p>Total messages: {selectedChatData.messageCount}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
