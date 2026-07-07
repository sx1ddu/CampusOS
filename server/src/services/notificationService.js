import Notification from '../models/Notification.js';


export const notifyUser = async (userId, type, message) => {
  await Notification.create({ user: userId, type, message });
};
