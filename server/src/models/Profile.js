import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      maxlength: [300, 'Bio cannot exceed 300 characters'],
      default: '',
    },
    college: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: 1,
      max: 5,
    },
    skills: [String],
    portfolioLinks: [String],
    
    reputationScore: {
      type: Number,
      default: 0,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    completedBookings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

profileSchema.virtual('isProfileComplete').get(function () {
  return Boolean(this.bio && this.college && this.skills?.length > 0);
});

profileSchema.set('toJSON', { virtuals: true });

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
