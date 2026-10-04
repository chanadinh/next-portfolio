import { PortfolioProject, ProjectPlacement, ProjectStatus, safeProjectUrl } from './project-types';

export class ProjectInputError extends Error {}

// Never pass request bodies straight to MongoDB: metadata and identity are server-owned.
export function editorialInput(body: unknown, existing?: Partial<PortfolioProject>) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new ProjectInputError('Expected a project object.');
  const input = body as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [field, max] of Object.entries({ title: 180, description: 2000, imageUrl: 2048, githubUrl: 2048, liveUrl: 2048, role: 2000, technicalDecisions: 10000, outcomes: 5000 })) {
    if (field in input) {
      if (typeof input[field] !== 'string' || (input[field] as string).length > max) throw new ProjectInputError(`${field} must be text with at most ${max} characters.`);
      result[field] = (input[field] as string).trim();
    }
  }
  for (const field of ['imageUrl', 'githubUrl', 'liveUrl']) {
    if (typeof result[field] === 'string' && !safeProjectUrl(result[field] as string)) throw new ProjectInputError(`${field} must be an HTTP(S) URL or a local path.`);
  }
  if ('technologies' in input) {
    if (!Array.isArray(input.technologies) || input.technologies.length > 30 || input.technologies.some(t => typeof t !== 'string' || t.length > 80)) throw new ProjectInputError('Use up to 30 technology names.');
    result.technologies = Array.from(new Set((input.technologies as string[]).map(t => t.trim()).filter(Boolean)));
  }
  if ('featured' in input) {
    if (typeof input.featured !== 'boolean') throw new ProjectInputError('Featured must be true or false.');
    result.featured = input.featured;
  }
  if ('order' in input) {
    if (!Number.isInteger(input.order) || Math.abs(input.order as number) > 100000) throw new ProjectInputError('Order must be a whole number between -100000 and 100000.');
    result.order = input.order;
  }
  const status = input.status ?? existing?.status ?? (existing ? 'published' : 'draft');
  const placement = input.placement ?? existing?.placement ?? 'work';
  if (!['draft', 'published', 'hidden'].includes(status as string)) throw new ProjectInputError('Choose draft, published, or hidden.');
  if (!['work', 'playground'].includes(placement as string)) throw new ProjectInputError('Choose work or playground.');
  result.status = status as ProjectStatus;
  result.placement = placement as ProjectPlacement;
  const merged = { ...existing, ...result };
  if (!merged.title) throw new ProjectInputError('Add a title.');
  if (status === 'published' && (!merged.description || !merged.imageUrl)) throw new ProjectInputError('Add a description and a cover image before publishing.');
  return result;
}

export const publishedFilter = { $or: [{ status: 'published' }, { status: { $exists: false } }] };
export const publicProjection = '-github -githubRepoId -__v';
