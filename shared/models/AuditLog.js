const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: { type: String, required: true },
    resourceType: { type: String, required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId },
    timestamp: { type: Date, default: Date.now, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: false }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
