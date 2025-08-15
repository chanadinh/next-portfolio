'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Code, 
  Database, 
  Globe, 
  Cloud,
  Zap,
  Shield
} from 'lucide-react'

interface Skill {
  _id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'other';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  icon?: string;
  order: number;
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const previousCount = visibleCount;
      setVisibleCount(prev => Math.min(prev + 2, skillCategories.length));
      setIsLoadingMore(false);
      
      // Smooth scroll to show newly loaded skills
      setTimeout(() => {
        // Find the first newly loaded skill category
        const skillElements = document.querySelectorAll('#skills .card');
        if (skillElements.length > 0) {
          // Scroll to the first newly loaded skill category (previous count)
          const targetSkill = skillElements[previousCount];
          if (targetSkill) {
            targetSkill.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' // Center the new skill category in view
            });
            
            // Add highlight effect to newly loaded skill categories
            const newlyLoadedSkills = Array.from(skillElements).slice(previousCount);
            newlyLoadedSkills.forEach((skill, index) => {
              // Add highlight ring
              skill.classList.add('ring-4', 'ring-primary/30', 'ring-offset-2');
              
              // Add subtle bounce effect
              const skillElement = skill as HTMLElement;
              skillElement.style.transform = 'scale(1.02)';
              setTimeout(() => {
                skillElement.style.transform = 'scale(1)';
              }, 300);
              
              // Remove highlight after 2 seconds
              setTimeout(() => {
                skill.classList.remove('ring-4', 'ring-primary/30', 'ring-offset-2');
              }, 2000 + (index * 200)); // Staggered removal for visual effect
            });
          }
        }
      }, 100);
    }, 500);
  };

  const handleShowLess = () => {
    setVisibleCount(3);
    
    // Smooth scroll back to top of skills section
    setTimeout(() => {
      const skillsSection = document.getElementById('skills');
      if (skillsSection) {
        skillsSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills');
        if (response.ok) {
          const data = await response.json();
          setSkills(data);
          // Show load more button if there are more than 3 skill categories
          setShowLoadMore(skillCategories.length > 3);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Group skills by category
  const skillCategories = [
    {
      icon: Brain,
      title: 'Machine Learning',
      category: 'other'
    },
    {
      icon: Code,
      title: 'Programming Languages',
      category: 'backend'
    },
    {
      icon: Globe,
      title: 'Web Technologies',
      category: 'frontend'
    },
    {
      icon: Database,
      title: 'Data & ML Tools',
      category: 'database'
    },
    {
      icon: Cloud,
      title: 'Cloud & DevOps',
      category: 'devops'
    },

  ];

  const getSkillsByCategory = (category: string) => {
    return skills.filter(skill => skill.category === category);
  };

  const getProficiencyLevel = (proficiency: string) => {
    switch (proficiency) {
      case 'beginner': return 25;
      case 'intermediate': return 50;
      case 'advanced': return 75;
      case 'expert': return 95;
      default: return 50;
    }
  };

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Skills & <span className="text-gradient">Expertise</span>
          </h2>
          <p className="section-subtitle">
            A comprehensive overview of my technical skills and areas of expertise
          </p>
        </motion.div>

        {/* Skills Counter */}
        {showLoadMore && (
          <div className="text-center mb-6 text-gray-600">
            Showing {visibleCount} of {skillCategories.length} skill categories
          </div>
        )}

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {skillCategories.slice(0, visibleCount).map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: Math.min(categoryIndex * 0.1, 0.5), // Cap delay for smooth loading
                scale: { duration: 0.4, ease: "easeOut" }
              }}
              viewport={{ once: true }}
              className="card p-6 transition-all duration-300 ease-out"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {category.title}
                </h3>
              </div>

              <div className="space-y-4">
                {getSkillsByCategory(category.category).map((skill, skillIndex) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                    viewport={{ once: true }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {skill.name}
                      </span>
                      <span className="text-sm text-primary font-semibold">
                        {getProficiencyLevel(skill.proficiency)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${getProficiencyLevel(skill.proficiency)}%` }}
                        transition={{ duration: 1, delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
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
            {visibleCount < skillCategories.length ? (
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
                    Load More Skills
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleShowLess}
                className="btn-secondary inline-flex items-center gap-2 px-6 py-3 text-lg font-semibold"
              >
                <Shield className="w-5 h-5" />
                Show Less
              </button>
            )}
          </motion.div>
        )}

        {/* Additional Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Additional Skills & Tools
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'GitHub', 'VS Code', 'Jupyter Notebooks', 'Postman', 'Figma',
              'Adobe Creative Suite', 'Linux', 'Windows', 'macOS', 'Agile/Scrum',
              'Project Management', 'Technical Writing', 'Public Speaking'
            ].map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
