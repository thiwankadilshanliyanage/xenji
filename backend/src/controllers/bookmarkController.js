import Bookmark from '../models/Bookmark.js';
export const getMyBookmarks=async(req,res,next)=>{try{res.json({success:true,bookmarks:await Bookmark.find({user:req.user._id}).sort('-createdAt')})}catch(e){next(e)}};
export const addBookmark=async(req,res,next)=>{try{res.status(201).json({success:true,message:'Bookmarked',bookmark:await Bookmark.create({user:req.user._id,...req.body})})}catch(e){ if(e.code===11000) return res.json({success:true,message:'Already bookmarked'}); next(e)}};
export const removeBookmark=async(req,res,next)=>{try{await Bookmark.findOneAndDelete({_id:req.params.id,user:req.user._id});res.json({success:true,message:'Bookmark removed'})}catch(e){next(e)}};
