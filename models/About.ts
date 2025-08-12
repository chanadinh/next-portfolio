import mongoose from 'mongoose';

export interface IAbout {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const AboutSchema = new mongoose.Schema<IAbout>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  highlights: [{
    type: String,
    required: true,
    trim: true
  }],
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
AboutSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema);
