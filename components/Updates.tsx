'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Building, GraduationCap, Trophy, Users } from 'lucide-react'
import Image from 'next/image'

interface Update {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  type: 'internship' | 'academic' | 'achievement';
  icon: React.ComponentType<any>;
  imageUrl?: string;
}

const updates: Update[] = [
  {
    id: '1',
    title: 'Summer Internship at Siemens Energy',
    content: `This summer has been an incredible journey so far. I'm nine weeks into my first internship with Siemens Energy, where I've met amazing people — including my manager and mentors Katja Fischer, Friederike Waschke, Sam Miorelli and Fletcher Giddens — and my project partner Anthony Sevarino, with whom I'm learning and making great progress. I've also experienced new things like public speaking, networking, and touring a power plant. I'm working on a real, impactful project that's strengthened my programming and database skills.

Alongside my internship, I completed my summer classes with all A's, earning a spot on the President's List. I also had the opportunity to take Physics with Calculus I with Professor Christopher Lorscher, making this summer both academically and professionally unforgettable.

With a new semester starting and seven more weeks left in the SWEP program, I'm really excited to keep learning, growing, and moving forward.`,
    date: 'Summer 2025',
    tags: ['SiemensEnergy', 'EnergyNow', 'SWEP', 'Cybersecurity', 'AI', 'Engineering', 'Internship', 'Software', 'SeminoleStateCollege'],
    type: 'internship',
    icon: Building,
    imageUrl: '/images/siemens-internship.jpg'
  }
]

export default function Updates() {
  const getTagColor = (tag: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-red-100 text-red-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
      'bg-yellow-100 text-yellow-800',
      'bg-teal-100 text-teal-800'
    ]
    return colors[Math.abs(tag.length) % colors.length]
  }

  return (
    <section id="updates" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title text-gradient">
            Latest Updates
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Stay updated with my latest experiences, achievements, and professional journey
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {updates.map((update, index) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="card mb-8 group hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <update.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      {update.title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {update.date}
                    </div>
                  </div>
                  
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-4">
                    {update.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  {update.imageUrl && (
                    <div className="mb-4">
                      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
                        <Image
                          src={update.imageUrl}
                          alt={update.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {update.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(tag)} hover:scale-105 transition-transform duration-200 cursor-default`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 text-lg">
            More updates coming soon! Follow my journey as I continue to grow and learn.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
