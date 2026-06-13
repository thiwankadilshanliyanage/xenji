import FAQ from '../models/FAQ.js';
export const getFaqs=async(req,res,next)=>{try{ const q={status:'published'}; if(req.query.category) q.category=req.query.category; if(req.query.search) q.$text={$search:req.query.search}; res.json({success:true,faqs:await FAQ.find(q).sort('-createdAt')});}catch(e){next(e)}};
export const createFaq=async(req,res,next)=>{try{res.status(201).json({success:true,message:'FAQ created',faq:await FAQ.create(req.body)})}catch(e){next(e)}};
export const updateFaq=async(req,res,next)=>{try{res.json({success:true,message:'FAQ updated',faq:await FAQ.findByIdAndUpdate(req.params.id,req.body,{new:true})})}catch(e){next(e)}};
export const deleteFaq=async(req,res,next)=>{try{await FAQ.findByIdAndDelete(req.params.id);res.json({success:true,message:'FAQ deleted'})}catch(e){next(e)}};
