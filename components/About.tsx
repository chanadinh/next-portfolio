'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Code, Database, Zap, Shield, Globe } from 'lucide-react'

interface AboutData {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  imageUrl: string;
}

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/about');
        if (response.ok) {
          const data = await response.json();
          setAboutData(data);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI/ML Expertise',
      description: 'Deep understanding of machine learning algorithms, neural networks, and AI applications.'
    },
    {
      icon: Code,
      title: 'Full-Stack Development',
      description: 'Proficient in both frontend and backend technologies with modern frameworks.'
    },
    {
      icon: Database,
      title: 'Data Engineering',
      description: 'Experience with data pipelines, ETL processes, and big data technologies.'
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Skilled in optimizing applications for speed, scalability, and efficiency.'
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Implementing best practices for data security and application protection.'
    },
    {
      icon: Globe,
      title: 'Cloud Solutions',
      description: 'Experience with AWS, cloud deployment, and scalable infrastructure.'
    }
  ]

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title text-gradient">
            {aboutData?.title || 'About Me'}
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {aboutData?.description || 'I\'m a passionate AI/ML developer and software engineer with expertise in building intelligent applications. My journey in technology has led me through various domains, from computer vision to natural language processing, always pushing the boundaries of what\'s possible with artificial intelligence.'}
          </p>
          {aboutData?.subtitle && (
            <p className="text-lg text-gray-600 mt-4 font-medium">
              {aboutData.subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">My Mission</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              To leverage cutting-edge AI and machine learning technologies to solve real-world problems, 
              create innovative solutions, and contribute to the advancement of intelligent systems that 
              make a positive impact on people's lives.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
