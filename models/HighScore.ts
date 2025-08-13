import mongoose, { Schema, Document } from 'mongoose';

export interface IHighScore extends Document {
  name: string;
  score: number;
  userIP: string;
  createdAt: Date;
}

const HighScoreSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  userIP: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
HighScoreSchema.index({ score: -1, createdAt: -1 });
HighScoreSchema.index({ userIP: 1, score: -1 });

export default mongoose.models.HighScore || mongoose.model<IHighScore>('HighScore', HighScoreSchema);
