import { createTransporter } from '../config/mail.js';
export const sendEmail = async ({to, subject, html}) => {
 if (!process.env.EMAIL_USER) { console.log('Email skipped:', subject, to); return; }
 await createTransporter().sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to, subject, html });
};
export const sendVerificationEmail = (user, token) => sendEmail({ to:user.email, subject:'Verify your Xenji email', html:`<p>Hello ${user.name}, verify your email:</p><a href="${process.env.CLIENT_URL}/verify-email/${token}">Verify Email</a>` });
export const sendResetEmail = (user, token) => sendEmail({ to:user.email, subject:'Reset your Xenji password', html:`<p>Reset password:</p><a href="${process.env.CLIENT_URL}/reset-password/${token}">Reset Password</a>` });
