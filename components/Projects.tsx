'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Award, Zap, Eye, Code } from 'lucide-react'
import Image from 'next/image'

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "Project Pæmon - AI Web App",
      description: "A Pokémon-inspired AI web app that generates personalized digital companions based on user personality traits. Co-developed at Nosu AI Hackathon, winning Best Personal Project (CodeBuff) with $650 USD prize. Features AI-generated visuals, descriptions, and music.",
      technologies: ["Next.js", "OpenAI GPT-5", "Stable Diffusion", "TailwindCSS", "AI Integration", "Beatoven.ai"],
      image: "/images/logo.png", // Using the actual logo from the repo
      github: "https://github.com/chanadinh",
      live: "https://project-paemon-31jm.vercel.app",
      featured: true,
      award: "Best Personal Project - Nosu AI Hackathon ($650)"
    },
    {
      id: 2,
      title: "MNIST Digit Classifier",
      description: "Machine learning project for digit recognition using the MNIST dataset. Implemented neural networks and evaluated different ML algorithms for optimal classification accuracy.",
      technologies: ["Python", "Machine Learning", "Neural Networks", "MNIST Dataset", "Classification"],
      image: "/images/digit.png", // Using the actual digit image from the repo
      github: "https://github.com/chanadinh/MNIST-Digit-Classifier-Project",
      live: "https://github.com/chanadinh/MNIST-Digit-Classifier-Project",
      featured: false
    },
    {
      id: 3,
      title: "Bike Sharing Demand Prediction",
      description: "ML project using AutoGluon for automated machine learning to predict bike sharing demand. Demonstrates expertise in time series forecasting and automated ML workflows.",
      technologies: ["Python", "AutoGluon", "Machine Learning", "Time Series", "Forecasting", "Jupyter"],
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
      github: "https://github.com/chanadinh/Project--Predict-Bike-Sharing-Demand-with-AutoGluon",
      live: "https://github.com/chanadinh/Project--Predict-Bike-Sharing-Demand-with-AutoGluon",
      featured: false
    },
    {
      id: 4,
      title: "Dog Breed Classifier",
      description: "Computer vision project using PyTorch for dog breed classification. Evaluated CNN architectures (AlexNet, VGG, ResNet) for optimal accuracy and computational efficiency.",
      technologies: ["Python", "PyTorch", "CNN", "AlexNet", "VGG", "ResNet", "Computer Vision"],
      image: "https://images.unsplash.com/photo-1547407139-3c921a64105e?w=800&h=600&fit=crop&crop=center",
      github: "https://github.com/chanadinh/Dog-Classifier",
      live: "https://github.com/chanadinh/Dog-Classifier",
      featured: false
    },
    {
      id: 5,
      title: "Medusa Bot - Discord Bot",
      description: "Multi-API Discord bot with advanced features including AI chat, moderation tools, and custom commands.",
      technologies: ["JavaScript", "Node.js", "Discord.js", "REST APIs"],
      image: "/images/medusabot.png", // Using the actual medusa bot image from the repo
      github: "https://github.com/chanadinh/medusa-bot",
      live: null,
      featured: false
    }
  ]

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

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`card overflow-hidden ${project.featured ? 'ring-2 ring-primary/20' : ''}`}
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 2}
                />
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

                {/* Award Badge */}
                {project.award && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-semibold">{project.award}</span>
                    </div>
                  </div>
                )}

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
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-300"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
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

        {/* View More Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
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
