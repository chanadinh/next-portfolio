import mongoose from 'mongoose';
import { PortfolioProject } from '../lib/project-types';
export interface IProject extends Omit<PortfolioProject, '_id'> { createdAt: Date; updatedAt: Date; }
const ProjectSchema = new mongoose.Schema<IProject>({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  technologies: [{ type: String, trim: true }],
  imageUrl: { type: String, default: '', trim: true },
  githubUrl: { type: String, trim: true }, liveUrl: { type: String, trim: true },
  featured: { type: Boolean, default: false }, order: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published', 'hidden'], default: 'draft' },
  placement: { type: String, enum: ['work', 'playground'], default: 'work' },
  role: { type: String, default: '' }, technicalDecisions: { type: String, default: '' }, outcomes: { type: String, default: '' },
  githubRepoId: { type: Number },
  github: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });
ProjectSchema.index({ githubRepoId: 1 }, { unique: true, sparse: true });
export default (mongoose.models.Project as mongoose.Model<IProject>) || mongoose.model<IProject>('Project', ProjectSchema);
