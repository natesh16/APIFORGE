const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    requestQuota: { type: Number, default: 10000 },
    rateLimit: { type: Number, default: 60 },
    retentionDays: { type: Number, default: 7 },
    features: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
