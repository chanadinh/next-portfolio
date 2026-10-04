import Project from '../models/Project';
import { GitHubSnapshot } from './project-types';

export async function importRepository(snapshot: GitHubSnapshot) {
  // Await the unique sparse index before the first upsert, including concurrent imports.
  await Project.init();
  const escapedUrl = snapshot.htmlUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const existing = await Project.findOne({ $or: [
    { githubRepoId: snapshot.repoId },
    { githubRepoId: { $exists: false }, githubUrl: { $regex: `^${escapedUrl}(?:\\.git)?/?$`, $options: 'i' } },
  ] }).lean();
  const filter = existing ? { _id: existing._id } : { githubRepoId: snapshot.repoId };
  const update = {
    $set: { githubRepoId: snapshot.repoId, github: snapshot, updatedAt: new Date() },
    $setOnInsert: {
      title: snapshot.name, description: snapshot.description, technologies: snapshot.languages,
      githubUrl: snapshot.htmlUrl, liveUrl: snapshot.homepage, imageUrl: '',
      featured: false, order: 0, status: 'draft', placement: 'work',
      role: '', technicalDecisions: '', outcomes: '',
    },
  };
  try {
    return await Project.findOneAndUpdate(filter, update, { upsert: true, new: true, runValidators: true }).lean();
  } catch (error) {
    if ((error as { code?: number }).code !== 11000) throw error;
    // A concurrent import inserted the same GitHub ID. Refresh metadata only.
    return await Project.findOneAndUpdate({ githubRepoId: snapshot.repoId }, { $set: update.$set }, { new: true }).lean();
  }
}
