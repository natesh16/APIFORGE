const ApiResponse = require('@apiforge/shared/utils/ApiResponse');
const service = require('./service');

async function list(req, res) {
  const result = await service.list(req.params.projectId, req.query);
  return ApiResponse.ok(res, result);
}

module.exports = { list };
