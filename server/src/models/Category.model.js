import mongoose from 'mongoose';

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