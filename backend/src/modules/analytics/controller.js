const ApiResponse = require('@apiforge/shared/utils/ApiResponse');
const service = require('./service');

async function overview(req, res) {
  const days = Math.min(Math.max(Number(req.query.days) || 7, 1), 90);
  const data = await service.overview(req.params.projectId, { days });
  return ApiResponse.ok(res, data);
}

module.exports = { overview };
