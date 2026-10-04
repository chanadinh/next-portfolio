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
    { id: 'escape-room', index: '01', name: 'Escape Room Game', date: 'OCT 2025', title: 'One room. Many teams. One shared state.', summary: 'A real-time platform that connects puzzles, players, and the people running the event.', contribution: 'I built QR-based checkpoints, synchronized progress updates, WebSocket communication, MongoDB persistence, and live organizer controls. Teams could unlock puzzles while organizers tracked completion and event status.', evidence: 'Approximately 4,600 requests during a six-hour event.', tools: ['Next.js', 'TypeScript', 'WebSocket', 'MongoDB'] },
    { id: 'paemon', index: '02', name: 'Project Paemon', date: 'JAN — FEB 2025', title: 'Making AI feel like one experience.', summary: 'Conversation, character images, and generative audio, brought together in an AI companion.', contribution: 'I co-developed Paemon with a distributed hackathon team and led front-end/back-end integration. The work brought Next.js, Python, OpenAI, Stable Diffusion, and audio services into a cohesive application.', evidence: 'Best Personal Project · Nosu AI Hackathon.', tools: ['Next.js', 'Python', 'OpenAI', 'Stable Diffusion'] },
  ],
  racingConnection: 'Racing has a place in my technical story, too. I placed in the top 30 in the U.S. AWS DeepRacer Student League.',
  toolkit: [
    { name: 'AI & data', tools: 'RAG, LLMs, embeddings, vector search, PyTorch, OpenSearch, Azure AI Search, MongoDB, MySQL' },
    { name: 'Software', tools: 'Python, Java, C/C++, TypeScript, SQL, React, Next.js, Node.js, FastAPI, Flask, PyQt/PySide6' },
    { name: 'Cybersecurity', tools: 'MITRE ATT&CK, Sigma, OT/ICS security, threat intelligence, threat hunting' },
    { name: 'Cloud & delivery', tools: 'AWS, Azure, Docker, Kubernetes, Terraform, Git/GitHub' },
  ],
};
