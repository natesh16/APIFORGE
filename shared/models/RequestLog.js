const mongoose = require('mongoose');

const requestLogSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    apiKeyId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApiKey', index: true },
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApiRoute' },
    method: { type: String, required: true },
    path: { type: String, required: true },
    statusCode: { type: Number, required: true },
    latencyMs: { type: Number, default: 0 },
    cached: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

requestLogSchema.index({ projectId: 1, timestamp: -1 });

module.exports = mongoose.model('RequestLog', requestLogSchema);
