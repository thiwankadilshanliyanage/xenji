import AuditLog from '../models/AuditLog.js';
export const logAudit = async (adminId, action, targetType, targetId, description) => AuditLog.create({ adminId, action, targetType, targetId, description });
