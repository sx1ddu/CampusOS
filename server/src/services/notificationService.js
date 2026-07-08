import Notification from '../models/Notification.js';

// Small helper so controllers can create a notification in one line
// instead of repeating Notification.create() everywhere.
export const notifyUser = async (userId, type, message) => {
  await Notification.create({ user: userId, type, message });
};
