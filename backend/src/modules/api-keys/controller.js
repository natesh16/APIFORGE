const ApiResponse = require('@apiforge/shared/utils/ApiResponse');
const service = require('./service');
const { recordAudit } = require('../../utils/audit');

async function create(req, res) {
  const result = await service.create(req.params.projectId, req.body);
  await recordAudit(req, 'api_key.create', 'ApiKey', result.apiKey._id);
  return ApiResponse.created(
    res,
    result,
    'API key created. Copy it now — it will not be shown again.'
  );
}

async function list(req, res) {
  const keys = await service.list(req.params.projectId);
  return ApiResponse.ok(res, { keys });
}

async function revoke(req, res) {
  const key = await service.revoke(req.params.keyId, req.params.projectId);
  await recordAudit(req, 'api_key.revoke', 'ApiKey', key._id);
  return ApiResponse.ok(res, { key }, 'API key revoked');
}

async function rotate(req, res) {
  const result = await service.rotate(
    req.params.keyId,
    req.params.projectId
  );
  await recordAudit(req, 'api_key.rotate', 'ApiKey', result.apiKey._id);
  return ApiResponse.ok(res, result, 'API key rotated');
}

module.exports = { create, list, revoke, rotate };
