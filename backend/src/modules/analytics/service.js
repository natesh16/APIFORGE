const mongoose = require('mongoose');
const UsageEvent = require('@apiforge/shared/models/UsageEvent');
const RequestLog = require('@apiforge/shared/models/RequestLog');

async function overview(projectId, { days = 7 } = {}) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  const [totals] = await UsageEvent.aggregate([
    {
      $match: {
        projectId: projectObjectId,
        periodStart: { $gte: since },
      },
    },
    {
      $group: {
        _id: null,
        requests: { $sum: '$requestCount' },
        errors: { $sum: '$errorCount' },
        latencySum: { $sum: '$latencySum' },
        latencyCount: { $sum: '$latencyCount' },
      },
    },
  ]);

  const recent = await RequestLog.find({
    projectId,
    timestamp: { $gte: since },
  })
    .sort({ timestamp: -1 })
    .limit(20);

  return {
    totalRequests: totals?.requests || 0,
    totalErrors: totals?.errors || 0,
    successRate: totals?.requests
      ? ((totals.requests - totals.errors) / totals.requests) * 100
      : 100,
    avgLatencyMs: totals?.latencyCount
      ? Math.round(totals.latencySum / totals.latencyCount)
      : 0,
    recentLogs: recent,
  };
}

module.exports = { overview };
