import mongoose from 'mongoose';

const reputationLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

reputationLogSchema.index({ user: 1 });

const ReputationLog = mongoose.model('ReputationLog', reputationLogSchema);
export default ReputationLog;
