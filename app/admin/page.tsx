'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Plus, Edit, Trash2, X, Save, MessageCircle } from 'lucide-react';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';
import ChatAnalytics from '../../components/ChatAnalytics';
import EditorialShell, { PageIntro } from '../../components/portfolio/EditorialShell';
import styles from '../../components/portfolio/editorial.module.css';
import ProjectManager from '../../components/admin/ProjectManager';
import ProfileManager from '../../components/admin/ProfileManager';
import LoadingScreen from '../../components/portfolio/LoadingScreen';

interface Skill {
  _id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'other';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  order: number;
}

interface PersonalInfo {
  _id: string;
  hobbies: string[];
  favoriteAnime: string[];
  favoriteShows: string[];
  waifu: string[];
  favoriteGames: string[];
  favoriteMusic: string[];
  otherInterests: string[];
  updatedAt: string;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'profile' | 'skills' | 'personal-info' | 'analytics' | 'messages'>('projects');
  
  // Skills management states
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showEditSkill, setShowEditSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: '',
    category: 'backend',
    proficiency: 'intermediate',
    order: 0
  });

  // Personal info management states
  const [showEditPersonalInfo, setShowEditPersonalInfo] = useState(false);
  const [editingPersonalInfo, setEditingPersonalInfo] = useState<PersonalInfo | null>(null);
  const [newPersonalInfo, setNewPersonalInfo] = useState<Partial<PersonalInfo>>({
    hobbies: [],
    favoriteAnime: [],
    favoriteShows: [],
    waifu: [],
    favoriteGames: [],
    favoriteMusic: [],
    otherInterests: []
  });
  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof PersonalInfo>('hobbies');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      const headers = {
        'Content-Type': 'application/json'
      };

      const [skillsRes, messagesRes, personalInfoRes] = await Promise.all([
        fetch('/api/skills', { headers }),
        fetch('/api/contact', { headers }),
        fetch('/api/personal-info', { headers })
      ]);

      if (skillsRes.ok) setSkills(await skillsRes.json());
      if (messagesRes.ok) setMessages(await messagesRes.json());
      if (personalInfoRes.ok) setPersonalInfo(await personalInfoRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Fetch error details:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Skills management functions
  const handleAddSkill = async () => {
    try {

      if (!newSkill.name || !newSkill.category || !newSkill.proficiency) {
        alert('Please fill in all required fields');
        return;
      }

      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSkill)
      });

      if (response.ok) {
        await fetchData();
        setShowAddSkill(false);
        setNewSkill({
          name: '',
          category: 'backend',
          proficiency: 'intermediate',
          order: 0
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create skill');
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleEditSkill = async () => {
    if (!editingSkill) return;
    
    try {

      if (!editingSkill.name || !editingSkill.category || !editingSkill.proficiency) {
        alert('Please fill in all required fields');
        return;
      }

      const response = await fetch('/api/skills', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingSkill)
      });

      if (response.ok) {
        await fetchData();
        setShowEditSkill(false);
        setEditingSkill(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update skill');
      }
    } catch (error) {
      console.error('Error updating skill:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    try {

      const response = await fetch(`/api/skills?id=${skillId}`, {
        method: 'DELETE',
        headers: {
        }
      });

      if (response.ok) {
        await fetchData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete skill');
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error: ${errorMessage}`);
    }
  };

  // Personal info management functions
  const handleAddPersonalInfo = async () => {
    try {

      const response = await fetch('/api/personal-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPersonalInfo)
      });

      if (response.ok) {
        const createdInfo = await response.json();
        console.log('✅ Personal info created successfully:', createdInfo);
        await fetchData();
        setShowEditPersonalInfo(false);
        setNewPersonalInfo({
          hobbies: [],
          favoriteAnime: [],
          favoriteShows: [],
          waifu: [],
          favoriteGames: [],
          favoriteMusic: [],
          otherInterests: []
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create personal info');
      }
    } catch (error) {
      console.error('Error adding personal info:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleEditPersonalInfo = async () => {
    if (!editingPersonalInfo) return;
    
    try {

      const response = await fetch(`/api/personal-info/${editingPersonalInfo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingPersonalInfo)
      });

      if (response.ok) {
        const updatedInfo = await response.json();
        console.log('✅ Personal info updated successfully:', updatedInfo);
        await fetchData();
        setShowEditPersonalInfo(false);
        setEditingPersonalInfo(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update personal info');
      }
    } catch (error) {
      console.error('Error updating personal info:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error: ${errorMessage}`);
    }
  };

  const addItemToCategory = () => {
    if (newItem.trim()) {
      if (editingPersonalInfo) {
        setEditingPersonalInfo(prev => prev ? {
          ...prev,
          [selectedCategory]: [...(prev[selectedCategory] as string[]), newItem.trim()]
        } : null);
      } else {
        setNewPersonalInfo(prev => ({
          ...prev,
          [selectedCategory]: [...(prev[selectedCategory] as string[] || []), newItem.trim()]
        }));
      }
      setNewItem('');
    }
  };

  const removeItemFromCategory = (category: keyof PersonalInfo, item: string) => {
    if (editingPersonalInfo) {
      setEditingPersonalInfo(prev => prev ? {
        ...prev,
        [category]: (prev[category] as string[]).filter(i => i !== item)
      } : null);
    } else {
      setNewPersonalInfo(prev => ({
        ...prev,
        [category]: (prev[category] as string[] || []).filter(i => i !== item)
      }));
    }
  };

  if (loading) {
    return <LoadingScreen context="dashboard" />;
  }

  return (
    <EditorialShell>
      <main id="page-content" className={styles.container}>
        <PageIntro label="Private workspace / chandinh.dev" title="Portfolio studio.">Give the next chapter a little attention. Curate your work, update your profile, and see who is stopping by.</PageIntro>
        <div className={styles.paper}>
          <div className={styles.workspace}>
            <p>Your story, kept current.</p>
            <button
              onClick={async () => {
                const result = await fetch('/api/admin/logout', { method: 'POST' });
                if (result.ok) { localStorage.removeItem('adminToken'); window.location.assign('/login'); }
              }}
              className={styles.secondary}
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
          
          <nav className={styles.tabs} aria-label="Workspace sections">
            {(['projects', 'profile', 'skills', 'personal-info', 'analytics', 'messages'] as const).map(tab => (
              <button key={tab} type="button" aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)}>
                {tab === 'personal-info' ? 'Personal info' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          {/* Content Sections */}
          {activeTab === 'projects' && <ProjectManager />}
          {activeTab === 'profile' && <ProfileManager />}

          {activeTab === 'skills' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#101214]">Skills</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                  <span className="text-sm text-[#626663] text-center sm:text-left">{skills.length} skills</span>
                  <button
                    onClick={() => setShowAddSkill(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#ff6248] hover:bg-[#ff806a] text-[#101214] rounded-none transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div key={skill._id} className="border border-[#c9c5be] rounded-none p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#101214]">{skill.name}</h3>
                        <p className="text-sm text-[#626663] capitalize">{skill.category}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-none ${
                            skill.proficiency === 'expert' ? 'bg-green-100 text-green-800' :
                            skill.proficiency === 'advanced' ? 'bg-[#f3d3c9] text-[#7f281c]' :
                            skill.proficiency === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-[#e2ded6] text-[#303431]'
                          }`}>
                            {skill.proficiency}
                          </span>
                          <span className="text-xs text-[#626663]">Order: {skill.order}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          aria-label={`Edit ${skill.name}`}
                          onClick={() => {
                            setEditingSkill(skill);
                            setShowEditSkill(true);
                          }}
                          className="p-1 text-[#a12e20] hover:text-[#7f281c]"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          aria-label={`Delete ${skill.name}`}
                          onClick={() => handleDeleteSkill(skill._id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'personal-info' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#101214]">Personal Information</h2>
                <button
                  onClick={() => {
                    if (personalInfo) {
                      setEditingPersonalInfo(personalInfo);
                    } else {
                      setEditingPersonalInfo(null);
                    }
                    setShowEditPersonalInfo(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#ff6248] hover:bg-[#ff806a] text-[#101214] rounded-none transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                  {personalInfo ? 'Edit Personal Info' : 'Add Personal Info'}
                </button>
              </div>
              
              {personalInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="border border-[#c9c5be] rounded-none p-6">
                    <h3 className="text-lg font-semibold text-[#101214] mb-4 flex items-center gap-2">
                      🎯 Hobbies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {personalInfo.hobbies.length > 0 ? (
                        personalInfo.hobbies.map((hobby, index) => (
                          <span key={index} className="px-3 py-1 bg-[#f3d3c9] text-[#7f281c] text-sm rounded-none">
                            {hobby}
                          </span>
                        ))
                      ) : (
                        <p className="text-[#626663] text-sm">No hobbies added yet</p>
                      )}
                    </div>
                  </div>

                  <div className="border border-[#c9c5be] rounded-none p-6">
                    <h3 className="text-lg font-semibold text-[#101214] mb-4 flex items-center gap-2">
                      🎌 Favorite Anime
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {personalInfo.favoriteAnime.length > 0 ? (
                        personalInfo.favoriteAnime.map((anime, index) => (
                          <span key={index} className="px-3 py-1 bg-[#e2ded6] text-[#444843] text-sm rounded-none">
                            {anime}
                          </span>
                        ))
                      ) : (
                        <p className="text-[#626663] text-sm">No anime added yet</p>
                      )}
                    </div>
                  </div>

                  <div className="border border-[#c9c5be] rounded-none p-6">
                    <h3 className="text-lg font-semibold text-[#101214] mb-4 flex items-center gap-2">
                      📺 Favorite Shows
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {personalInfo.favoriteShows.length > 0 ? (
                        personalInfo.favoriteShows.map((show, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-none">
                            {show}
                          </span>
                        ))
                      ) : (
                        <p className="text-[#626663] text-sm">No shows added yet</p>
                      )}
                    </div>
                  </div>

                  <div className="border border-[#c9c5be] rounded-none p-6">
                    <h3 className="text-lg font-semibold text-[#101214] mb-4 flex items-center gap-2">
                      💕 Waifu
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {personalInfo.waifu.length > 0 ? (
                        personalInfo.waifu.map((waifu, index) => (
                          <span key={index} className="px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-none">
                            {waifu}
                          </span>
                        ))
                      ) : (
                        <p className="text-[#626663] text-sm">No waifu added yet</p>
                      )}
                    </div>
                  </div>

                  <div className="border border-[#c9c5be] rounded-none p-6">
                    <h3 className="text-lg font-semibold text-[#101214] mb-4 flex items-center gap-2">
                      🎮 Favorite Games
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {personalInfo.favoriteGames.length > 0 ? (
                        personalInfo.favoriteGames.map((game, index) => (
                          <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-none">
                            {game}
                          </span>
                          ))
                        ) : (
                          <p className="text-[#626663] text-sm">No games added yet</p>
                        )}
                    </div>
                  </div>

                  <div className="border border-[#c9c5be] rounded-none p-6">
                    <h3 className="text-lg font-semibold text-[#101214] mb-4 flex items-center gap-2">
                      🎵 Favorite Music
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {personalInfo.favoriteMusic.length > 0 ? (
                        personalInfo.favoriteMusic.map((music, index) => (
                          <span key={index} className="px-3 py-1 bg-[#e2ded6] text-[#444843] text-sm rounded-none">
                            {music}
                          </span>
                        ))
                      ) : (
                        <p className="text-[#626663] text-sm">No music added yet</p>
                      )}
                    </div>
                  </div>

                  <div className="border border-[#c9c5be] rounded-none p-6 md:col-span-2">
                    <h3 className="text-lg font-semibold text-[#101214] mb-4 flex items-center gap-2">
                      🌟 Other Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {personalInfo.otherInterests.length > 0 ? (
                        personalInfo.otherInterests.map((interest, index) => (
                          <span key={index} className="px-3 py-1 bg-[#e2ded6] text-[#303431] text-sm rounded-none">
                            {interest}
                          </span>
                        ))
                      ) : (
                        <p className="text-[#626663] text-sm">No other interests added yet</p>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2 text-center text-sm text-[#626663]">
                    Last updated: {new Date(personalInfo.updatedAt).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-[#a5a29b] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#101214] mb-2">No personal information yet</h3>
                  <p className="text-[#626663] mb-4">Add your hobbies, favorite anime, shows, and more!</p>
                  <button
                    onClick={() => setShowEditPersonalInfo(true)}
                    className="px-6 py-3 bg-[#ff6248] hover:bg-[#ff806a] text-[#101214] rounded-none transition-colors duration-200"
                  >
                    Add Personal Info
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6 md:space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#101214] mb-4 md:mb-6">General Analytics</h2>
                <AnalyticsDashboard />
              </div>
              
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#101214] mb-4 md:mb-6">Chat Analytics</h2>
                <ChatAnalytics />
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#101214]">Contact Messages</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                  <span className="text-sm text-[#626663] text-center sm:text-left">{messages.length} messages</span>
                  <button
                    onClick={() => fetchData()}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-[#34373a] text-white rounded-none transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
              
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-[#a5a29b] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#101214] mb-2">No messages yet</h3>
                  <p className="text-[#626663]">Contact form submissions will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message._id} className="border border-[#c9c5be] rounded-none p-4 md:p-6 hover:shadow-none transition-shadow duration-200">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-semibold text-[#101214]">{message.subject}</h3>
                          <p className="text-[#626663] mt-1">
                            From: <span className="font-medium">{message.name}</span> ({message.email})
                          </p>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto">
                          <p className="text-xs text-[#626663]">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-[#767a76]">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-[#eeeae2] rounded-none p-3 md:p-4">
                        <p className="text-[#444843] whitespace-pre-wrap text-sm md:text-base">{message.message}</p>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-[#c9c5be]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-[#626663]">
                          <span>Message ID: {message._id}</span>
                          <span>Last updated: {new Date(message.updatedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

      {/* Add Skill Modal */}
      {showAddSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#f8f5ef] rounded-none p-4 sm:p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Add New Skill</h3>
              <button
                aria-label="Close dialog"
                onClick={() => setShowAddSkill(false)}
                className="p-2 hover:bg-[#e2ded6] rounded-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#444843] mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border border-[#a5a29b] rounded-none focus:ring-2 focus:ring-[#b53523] focus:border-[#b53523]"
                  placeholder="e.g., React, Python, AWS"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#444843] mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full p-2 border border-[#a5a29b] rounded-none focus:ring-2 focus:ring-[#b53523] focus:border-[#b53523]"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="devops">DevOps</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#444843] mb-1">Proficiency Level</label>
                <select
                  value={newSkill.proficiency}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, proficiency: e.target.value as any }))}
                  className="w-full p-2 border border-[#a5a29b] rounded-none focus:ring-2 focus:ring-[#b53523] focus:border-[#b53523]"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#444843] mb-1">Order</label>
                <input
                  type="number"
                  value={newSkill.order}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="w-full p-2 border border-[#a5a29b] rounded-none focus:ring-2 focus:ring-[#b53523] focus:border-[#b53523]"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddSkill(false)}
                className="px-4 py-2 text-[#626663] hover:text-[#303431]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-[#ff6248] text-[#101214] rounded-none hover:bg-[#ff806a] flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Create Skill
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Skill Modal */}
      {showEditSkill && editingSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#f8f5ef] rounded-none p-4 sm:p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Edit Skill</h3>
              <button
                aria-label="Close dialog"
                onClick={() => setShowEditSkill(false)}
                className="p-2 hover:bg-[#e2ded6] rounded-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#444843] mb-1">Skill Name</label>
                <input
                  type="text"
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full p-2 border border-[#a5a29b] rounded-none focus:ring-2 focus:ring-[#b53523] focus:border-[#b53523]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#444843] mb-1">Category</label>
                <select
                  value={editingSkill.category}
                  onChange={(e) => setEditingSkill(prev => prev ? { ...prev, category: e.target.value as any } : null)}
                  className="w-full p-2 border border-[#a5a29b] rounded-none focus:ring-2 focus:ring-[#b53523] focus:border-[#b53523]"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="devops">DevOps</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#444843] mb-1">Proficiency Level</label>
                <select
                  value={editingSkill.proficiency}
                  onChange={(e) => setEditingSkill(prev => prev ? { ...prev, proficiency: e.target.value as any } : null)}
                  className="w-full p-2 border border-[#a5a29b] rounded-none focus:ring-2 focus:ring-[#b53523] focus:border-[#b53523]"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#444843] mb-1">Order</label>
                <input
                  type="number"
                  value={editingSkill.order}
                  onChange={(e) => setEditingSkill(prev => prev ? { ...prev, order: parseInt(e.target.value) || 0 } : null)}
                  className="w-full p-2 border border-[#a5a29b] rounded-none focus:ring-2 focus:ring-[#b53523] focus:border-[#b53523]"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditSkill(false)}
                className="px-4 py-2 text-[#626663] hover:text-[#303431]"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSkill}
                className="px-4 py-2 bg-[#ff6248] text-[#101214] rounded-none hover:bg-[#ff806a] flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Personal Info Modal */}
      {showEditPersonalInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#f8f5ef] rounded-none p-4 sm:p-6 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start sm:items-center mb-6">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold">
                  {editingPersonalInfo ? 'Edit Personal Information' : 'Add Personal Information'}
                </h3>
                <p className="text-xs sm:text-sm text-[#626663] mt-1">Manage your hobbies, favorite anime, shows, and more!</p>
              </div>
              <button
                onClick={() => {
                  setShowEditPersonalInfo(false);
                  setEditingPersonalInfo(null);
                  setNewPersonalInfo({
                    hobbies: [],
                    favoriteAnime: [],
                    favoriteShows: [],
                    waifu: [],
                    favoriteGames: [],
                    favoriteMusic: [],
                    otherInterests: []
                  });
                }}
                className="p-2 hover:bg-[#e2ded6] rounded-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Hobbies */}
              <div className="space-y-3">
                <h4 className="font-medium text-[#101214]">🎯 Hobbies</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedCategory === 'hobbies' ? newItem : ''}
                    onChange={(e) => {
                      setSelectedCategory('hobbies');
                      setNewItem(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && addItemToCategory()}
                    placeholder="Add hobby"
                    className="flex-1 p-2 border border-[#a5a29b] rounded-none focus:ring-2 focus:ring-[#b53523] focus:border-[#b53523]"
                  />
                  <button
                    onClick={addItemToCategory}
                    className="px-3 py-2 bg-[#ff6248] text-[#101214] rounded-none hover:bg-[#ff806a]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(editingPersonalInfo?.hobbies || newPersonalInfo.hobbies || []).map((hobby, index) => (
                    <span key={index} className="px-3 py-1 bg-[#f3d3c9] text-[#7f281c] text-sm rounded-none flex items-center gap-1">
                      {hobby}
                      <button
                        onClick={() => removeItemFromCategory('hobbies', hobby)}
                        className="text-[#a12e20] hover:text-[#7f281c]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Favorite Anime */}
              <div className="space-y-3">
                <h4 className="font-medium text-[#101214]">🎌 Favorite Anime</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedCategory === 'favoriteAnime' ? newItem : ''}
                    onChange={(e) => {
                      setSelectedCategory('favoriteAnime');
                      setNewItem(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && addItemToCategory()}
                    placeholder="Add anime"
                    className="flex-1 p-2 border border-[#a5a29b] rounded-none focus:ring-2 focus:ring-[#b53523] focus:border-[#b53523]"
                  />
                  <button
                    onClick={addItemToCategory}
                    className="px-3 py-2 bg-[#ff6248] text-[#101214] rounded-none hover:bg-[#ff806a]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(editingPersonalInfo?.favoriteAnime || newPersonalInfo.favoriteAnime || []).map((anime, index) => (
                    <span key={index} className="px-3 py-1 bg-[#e2ded6] text-[#444843] text-sm rounded-none flex items-center gap-1">
                      {anime}
                      <button
                        onClick={() => removeItemFromCategory('favoriteAnime', anime)}
                        className="text-[#626663] hover:text-[#444843]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Favorite Shows */}
              <div className="space-y-3">
                <h4 className="font-medium text-[#101214]">📺 Favorite Shows</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedCategory === 'favoriteShows' ? newItem : ''}
                    onChange={(e) => {
                      setSelectedCategory('favoriteShows');
                      setNewItem(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && addItemToCategory()}
                    placeholder="Add show"
                    className="flex-1 p-2 border border-[#a5a29b] rounded-none focus:ring-2 focus:ring-[#b53523] focus:border-[#b53523]"
                  />
                  <button
                    onClick={addItemToCategory}
                    className="px-3 py-2 bg-[#ff6248] text-[#101214] rounded-none hover:bg-[#ff806a]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(editingPersonalInfo?.favoriteShows || newPersonalInfo.favoriteShows || []).map((show, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-none flex items-center gap-1">
                      {show}
                      <button
                        onClick={() => removeItemFromCategory('favoriteShows', show)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Waifu */}
              <div className="space-y-3">
                <h4 className="font-medium text-[#101214]">💕 Waifu</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedCategory === 'waifu' ? newItem : ''}
                    onChange={(e) => {
                      setSelectedCategory('waifu');
                      setNewItem(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && addItemToCategory()}
                    placeholder="Add waifu"
                    className="flex-1 p-2 border border-[#a5a29b] rounded-none focus:ring-2 focus:ring-[#b53523] focus:border-[#b53523]"
                  />
                  <button
                    onClick={addItemToCategory}
                    className="px-3 py-2 bg-[#ff6248] text-[#101214] rounded-none hover:bg-[#ff806a]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(editingPersonalInfo?.waifu || newPersonalInfo.waifu || []).map((waifu, index) => (
                    <span key={index} className="px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-none flex items-center gap-1">
                      {waifu}
                      <button
                        onClick={() => removeItemFromCategory('waifu', waifu)}
                        className="text-pink-600 hover:text-pink-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Favorite Games */}
              <div className="space-y-3">
                <h4 className="font-medium text-[#101214]">🎮 Favorite Games</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedCategory === 'favoriteGames' ? newItem : ''}
                    onChange={(e) => {
                      setSelectedCategory('favoriteGames');
                      setNewItem(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && addItemToCategory()}
                    placeholder="Add game"
                    className="flex-1 p-2 border border-[#a5a29b] rounded-none focus:ring-2 focus:ring-[#b53523] focus:border-[#b53523]"
                  />
                  <button
                    onClick={addItemToCategory}
                    className="px-3 py-2 bg-[#ff6248] text-[#101214] rounded-none hover:bg-[#ff806a]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(editingPersonalInfo?.favoriteGames || newPersonalInfo.favoriteGames || []).map((game, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-none flex items-center gap-1">
                      {game}
                      <button
                        onClick={() => removeItemFromCategory('favoriteGames', game)}
                        className="text-orange-600 hover:text-orange-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Favorite Music */}
              <div className="space-y-3">
                <h4 className="font-medium text-[#101214]">🎵 Favorite Music</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedCategory === 'favoriteMusic' ? newItem : ''}
                    onChange={(e) => {
                      setSelectedCategory('favoriteMusic');
                      setNewItem(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && addItemToCategory()}
                    placeholder="Add music"
                    className="flex-1 p-2 border border-[#a5a29b] rounded-none focus:ring-2 focus:ring-[#b53523] focus:border-[#b53523]"
                  />
                  <button
                    onClick={addItemToCategory}
                    className="px-3 py-2 bg-[#ff6248] text-[#101214] rounded-none hover:bg-[#ff806a]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(editingPersonalInfo?.favoriteMusic || newPersonalInfo.favoriteMusic || []).map((music, index) => (
                    <span key={index} className="px-3 py-1 bg-[#e2ded6] text-[#444843] text-sm rounded-none flex items-center gap-1">
                      {music}
                      <button
                        onClick={() => removeItemFromCategory('favoriteMusic', music)}
                        className="text-[#626663] hover:text-[#444843]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Other Interests */}
              <div className="space-y-3 col-span-1 md:col-span-2">
                <h4 className="font-medium text-[#101214]">🌟 Other Interests</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedCategory === 'otherInterests' ? newItem : ''}
                    onChange={(e) => {
                      setSelectedCategory('otherInterests');
                      setNewItem(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && addItemToCategory()}
                    placeholder="Add interest"
                    className="flex-1 p-2 border border-[#a5a29b] rounded-none focus:ring-2 focus:ring-[#b53523] focus:border-[#b53523]"
                  />
                  <button
                    onClick={addItemToCategory}
                    className="px-3 py-2 bg-[#ff6248] text-[#101214] rounded-none hover:bg-[#ff806a]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(editingPersonalInfo?.otherInterests || newPersonalInfo.otherInterests || []).map((interest, index) => (
                    <span key={index} className="px-3 py-1 bg-[#e2ded6] text-[#303431] text-sm rounded-none flex items-center gap-1">
                      {interest}
                      <button
                        onClick={() => removeItemFromCategory('otherInterests', interest)}
                        className="text-[#626663] hover:text-[#303431]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditPersonalInfo(false);
                  setEditingPersonalInfo(null);
                  setNewPersonalInfo({
                    hobbies: [],
                    favoriteAnime: [],
                    favoriteShows: [],
                    waifu: [],
                    favoriteGames: [],
                    favoriteMusic: [],
                    otherInterests: []
                  });
                }}
                className="px-4 py-2 text-[#626663] hover:text-[#303431]"
              >
                Cancel
              </button>
              <button
                onClick={editingPersonalInfo ? handleEditPersonalInfo : handleAddPersonalInfo}
                className="px-4 py-2 bg-[#ff6248] text-[#101214] rounded-none hover:bg-[#ff806a] flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingPersonalInfo ? 'Save Changes' : 'Create Personal Info'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
        </div>
      </main>
    </EditorialShell>
  );
}
