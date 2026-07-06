import Notification from '../models/Notification.js';

// Small helper so any controller can fire off a notification
// in one line instead of repeating Notification.create() everywhere.
export const notifyUser = async (userId, type, message) => {
  await Notification.create({ user: userId, type, message });
};
