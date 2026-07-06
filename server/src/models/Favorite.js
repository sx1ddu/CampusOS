import mongoose from 'mongoose';
import { FAVORITE_TYPES } from '../constants/enums.js';

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemType: {
      type: String,
      enum: Object.values(FAVORITE_TYPES),
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

// Stops a user from favoriting the same item twice.
favoriteSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
