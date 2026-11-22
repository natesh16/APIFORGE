const ApiResponse = require('@apiforge/shared/utils/ApiResponse');
const service = require('./service');

async function register(req, res) {
  const { user } = await service.register(req.body);
  return ApiResponse.created(res, { user }, 'Account created');
}

async function login(req, res) {
  const result = await service.login(req.body);
  return ApiResponse.ok(res, result);
}

async function refresh(req, res) {
  const result = await service.refresh(req.body);
  return ApiResponse.ok(res, result);
}

async function me(req, res) {
  return ApiResponse.ok(res, { user: req.user });
}

module.exports = { register, login, refresh, me };
