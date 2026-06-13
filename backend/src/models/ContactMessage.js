import mongoose from 'mongoose';
const contactMessageSchema = new mongoose.Schema({ name:String, email:String, subject:String, message:String, isRead:{type:Boolean,default:false} }, {timestamps:true});
export default mongoose.model('ContactMessage', contactMessageSchema);
