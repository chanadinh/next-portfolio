// Facts: Chan's supplied July 2026 résumé and directly confirmed cybersecurity/F1 interests.
export const story = {
  introduction: 'I’m Chan Dinh—a Computer Science student at UCF, building AI and software with the cybersecurity team at Siemens Energy. This is the story of what I’m learning, what I’m making, and what keeps me curious.',
  foundation: [
    'My background brings together mathematics, teaching, and computer science. At Seminole State College, I tutored students in subjects from algebra to calculus, adapting explanations to different learning needs.',
    'I also reviewed mathematical datasets for AI training at Highbrow Technology. Today, I’m pursuing my B.S. in Computer Science at the University of Central Florida and putting that foundation to work in software.',
  ],
  experience: [
    { date: 'JUN — SEP 2025', role: 'SWEP Intern', title: 'Finding the useful signal.', body: 'At Siemens Energy, I built an internal bid-support platform using RAG, embeddings, vector search, and MongoDB. It connected requirements to potential solutions, reducing manual requirement-to-solution analysis time by more than 80%.', tools: ['RAG', 'Embeddings', 'Vector search', 'MongoDB'] },
    { date: 'OCT 2025 — PRESENT', role: 'OES CYS Solution Intern', title: 'Building with the cybersecurity team.', body: 'My work now spans audit-report automation, an interactive operational technology demonstration interface, and a human-in-the-loop threat-hunting platform. I collaborate with cybersecurity specialists, software engineers, and sales teams to turn technical requirements into usable applications and documentation.', tools: ['Python / PyQt', 'Next.js / React', 'OT / ICS', 'Human-in-the-loop AI'] },
  ],
  projects: [
    {
      id: 'escape-room', index: '01', name: 'Escape Room Game', date: 'OCT 2025',
      title: 'One room. Many teams. One shared state.',
      summary: 'A real-time platform that connects puzzles, players, and the people running the event.',
      contribution: 'I built QR-based checkpoints, synchronized progress updates, WebSocket communication, MongoDB persistence, and live organizer controls. Teams could unlock puzzles while organizers tracked completion and event status.',
      evidence: 'Approximately 4,600 requests during a six-hour event.',
      tools: ['Next.js', 'TypeScript', 'WebSocket', 'MongoDB'],
      source: { label: 'View repository', href: 'https://github.com/chanadinh/Escape-Room' },
      images: [{ src: '/images/projects/escape-room-event.png', width: 480, height: 640, alt: 'Escape Room event station with a Mission Success screen and three physical puzzle buttons.', caption: 'At the event' }],
    },
    {
      id: 'paemon', index: '02', name: 'Project Paemon', date: 'JAN — FEB 2025',
      title: 'Making AI feel like one experience.',
      summary: 'A short questionnaire becomes a personalized pixel-art companion, with its own character, abilities, and AI-generated soundtrack.',
      contribution: 'I co-developed Paemon with a distributed hackathon team and led front-end/back-end integration. The work brought Next.js, Python, OpenAI, Stable Diffusion, and audio services into a cohesive application.',
      evidence: 'Best Personal Project · Nosu AI Hackathon.',
      tools: ['Next.js', 'Python', 'OpenAI', 'Stable Diffusion'],
      source: { label: 'Team submission', href: 'https://devpost.com/software/name-5ftgnj' },
      images: [
        { src: '/images/projects/paemon-companion.png', width: 979, height: 910, alt: 'Project Paemon screenshot showing the pixel-art companion Flutewisp, its stats, type, and moves.', caption: 'A companion, generated' },
        { src: '/images/projects/paemon-questionnaire.png', width: 1918, height: 910, alt: 'Project Paemon questionnaire asking which special ability the player would choose, over a pixel-art forest.', caption: 'It starts with a few questions' },
      ],
    },
  ],
  toolkit: [
    {
      id: 'ai', name: 'AI & data', verb: 'Find the signal.', title: 'Turn information into something useful.',
      description: 'Retrieval, models, and data systems—the tools behind finding useful context and bringing it into an application.',
      evidence: 'At Siemens Energy, my bid-support platform connected requirements to potential solutions using RAG, embeddings, vector search, and MongoDB.',
      href: '#experience', linkLabel: 'Read the experience',
      diagram: 'A retrieval workflow', diagramNote: 'Context before an answer.', flow: ['Documents', 'Retrieval', 'Context', 'Answer'],
      groups: [
        { label: 'Models & methods', tools: ['RAG', 'LLMs', 'Embeddings', 'PyTorch'] },
        { label: 'Retrieval', tools: ['Vector search', 'OpenSearch', 'Azure AI Search'] },
        { label: 'Data stores', tools: ['MongoDB', 'MySQL'] },
      ],
    },
    {
      id: 'software', name: 'Software', verb: 'Make it usable.', title: 'Connect the interface to the system.',
      description: 'Languages, interfaces, and services that bring the parts of an application together, from the screen to the data behind it.',
      evidence: 'For Escape Room Game, I built synchronized progress updates, WebSocket communication, MongoDB persistence, and live organizer controls.',
      href: '#escape-room', linkLabel: 'Inside Escape Room',
      diagram: 'A real-time interaction', diagramNote: 'One shared state.', flow: ['Player action', 'Server', 'Shared state', 'Live update'],
      groups: [
        { label: 'Languages', tools: ['Python', 'Java', 'C/C++', 'TypeScript', 'SQL'] },
        { label: 'Interfaces', tools: ['React', 'Next.js', 'PyQt/PySide6'] },
        { label: 'Services', tools: ['Node.js', 'FastAPI', 'Flask'] },
      ],
    },
    {
      id: 'security', name: 'Cybersecurity', verb: 'Question the system.', title: 'Keep people in the decision loop.',
      description: 'Security context shapes how I think about a system: what it observes, how it is understood, and where a person needs to make the call.',
      evidence: 'My work with the cybersecurity team at Siemens Energy spans audit-report automation, OT demonstrations, and a human-in-the-loop threat-hunting platform.',
      href: '#experience', linkLabel: 'The cybersecurity chapter',
      diagram: 'An analyst-led investigation', diagramNote: 'The analyst stays in the loop.', flow: ['Telemetry', 'Detection', 'Analyst review', 'Decision'],
      groups: [
        { label: 'Detection language', tools: ['MITRE ATT&CK', 'Sigma'] },
        { label: 'Investigation', tools: ['Threat intelligence', 'Threat hunting'] },
        { label: 'Operational context', tools: ['OT/ICS security'] },
      ],
    },
    {
      id: 'delivery', name: 'Cloud & delivery', verb: 'Keep it moving.', title: 'Think beyond the code.',
      description: 'Cloud platforms, packaging, infrastructure, and version control round out my toolkit—the pieces around an application as it grows.',
      evidence: 'This portfolio’s source lives on GitHub, alongside the projects I share and maintain.',
      href: 'https://github.com/chanadinh/next-portfolio', linkLabel: 'Explore the portfolio source',
      diagram: 'From source to release', diagramNote: 'Build. Review. Iterate.', flow: ['Source', 'Package', 'Infrastructure', 'Release'],
      groups: [
        { label: 'Platforms', tools: ['AWS', 'Azure'] },
        { label: 'Packaging & infrastructure', tools: ['Docker', 'Kubernetes', 'Terraform'] },
        { label: 'Version control', tools: ['Git/GitHub'] },
      ],
    },
  ],
};
