const ApiResponse = require('@apiforge/shared/utils/ApiResponse');
const service = require('./service');

async function create(req, res) {
  const workspace = await service.create(req.user._id, req.body);
  return ApiResponse.created(res, { workspace });
}

async function list(req, res) {
  const workspaces = await service.listForUser(req.user._id);
  return ApiResponse.ok(res, { workspaces });
}

async function invite(req, res) {
  const membership = await service.invite(
    req.params.workspaceId,
    req.user._id,
    req.body
  );
  return ApiResponse.created(res, { membership });
}

module.exports = { create, list, invite };
