const RequestLog = require('@apiforge/shared/models/RequestLog');

async function list(projectId, { page = 1, limit = 50 } = {}) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    RequestLog.find({ projectId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit),
    RequestLog.countDocuments({ projectId }),
  ]);
  return { items, total, page, limit };
}

module.exports = { list };
