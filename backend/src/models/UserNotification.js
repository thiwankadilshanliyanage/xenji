import mongoose from 'mongoose';
const userNotificationSchema = new mongoose.Schema({ user:{type:mongoose.Schema.Types.ObjectId,ref:'User'}, notification:{type:mongoose.Schema.Types.ObjectId,ref:'Notification'}, isRead:{type:Boolean,default:false}, readAt:Date }, {timestamps:true});
export default mongoose.model('UserNotification', userNotificationSchema);
