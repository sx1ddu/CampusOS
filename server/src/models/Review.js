import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
   
    reviewType: {
      type: String,
      enum: ['booking', 'rental'],
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// One review per person per transaction — stops someone from
// submitting five 1-star reviews for the same booking.
reviewSchema.index({ bookingId: 1, reviewer: 1 }, { unique: true });
reviewSchema.index({ receiver: 1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
