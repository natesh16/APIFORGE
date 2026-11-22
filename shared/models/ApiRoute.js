const mongoose = require('mongoose');

const apiRouteSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    method: { type: String, required: true, uppercase: true },
    path: { type: String, required: true },
    handlerType: {
      type: String,
      enum: ['STATIC_JSON', 'HTTP_PROXY'],
      required: true,
    },
    handlerConfig: { type: mongoose.Schema.Types.Mixed, required: true },
    cacheTTL: { type: Number, default: 0 },
    requiredScopes: { type: [String], default: [] },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

apiRouteSchema.index({ projectId: 1, method: 1, path: 1 }, { unique: true });

module.exports = mongoose.model('ApiRoute', apiRouteSchema);
