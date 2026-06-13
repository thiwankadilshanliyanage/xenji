import Notification from '../models/Notification.js';
export const createGlobalNotification = async (payload) => Notification.create({ ...payload, isGlobal:true });
