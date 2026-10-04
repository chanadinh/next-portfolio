import mongoose from 'mongoose';
import { DEFAULT_LINKEDIN_URL } from '../lib/profile-types';

export interface IProfileSettings {
  _id: string;
  linkedinUrl: string;
  resumeFilename?: string;
  resumeSize?: number;
  resumeUploadedAt?: Date;
  resumeData?: Buffer;
}

const schema = new mongoose.Schema<IProfileSettings>({
  _id: { type: String, required: true },
  linkedinUrl: { type: String, default: DEFAULT_LINKEDIN_URL },
  resumeFilename: String,
  resumeSize: Number,
  resumeUploadedAt: Date,
  resumeData: { type: Buffer, select: false },
}, { timestamps: true });

export default (mongoose.models.ProfileSettings as mongoose.Model<IProfileSettings>) || mongoose.model<IProfileSettings>('ProfileSettings', schema);
