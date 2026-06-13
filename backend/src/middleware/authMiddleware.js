import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const protect = async (req,res,next) => {
 try { const header=req.headers.authorization||''; const token=header.startsWith('Bearer ')?header.split(' ')[1]:null; if(!token) return res.status(401).json({success:false,message:'Not authorized'});
 const decoded=jwt.verify(token, process.env.JWT_SECRET); const user=await User.findById(decoded.id).select('-password -emailVerificationToken -passwordResetToken'); if(!user || user.isBlocked) return res.status(401).json({success:false,message:'Account unavailable'}); req.user=user; next(); } catch(e){ return res.status(401).json({success:false,message:'Invalid token'}); }
};
