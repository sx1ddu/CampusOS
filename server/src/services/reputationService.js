import Profile from '../models/Profile.js';
import ReputationLog from '../models/ReputationLog.js';

// Adds reputation points to a user, logs why, and updates their
// profile's reputationScore so we don't have to sum the logs every time.
export const addReputationPoints = async (userId, points, reason) => {
  await ReputationLog.create({ user: userId, points, reason });
  await Profile.findOneAndUpdate({ user: userId }, { $inc: { reputationScore: points } });
};
