const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    // Globally unique for the demo so the gateway can resolve /g/:projectSlug.
    // Production would use /g/:workspaceSlug/:projectSlug with a per-workspace index.
    slug: { type: String, required: true, unique: true, lowercase: true },
    environment: {
      type: String,
      enum: ['development', 'production'],
      default: 'development',
    },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
