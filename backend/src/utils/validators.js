import validator from 'validator';
export const requireFields = (body, fields) => fields.filter((f) => !body[f]);
export const isStrongPassword = (password='') => password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
export const isEmail = (email='') => validator.isEmail(email);
