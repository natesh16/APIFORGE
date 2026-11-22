const mongoose = require('mongoose');

const usageEventSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    periodStart: { type: Date, required: true, index: true },
    periodType: { type: String, enum: ['hourly', 'daily'], default: 'hourly' },
    requestCount: { type: Number, default: 0 },
    errorCount: { type: Number, default: 0 },
    latencySum: { type: Number, default: 0 },
    latencyCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

usageEventSchema.index(
  { projectId: 1, periodStart: 1, periodType: 1 },
  { unique: true }
);

module.exports = mongoose.model('UsageEvent', usageEventSchema);
