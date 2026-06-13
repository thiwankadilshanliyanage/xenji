import Report from '../models/Report.js';
export const submitReport=async(req,res,next)=>{try{res.status(201).json({success:true,message:'Report submitted',report:await Report.create({...req.body,user:req.user?._id})})}catch(e){next(e)}};
export const getReports=async(req,res,next)=>{try{res.json({success:true,reports:await Report.find().populate('user','name email').sort('-createdAt')})}catch(e){next(e)}};
export const updateReportStatus=async(req,res,next)=>{try{res.json({success:true,message:'Report updated',report:await Report.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true})})}catch(e){next(e)}};
export const deleteReport=async(req,res,next)=>{try{await Report.findByIdAndDelete(req.params.id);res.json({success:true,message:'Report deleted'})}catch(e){next(e)}};
