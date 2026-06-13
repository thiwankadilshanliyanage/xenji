import ContactMessage from '../models/ContactMessage.js';
export const submitContact=async(req,res,next)=>{try{res.status(201).json({success:true,message:'Message sent',contact:await ContactMessage.create(req.body)})}catch(e){next(e)}};
export const getMessages=async(req,res,next)=>{try{res.json({success:true,messages:await ContactMessage.find().sort('-createdAt')})}catch(e){next(e)}};
export const markMessageRead=async(req,res,next)=>{try{res.json({success:true,message:'Marked read',contact:await ContactMessage.findByIdAndUpdate(req.params.id,{isRead:true},{new:true})})}catch(e){next(e)}};
export const deleteMessage=async(req,res,next)=>{try{await ContactMessage.findByIdAndDelete(req.params.id);res.json({success:true,message:'Message deleted'})}catch(e){next(e)}};
