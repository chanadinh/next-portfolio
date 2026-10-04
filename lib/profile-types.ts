export const MAX_RESUME_BYTES = 3 * 1024 * 1024;
export const DEFAULT_LINKEDIN_URL = 'https://www.linkedin.com/in/chandinh';
export const RESUME_PATH = '/resume';
export const LINKEDIN_PATH = '/linkedin';

export interface ProfileSettings {
  linkedinUrl: string;
  resumeUrl: string;
  resume: { filename: string; size: number; uploadedAt: string } | null;
}
