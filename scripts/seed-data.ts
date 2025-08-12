import connectDB from '../lib/mongodb';
import Project from '../models/Project';
import Skill from '../models/Skill';
import About from '../models/About';

const sampleProjects = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform built with Next.js, featuring user authentication, product management, and payment integration.',
    technologies: ['Next.js', 'React', 'Node.js', 'MongoDB', 'Stripe'],
    imageUrl: '/images/digit.png',
    githubUrl: 'https://github.com/yourusername/ecommerce-platform',
    liveUrl: 'https://ecommerce-demo.vercel.app',
    featured: true,
    order: 1
  },
  {
    title: 'Portfolio Website',
    description: 'A modern, responsive portfolio website showcasing my projects and skills with smooth animations and clean design.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    imageUrl: '/images/logo.png',
    githubUrl: 'https://github.com/yourusername/portfolio',
    liveUrl: 'https://your-portfolio.vercel.app',
    featured: true,
    order: 2
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
    technologies: ['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Redis'],
    imageUrl: '/images/ava.jpeg',
    githubUrl: 'https://github.com/yourusername/task-manager',
    liveUrl: 'https://task-manager-demo.vercel.app',
    featured: false,
    order: 3
  }
];

const sampleSkills = [
  // Frontend
  { name: 'React', category: 'frontend', proficiency: 'expert', order: 1 },
  { name: 'Next.js', category: 'frontend', proficiency: 'advanced', order: 2 },
  { name: 'TypeScript', category: 'frontend', proficiency: 'advanced', order: 3 },
  { name: 'Tailwind CSS', category: 'frontend', proficiency: 'advanced', order: 4 },
  { name: 'HTML/CSS', category: 'frontend', proficiency: 'expert', order: 5 },
  
  // Backend
  { name: 'Node.js', category: 'backend', proficiency: 'advanced', order: 6 },
  { name: 'Express.js', category: 'backend', proficiency: 'advanced', order: 7 },
  { name: 'Python', category: 'backend', proficiency: 'intermediate', order: 8 },
  { name: 'Java', category: 'backend', proficiency: 'intermediate', order: 9 },
  
  // Database
  { name: 'MongoDB', category: 'database', proficiency: 'advanced', order: 10 },
  { name: 'PostgreSQL', category: 'database', proficiency: 'intermediate', order: 11 },
  { name: 'MySQL', category: 'database', proficiency: 'intermediate', order: 12 },
  
  // DevOps
  { name: 'Docker', category: 'devops', proficiency: 'intermediate', order: 13 },
  { name: 'AWS', category: 'devops', proficiency: 'intermediate', order: 14 },
  { name: 'Vercel', category: 'devops', proficiency: 'advanced', order: 15 },
  
  // Other
  { name: 'Git', category: 'other', proficiency: 'advanced', order: 16 },
  { name: 'REST APIs', category: 'other', proficiency: 'advanced', order: 17 },
  { name: 'GraphQL', category: 'other', proficiency: 'intermediate', order: 18 }
];

const sampleAbout = {
  title: 'Full-Stack Developer',
  subtitle: 'Passionate about creating innovative web solutions',
  description: 'I am a dedicated full-stack developer with expertise in modern web technologies. I love building scalable applications that solve real-world problems and provide exceptional user experiences.',
  highlights: [
    '5+ years of experience in web development',
    'Expert in React, Next.js, and Node.js',
    'Experience with cloud platforms and DevOps',
    'Strong focus on clean code and best practices',
    'Passionate about learning new technologies'
  ],
  imageUrl: '/images/ava.jpeg',
  order: 1
};

async function seedData() {
  try {
    await connectDB();
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await About.deleteMany({});
    console.log('Cleared existing data');

    // Seed projects
    const projects = await Project.insertMany(sampleProjects);
    console.log(`Seeded ${projects.length} projects`);

    // Seed skills
    const skills = await Skill.insertMany(sampleSkills);
    console.log(`Seeded ${skills.length} skills`);

    // Seed about
    const about = await About.create(sampleAbout);
    console.log('Seeded about section');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedData();
