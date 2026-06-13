export const sendResponse = (res, statusCode, message, data = {}) => res.status(statusCode).json({ success: statusCode < 400, message, ...data });
export const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password; delete obj.emailVerificationToken; delete obj.emailVerificationExpires; delete obj.passwordResetToken; delete obj.passwordResetExpires;
  return obj;
};
