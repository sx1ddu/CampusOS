import mongoose from 'mongoose';

// Profile model - extra student details that don't belong in the User
// model (bio, skills, reputation). Linked to User with a one-to-one relation.
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
    
    // These fields are updated whenever a booking/review happens, so we
    // don't have to recalculate them from scratch on every profile view.
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

// Virtual field - not stored in MongoDB, calculated on the fly whenever the
// profile is read, to tell the frontend if the user still needs to fill in details.
profileSchema.virtual('isProfileComplete').get(function () {
  return Boolean(this.bio && this.college && this.skills?.length > 0);
});

// Include virtuals when this document is converted to JSON (e.g. in API responses).
profileSchema.set('toJSON', { virtuals: true });

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
