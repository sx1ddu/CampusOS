import mongoose from 'mongoose';

// Category model - groups services (e.g. "Tutoring") and resources
// (e.g. "Electronics") so listings can be filtered by category.
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['service', 'resource'],
    required: true,
  },
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
