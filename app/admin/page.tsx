'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Settings, User, Code, Briefcase, Plus, Edit, Trash2, X, Save, BarChart3 } from 'lucide-react';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
}

interface Skill {
  _id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'other';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  order: number;
}

interface About {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  order: number;
}

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'about' | 'analytics'>('projects');
  
  // Project management states
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    technologies: [],
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    order: 0
  });
  const [newTechnology, setNewTechnology] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [projectsRes, skillsRes, aboutRes] = await Promise.all([
        fetch('/api/projects', { headers }),
        fetch('/api/skills', { headers }),
        fetch('/api/about', { headers })
      ]);

      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (skillsRes.ok) setSkills(await skillsRes.json());
      if (aboutRes.ok) setAbout(await aboutRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Fetch error details:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image file first');
      return;
    }

    try {
      setUploading(true);
      console.log('📤 Uploading image to R2...');

      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        const imageUrl = uploadData.imageUrl;
        
        // Update the form with the uploaded image URL
        setNewProject(prev => ({ ...prev, imageUrl }));
        console.log('✅ Image uploaded to R2:', imageUrl);
        alert('Image uploaded successfully! You can now add the project.');
      } else {
        const errorData = await uploadResponse.json();
        console.error('❌ Upload failed:', errorData);
        throw new Error('Failed to upload image to R2');
      }
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Upload Error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddProject = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      // Validate required fields
      if (!newProject.title || !newProject.description) {
        alert('Please fill in title and description');
        return;
      }

      if (!newProject.imageUrl) {
        alert('Please upload an image first');
        return;
      }

      setUploading(true);

      // Create project with the already uploaded image URL
      const projectData = {
        ...newProject,
        technologies: newProject.technologies || []
      };

      console.log('📝 Creating project with data:', projectData);

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const createdProject = await response.json();
        console.log('✅ Project created successfully:', createdProject);
        await fetchData();
        setShowAddProject(false);
        setNewProject({
          title: '',
          description: '',
          technologies: [],
          imageUrl: '',
          githubUrl: '',
          liveUrl: '',
          featured: false,
          order: 0
        });
        setSelectedFile(null);
      } else {
        const errorData = await response.json();
        console.error('❌ Project creation failed:', errorData);
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error('❌ Error adding project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleImageUploadForEdit = async () => {
    if (!selectedFile) {
      alert('Please select an image file first');
      return;
    }

    try {
      setUploading(true);
      console.log('📤 Uploading new image for project edit...');

      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        const imageUrl = uploadData.imageUrl;
        
        // Update the editing project with the new image URL
        setEditingProject(prev => prev ? { ...prev, imageUrl } : null);
        console.log('✅ New image uploaded to R2:', imageUrl);
        alert('New image uploaded successfully! You can now save the project changes.');
      } else {
        const errorData = await uploadResponse.json();
        console.error('❌ Upload failed:', errorData);
        throw new Error('Failed to upload new image to R2');
      }
    } catch (error) {
      console.error('❌ Error uploading new image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Upload Error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEditProject = async () => {
    if (!editingProject) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      // Validate required fields
      if (!editingProject.title || !editingProject.description) {
        alert('Please fill in title and description');
        return;
      }

      setUploading(true);

      // Update project data (image should already be uploaded if selected)
      const response = await fetch(`/api/projects/${editingProject._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingProject)
      });

      if (response.ok) {
        const updatedProject = await response.json();
        console.log('✅ Project updated successfully:', updatedProject);
        await fetchData();
        setShowEditProject(false);
        setEditingProject(null);
        setSelectedFile(null);
      } else {
        const errorData = await response.json();
        console.error('❌ Project update failed:', errorData);
        throw new Error('Failed to update project');
      }
    } catch (error) {
      console.error('❌ Error updating project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Delete error details:', errorMessage);
    }
  };

  const addTechnology = () => {
    if (newTechnology.trim() && !newProject.technologies?.includes(newTechnology.trim())) {
      setNewProject(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (tech: string) => {
    setNewProject(prev => ({
      ...prev,
      technologies: prev.technologies?.filter(t => t !== tech) || []
    }));
  };

  const addTechnologyToEdit = () => {
    if (newTechnology.trim() && !editingProject?.technologies.includes(newTechnology.trim())) {
      setEditingProject(prev => prev ? {
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      } : null);
      setNewTechnology('');
    }
  };

  const removeTechnologyFromEdit = (tech: string) => {
    setEditingProject(prev => prev ? {
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    } : null);
  };

  // Skills management functions
  const handleAddSkill = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      if (!newSkill.name || !newSkill.category || !newSkill.proficiency) {
        alert('Please fill in all required fields');
        return;
      }

      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      if (!editingSkill.name || !editingSkill.category || !editingSkill.proficiency) {
        alert('Please fill in all required fields');
        return;
      }

      const response = await fetch('/api/skills', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
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
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch(`/api/skills?id=${skillId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Admin</h1>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                window.location.href = '/login';
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
            {(['projects', 'skills', 'about', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'analytics' ? (
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </div>
                ) : (
                  tab.charAt(0).toUpperCase() + tab.slice(1)
                )}
              </button>
            ))}
          </div>

          {/* Content Sections */}
          {activeTab === 'projects' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{projects.length} projects</span>
                  <button
                    onClick={() => setShowAddProject(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex gap-4">
                      {project.imageUrl && (
                        <div className="flex-shrink-0">
                          <img 
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-24 h-24 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.technologies.map((tech, index) => (
                                <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-4 mt-2 text-xs text-gray-500">
                              {project.githubUrl && <span>GitHub: {project.githubUrl}</span>}
                              {project.liveUrl && <span>Live: {project.liveUrl}</span>}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {project.featured && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                Featured
                              </span>
                            )}
                            <span className="text-xs text-gray-500">Order: {project.order}</span>
                            <button
                              onClick={() => {
                                setEditingProject(project);
                                setShowEditProject(true);
                              }}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project._id)}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Skills</h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{skills.length} skills</span>
                  <button
                    onClick={() => setShowAddSkill(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div key={skill._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{skill.category}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            skill.proficiency === 'expert' ? 'bg-green-100 text-green-800' :
                            skill.proficiency === 'advanced' ? 'bg-blue-100 text-blue-800' :
                            skill.proficiency === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {skill.proficiency}
                          </span>
                          <span className="text-xs text-gray-500">Order: {skill.order}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setEditingSkill(skill);
                            setShowEditSkill(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
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

          {activeTab === 'about' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">About</h2>
                <span className="text-sm text-gray-500">1 section</span>
              </div>
              {about && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{about.title}</h3>
                  <p className="text-gray-600 mb-4">{about.subtitle}</p>
                  <p className="text-gray-700 mb-4">{about.description}</p>
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Highlights:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {about.highlights.map((highlight, index) => (
                        <li key={index} className="text-gray-600">{highlight}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-sm text-gray-500">
                    Image: {about.imageUrl} | Order: {about.order}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard />
          )}
        </motion.div>
      </div>

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">Add New Project</h3>
                <p className="text-sm text-gray-600 mt-1">Step 1: Upload image to R2 • Step 2: Create project</p>
              </div>
              <button
                onClick={() => setShowAddProject(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  {selectedFile && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                      <button
                        onClick={handleImageUpload}
                        disabled={uploading}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
                      >
                        {uploading ? 'Uploading...' : '📤 Upload Image to R2'}
                      </button>
                    </div>
                  )}
                  {newProject.imageUrl && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        ✅ Image uploaded: {newProject.imageUrl.substring(0, 50)}...
                      </p>
                      <img 
                        src={newProject.imageUrl} 
                        alt="Uploaded preview" 
                        className="mt-2 w-32 h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          console.error('❌ Image failed to load:', newProject.imageUrl);
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          // Show error message
                          const errorDiv = target.parentElement?.querySelector('.image-error');
                          if (errorDiv) {
                            (errorDiv as HTMLElement).style.display = 'block';
                          }
                        }}
                        onLoad={() => {
                          console.log('✅ Image loaded successfully:', newProject.imageUrl);
                        }}
                      />
                      <div className="image-error hidden mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                        ❌ Image failed to load. Check the URL: {newProject.imageUrl}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={newProject.githubUrl}
                  onChange={(e) => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
                <input
                  type="text"
                  value={newProject.liveUrl}
                  onChange={(e) => setNewProject(prev => ({ ...prev, liveUrl: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={newProject.order}
                  onChange={(e) => setNewProject(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newProject.featured}
                  onChange={(e) => setNewProject(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Project</label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                    placeholder="Add technology"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <button
                    onClick={addTechnology}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newProject.technologies?.map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-sm rounded flex items-center gap-1">
                      {tech}
                      <button
                        onClick={() => removeTechnology(tech)}
                        className="text-primary hover:text-primary/70"
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
                onClick={() => setShowAddProject(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                disabled={uploading || !newProject.imageUrl}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary disabled:bg-gray-400 flex items-center gap-2"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {uploading ? 'Saving...' : 'Create Project'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditProject && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">Edit Project</h3>
                <p className="text-sm text-gray-600 mt-1">Step 1: Upload new image (optional) • Step 2: Save changes</p>
              </div>
              <button
                onClick={() => setShowEditProject(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
                
                {/* Current Image Display */}
                {editingProject.imageUrl && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 mb-2">
                      📷 Current image: {editingProject.imageUrl.split('/').pop()}
                    </p>
                    <img 
                      src={editingProject.imageUrl}
                      alt="Current project image"
                      className="w-32 h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        console.error('❌ Current image failed to load:', editingProject.imageUrl);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* New Image Upload */}
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  {selectedFile && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">
                        New image: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                      <button
                        onClick={handleImageUploadForEdit}
                        disabled={uploading}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
                      >
                        {uploading ? 'Uploading...' : '📤 Upload New Image to R2'}
                      </button>
                    </div>
                  )}
                  
                  {/* New Image Preview */}
                  {editingProject.imageUrl && editingProject.imageUrl !== editingProject.imageUrl && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        ✅ New image uploaded: {editingProject.imageUrl.substring(0, 50)}...
                      </p>
                      <img 
                        src={editingProject.imageUrl} 
                        alt="New image preview" 
                        className="mt-2 w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={editingProject.githubUrl || ''}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, githubUrl: e.target.value } : null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
                <input
                  type="text"
                  value={editingProject.liveUrl || ''}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, liveUrl: e.target.value } : null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={editingProject.order}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, order: parseInt(e.target.value) || 0 } : null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={editingProject.featured}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, featured: e.target.checked } : null)}
                  className="rounded"
                />
                <label htmlFor="edit-featured" className="text-sm font-medium text-gray-700">Featured Project</label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTechnologyToEdit()}
                    placeholder="Add technology"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <button
                    onClick={addTechnologyToEdit}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editingProject.technologies.map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-sm rounded flex items-center gap-1">
                      {tech}
                      <button
                        onClick={() => removeTechnologyFromEdit(tech)}
                        className="text-primary hover:text-primary/70"
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
                onClick={() => setShowEditProject(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleEditProject}
                disabled={uploading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary disabled:bg-gray-400 flex items-center gap-2"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {uploading ? 'Saving...' : '💾 Save Project Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Add New Skill</h3>
              <button
                onClick={() => setShowAddSkill(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., React, Python, AWS"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="devops">DevOps</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
                <select
                  value={newSkill.proficiency}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, proficiency: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={newSkill.order}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddSkill(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary flex items-center gap-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Edit Skill</h3>
              <button
                onClick={() => setShowEditSkill(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingSkill.category}
                  onChange={(e) => setEditingSkill(prev => prev ? { ...prev, category: e.target.value as any } : null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="devops">DevOps</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
                <select
                  value={editingSkill.proficiency}
                  onChange={(e) => setEditingSkill(prev => prev ? { ...prev, proficiency: e.target.value as any } : null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={editingSkill.order}
                  onChange={(e) => setEditingSkill(prev => prev ? { ...prev, order: parseInt(e.target.value) || 0 } : null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditSkill(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSkill}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
