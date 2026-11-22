const ApiResponse = require('@apiforge/shared/utils/ApiResponse');
const ApiError = require('@apiforge/shared/utils/ApiError');
const Membership = require('@apiforge/shared/models/Membership');
const service = require('./service');
const { ROLE_RANK } = require('../../middleware/rbac');

async function create(req, res) {
  const membership = await Membership.findOne({
    workspaceId: req.body.workspaceId,
    userId: req.user._id,
  });
  if (!membership) throw ApiError.forbidden('No workspace access');
  if (ROLE_RANK[membership.role] < ROLE_RANK.developer) {
    throw ApiError.forbidden('Requires developer role');
  }

  const project = await service.create(req.body);
  return ApiResponse.created(res, { project });
}

async function list(req, res) {
  const { workspaceId } = req.query;
  if (!workspaceId) return ApiResponse.ok(res, { projects: [] });

  // Tenant isolation: never list a workspace the caller does not belong to.
  const membership = await Membership.findOne({
    workspaceId,
    userId: req.user._id,
  });
  if (!membership) throw ApiError.forbidden('No workspace access');

  const projects = await service.listForWorkspace(workspaceId);
  return ApiResponse.ok(res, { projects });
}

async function update(req, res) {
  if (ROLE_RANK[req.membership.role] < ROLE_RANK.developer) {
    throw ApiError.forbidden('Requires developer role');
  }
  const project = await service.update(req.params.projectId, req.body);
  return ApiResponse.ok(res, { project });
}

module.exports = { create, list, update };
