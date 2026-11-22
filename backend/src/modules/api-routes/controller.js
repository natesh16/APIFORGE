const ApiResponse = require('@apiforge/shared/utils/ApiResponse');
const service = require('./service');
const { recordAudit } = require('../../utils/audit');

async function create(req, res) {
  const route = await service.create(req.params.projectId, req.body);
  await recordAudit(req, 'api_route.create', 'ApiRoute', route._id);
  return ApiResponse.created(res, { route });
}

async function list(req, res) {
  const routes = await service.list(req.params.projectId);
  return ApiResponse.ok(res, { routes });
}

async function update(req, res) {
  const route = await service.update(
    req.params.routeId,
    req.params.projectId,
    req.body
  );
  await recordAudit(req, 'api_route.update', 'ApiRoute', route._id);
  return ApiResponse.ok(res, { route });
}

async function remove(req, res) {
  await service.remove(req.params.routeId, req.params.projectId);
  await recordAudit(req, 'api_route.delete', 'ApiRoute', req.params.routeId);
  return ApiResponse.noContent(res);
}

module.exports = { create, list, update, remove };
