const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workspace', workspaceSchema);
