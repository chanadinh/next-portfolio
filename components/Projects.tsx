'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Award, Zap, Eye, Code } from 'lucide-react'
import Image from 'next/image'

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

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(2);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const previousCount = visibleCount;
      setVisibleCount(prev => Math.min(prev + 2, projects.length));
      setIsLoadingMore(false);
      
      // Smooth scroll to show newly loaded projects
      setTimeout(() => {
        // Find the first newly loaded project
        const projectElements = document.querySelectorAll('#projects .card');
        if (projectElements.length > 0) {
          // Scroll to the first newly loaded project (previous count)
          const targetProject = projectElements[previousCount];
          if (targetProject) {
            targetProject.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' // Center the new project in view
            });
            
            // Add highlight effect to newly loaded projects
            const newlyLoadedProjects = Array.from(projectElements).slice(previousCount);
            newlyLoadedProjects.forEach((project, index) => {
              // Add highlight ring
              project.classList.add('ring-4', 'ring-primary/30', 'ring-offset-2');
              
              // Add subtle bounce effect
              const projectElement = project as HTMLElement;
              projectElement.style.transform = 'scale(1.02)';
              setTimeout(() => {
                projectElement.style.transform = 'scale(1)';
              }, 300);
              
              // Remove highlight after 2 seconds
              setTimeout(() => {
                project.classList.remove('ring-4', 'ring-primary/30', 'ring-offset-2');
              }, 2000 + (index * 200)); // Staggered removal for visual effect
            });
          }
        }
      }, 100);
    }, 500);
  };

  const handleShowLess = () => {
    setVisibleCount(2);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
          // Show load more button if there are more than 3 projects
          setShowLoadMore(data.length > 3);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="section-subtitle">
            A showcase of my work in AI, machine learning, and software development
          </p>
        </motion.div>

        {/* Projects Counter */}
        {showLoadMore && (
          <div className="text-center mb-6 text-gray-600">
            Showing {visibleCount} of {projects.length} projects
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.slice(0, visibleCount).map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: Math.min(index * 0.1, 0.5), // Cap delay for smooth loading
                scale: { duration: 0.4, ease: "easeOut" }
              }}
              viewport={{ once: true }}
              className={`card overflow-hidden transition-all duration-300 ease-out ${project.featured ? 'ring-2 ring-primary/20' : ''}`}
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 2}
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.parentElement?.querySelector('.image-placeholder');
                      if (placeholder) {
                        (placeholder as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                
                {/* Fallback placeholder for missing images */}
                <div className={`image-placeholder ${project.imageUrl ? 'hidden' : 'flex'} absolute inset-0 items-center justify-center bg-gray-200`}>
                  <div className="text-center text-gray-500">
                    <Code className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">No Image</p>
                  </div>
                </div>
                
                {project.featured && (
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    Featured
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Project Links */}
                <div className="flex gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-300"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More / Show Less Buttons */}
        {showLoadMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            {visibleCount < projects.length ? (
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className={`btn-primary inline-flex items-center gap-2 px-8 py-3 text-lg font-semibold ${
                  isLoadingMore ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Load More Projects
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleShowLess}
                className="btn-secondary inline-flex items-center gap-2 px-6 py-3 text-lg font-semibold"
              >
                <Eye className="w-5 h-5" />
                Show Less
              </button>
            )}
          </motion.div>
        )}

        {/* View More on GitHub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a
            href="https://github.com/chanadinh"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Github className="w-5 h-5" />
            View More on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  )
}
