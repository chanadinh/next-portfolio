import Image from 'next/image';
import { BrainCircuit, Database, Factory, FileSearch, Network, Radar, ScanSearch, Search, ShieldCheck, Sigma, Wrench, type LucideIcon } from 'lucide-react';
import styles from './skills-workbench.module.css';

// Locally hosted SVG originals; sources and licenses live in public/images/skills.
const brandLogos: Record<string, string> = {
  PyTorch: 'pytorch',
  OpenSearch: 'opensearch',
  'Azure AI Search': 'azure',
  MongoDB: 'mongodb',
  MySQL: 'mysql',
  Python: 'python',
  Java: 'java',
  'C/C++': 'cplusplus',
  TypeScript: 'typescript',
  React: 'react',
  'Next.js': 'nextjs',
  'PyQt/PySide6': 'qt',
  'Node.js': 'nodejs',
  FastAPI: 'fastapi',
  Flask: 'flask',
  AWS: 'amazonwebservices',
  Azure: 'azure',
  Docker: 'docker',
  Kubernetes: 'kubernetes',
  Terraform: 'terraform',
  'Git/GitHub': 'github',
};

const conceptIcons: Record<string, LucideIcon> = {
  RAG: FileSearch,
  LLMs: BrainCircuit,
  Embeddings: Network,
  'Vector search': Search,
  SQL: Database,
  'MITRE ATT&CK': ShieldCheck,
  Sigma,
  'Threat intelligence': Radar,
  'Threat hunting': ScanSearch,
  'OT/ICS security': Factory,
};

export default function SkillLogo({ name }: { name: string }) {
  const logo = brandLogos[name];
  if (logo) return <span className={styles.logoTile} aria-hidden="true"><Image src={`/images/skills/${logo}.svg`} alt="" width={20} height={20} unoptimized /></span>;
  const Icon = conceptIcons[name] || Wrench;
  return <span className={`${styles.logoTile} ${styles.conceptTile}`} aria-hidden="true"><Icon size={18} strokeWidth={1.6} /></span>;
}
