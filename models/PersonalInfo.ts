import mongoose from 'mongoose';

export interface IPersonalInfo {
  hobbies: string[];
  favoriteAnime: string[];
  favoriteShows: string[];
  waifu: string[];
  favoriteGames: string[];
  favoriteMusic: string[];
  otherInterests: string[];
  updatedAt: Date;
}

const PersonalInfoSchema = new mongoose.Schema<IPersonalInfo>({
  hobbies: [{
    type: String,
    default: []
  }],
  favoriteAnime: [{
    type: String,
    default: []
  }],
  favoriteShows: [{
    type: String,
    default: []
  }],
  waifu: [{
    type: String,
    default: []
  }],
  favoriteGames: [{
    type: String,
    default: []
  }],
  favoriteMusic: [{
    type: String,
    default: []
  }],
  otherInterests: [{
    type: String,
    default: []
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
PersonalInfoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.PersonalInfo || mongoose.model<IPersonalInfo>('PersonalInfo', PersonalInfoSchema);
