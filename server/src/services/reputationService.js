import Profile from '../models/Profile.js';
import ReputationLog from '../models/ReputationLog.js';

// Add reputation points to a user: log why, then update the running
// total stored on their profile so we don't need to sum the logs every time.
export const addReputationPoints = async (userId, points, reason) => {
  await ReputationLog.create({ user: userId, points, reason });
  await Profile.findOneAndUpdate({ user: userId }, { $inc: { reputationScore: points } });
};
