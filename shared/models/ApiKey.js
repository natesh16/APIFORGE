const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    name: { type: String, default: 'API Key' },
    keyPrefix: { type: String, required: true, unique: true },
    keyHash: { type: String, required: true },
    scopes: { type: [String], default: [] },
    rateLimit: {
      limit: { type: Number, default: 100 },
      windowSeconds: { type: Number, default: 60 },
    },
    expiresAt: Date,
    revokedAt: Date,
    lastUsedAt: Date,
  },
  { timestamps: true }
);

// Never expose the stored hash through the API.
apiKeySchema.methods.toJSON = function () {
  const { __v, keyHash, ...rest } = this.toObject();
  return rest;
};

module.exports = mongoose.model('ApiKey', apiKeySchema);
