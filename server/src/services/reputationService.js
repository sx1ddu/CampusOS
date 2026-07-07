import Profile from '../models/Profile.js';
import ReputationLog from '../models/ReputationLog.js';


export const addReputationPoints = async (userId, points, reason) => {
  await ReputationLog.create({ user: userId, points, reason });
  await Profile.findOneAndUpdate({ user: userId }, { $inc: { reputationScore: points } });
};
