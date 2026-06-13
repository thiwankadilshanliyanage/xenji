import mongoose from 'mongoose';
const auditLogSchema = new mongoose.Schema({ adminId:{type:mongoose.Schema.Types.ObjectId,ref:'User'}, action:String, targetType:String, targetId:String, description:String }, {timestamps:true});
export default mongoose.model('AuditLog', auditLogSchema);
