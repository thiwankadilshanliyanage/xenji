import mongoose from 'mongoose';
const reportSchema = new mongoose.Schema({ user:{type:mongoose.Schema.Types.ObjectId,ref:'User'}, itemType:{type:String,enum:['service','information'],required:true}, itemId:{type:mongoose.Schema.Types.ObjectId,required:true}, reason:String, message:String, status:{type:String,enum:['pending','reviewed','resolved'],default:'pending'} }, {timestamps:true});
export default mongoose.model('Report', reportSchema);
