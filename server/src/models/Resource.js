import mongoose from 'mongoose';

// Resource model - a physical item a student lists for rent (e.g. calculator, camera).
const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rentPerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    depositAmount: {
      type: Number,
      default: 0,
    },
    images: [String],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // Soft delete - hide the resource instead of removing it, since old
    // rentals still need to reference it.
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for search, category browsing, and "my resources" queries.
resourceSchema.index({ title: 'text', description: 'text' });
resourceSchema.index({ category: 1, isAvailable: 1 });
resourceSchema.index({ owner: 1 });

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
