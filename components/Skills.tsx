'use client'

import { motion } from 'framer-motion'
import { 
  Brain, 
  Code, 
  Database, 
  Globe, 
  Smartphone, 
  Cloud,
  Zap,
  Shield
} from 'lucide-react'

export default function Skills() {
  const skillCategories = [
    {
      icon: Brain,
      title: 'Machine Learning',
      skills: [
        { name: 'Neural Networks', level: 90 },
        { name: 'Computer Vision', level: 85 },
        { name: 'Natural Language Processing', level: 80 },
        { name: 'Deep Learning', level: 85 },
        { name: 'AutoML', level: 75 }
      ]
    },
    {
      icon: Code,
      title: 'Programming Languages',
      skills: [
        { name: 'Python', level: 95 },
        { name: 'JavaScript/TypeScript', level: 90 },
        { name: 'Java', level: 80 },
        { name: 'C++', level: 75 },
        { name: 'SQL', level: 85 }
      ]
    },
    {
      icon: Globe,
      title: 'Web Technologies',
      skills: [
        { name: 'React/Next.js', level: 90 },
        { name: 'Node.js', level: 85 },
        { name: 'HTML/CSS', level: 90 },
        { name: 'REST APIs', level: 85 },
        { name: 'GraphQL', level: 75 }
      ]
    },
    {
      icon: Database,
      title: 'Data & ML Tools',
      skills: [
        { name: 'PyTorch', level: 85 },
        { name: 'TensorFlow', level: 80 },
        { name: 'Pandas/NumPy', level: 90 },
        { name: 'Scikit-learn', level: 85 },
        { name: 'AutoGluon', level: 80 }
      ]
    },
    {
      icon: Cloud,
      title: 'Cloud & DevOps',
      skills: [
        { name: 'AWS', level: 75 },
        { name: 'Docker', level: 80 },
        { name: 'Git', level: 90 },
        { name: 'CI/CD', level: 75 },
        { name: 'MongoDB', level: 80 }
      ]
    },
    {
      icon: Smartphone,
      title: 'Mobile & AI',
      skills: [
        { name: 'React Native', level: 75 },
        { name: 'AI Integration', level: 85 },
        { name: 'API Development', level: 85 },
        { name: 'Performance Optimization', level: 80 },
        { name: 'Testing', level: 75 }
      ]
    }
  ]

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

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="card p-6"
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
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skillIndex}
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
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
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
