import Notification from '../models/Notification.js';
export const getNotifications=async(req,res,next)=>{try{res.json({success:true,notifications:await Notification.find({isGlobal:true}).sort('-createdAt').limit(50)})}catch(e){next(e)}};
export const createNotification=async(req,res,next)=>{try{res.status(201).json({success:true,message:'Notification created',notification:await Notification.create({...req.body,createdBy:req.user._id})})}catch(e){next(e)}};
export const markRead=async(req,res)=>res.json({success:true,message:'Marked as read'});
export const markAllRead=async(req,res)=>res.json({success:true,message:'All marked as read'});
