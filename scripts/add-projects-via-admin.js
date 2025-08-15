// Script to add Flappy Ado and Graphing Calculator projects via admin API
// Run this in your browser console while logged into admin

async function addInteractiveProjects() {
  try {
    // Get admin token from localStorage
    const token = localStorage.getItem('adminToken');
    if (!token) {
      console.error('❌ Please log into admin first');
      return;
    }

    console.log('🔑 Admin token found, proceeding...');

    // Add Flappy Ado project
    const flappyAdoProject = {
      title: 'Flappy Ado',
      description: 'An interactive Flappy Bird-style game built with React, Canvas API, and MongoDB. Features include dynamic background music that changes pitch based on player click speed, high score tracking with IP-based user identification, mobile-optimized gameplay, and a comprehensive dashboard system.',
      technologies: ['React', 'Next.js', 'TypeScript', 'Canvas API', 'MongoDB', 'Tailwind CSS', 'Framer Motion', 'Web Audio API'],
      imageUrl: '/images/ado.png',
      githubUrl: 'https://github.com/yourusername/portfolio',
      liveUrl: '/flappyado',
      featured: true,
      order: 1
    };

    console.log('📤 Adding Flappy Ado project...');
    const flappyResponse = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flappyAdoProject),
    });

    if (flappyResponse.ok) {
      const flappyResult = await flappyResponse.json();
      console.log('✅ Flappy Ado project added successfully:', flappyResult);
    } else {
      console.error('❌ Failed to add Flappy Ado project:', await flappyResponse.text());
    }

    // Add Graphing Calculator project
    const graphingCalculatorProject = {
      title: 'Graphing Calculator',
      description: 'A powerful web-based graphing calculator that can plot mathematical functions, equations, and data. Features include real-time function plotting, multiple function support, zoom and pan capabilities, and a responsive design that works on all devices.',
      technologies: ['React', 'Next.js', 'TypeScript', 'Canvas API', 'Math.js', 'Tailwind CSS', 'Framer Motion'],
      imageUrl: '/images/calculator.svg',
      githubUrl: 'https://github.com/yourusername/portfolio',
      liveUrl: '/graph',
      featured: true,
      order: 2
    };

    console.log('📤 Adding Graphing Calculator project...');
    const graphResponse = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphingCalculatorProject),
    });

    if (graphResponse.ok) {
      const graphResult = await graphResponse.json();
      console.log('✅ Graphing Calculator project added successfully:', graphResult);
    } else {
      console.error('❌ Failed to add Graphing Calculator project:', await graphResponse.text());
    }

    // Refresh the page to show new projects
    console.log('🔄 Refreshing page to show new projects...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);

  } catch (error) {
    console.error('❌ Error adding projects:', error);
  }
}

// Instructions
console.log(`
🚀 Interactive Projects Adder
============================

This script will add Flappy Ado and Graphing Calculator to your projects list.

To use:
1. Make sure you're logged into admin at /admin
2. Open browser console (F12)
3. Copy and paste this entire script
4. Run: addInteractiveProjects()

The script will:
- Add Flappy Ado project (order: 1, featured: true)
- Add Graphing Calculator project (order: 2, featured: true)
- Refresh the page to show new projects

Note: Make sure you have /images/ado.png and /images/calculator.png in your public folder.
`);

// Export the function
window.addInteractiveProjects = addInteractiveProjects;
