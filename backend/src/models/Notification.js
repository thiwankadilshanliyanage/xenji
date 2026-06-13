import mongoose from 'mongoose';
const ml = { en: { type: String, trim: true, required: true }, ja: { type: String, trim: true, default: '' } };
const notificationSchema = new mongoose.Schema({ title:ml, message:ml, type:{type:String,enum:['service','information','important','system'],default:'system'}, link:String, isGlobal:{type:Boolean,default:true}, createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'} }, {timestamps:true});
export default mongoose.model('Notification', notificationSchema);
