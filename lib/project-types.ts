export type ProjectStatus = 'draft' | 'published' | 'hidden';
export type ProjectPlacement = 'work' | 'playground';
export interface GitHubSnapshot {
  repoId: number;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  homepage: string;
  languages: string[];
  topics: string[];
  readme: string;
  readmeTruncated: boolean;
  stars: number;
  fork: boolean;
  archived: boolean;
  pushedAt: string | null;
  syncedAt: string;
}
export interface PortfolioProject {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
  status?: ProjectStatus;
  placement?: ProjectPlacement;
  role?: string;
  technicalDecisions?: string;
  outcomes?: string;
  githubRepoId?: number;
  github?: GitHubSnapshot;
}

export function isPublished(project: { status?: string }) {
  // Existing portfolio entries predate the draft workflow and remain visible.
  return project.status === undefined || project.status === 'published';
}

export function safeProjectUrl(value: string) {
  if (!value) return true;
  if (/[\u0000-\u0020\u007f\\]/.test(value)) return false;
  if (value.startsWith('/') && !value.startsWith('//')) {
    return new URL(value, 'https://portfolio.invalid').origin === 'https://portfolio.invalid';
  }
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password;
  } catch { return false; }
}
