const ApiRoute = require('@apiforge/shared/models/ApiRoute');
const ApiError = require('@apiforge/shared/utils/ApiError');

async function create(projectId, payload) {
  const existing = await ApiRoute.findOne({
    projectId,
    method: payload.method,
    path: payload.path,
  });
  if (existing) throw ApiError.conflict('Route already registered');

  return ApiRoute.create({ projectId, ...payload });
}

async function list(projectId) {
  return ApiRoute.find({ projectId }).sort({ createdAt: -1 });
}

async function update(routeId, projectId, patch) {
  const route = await ApiRoute.findOneAndUpdate(
    { _id: routeId, projectId },
    patch,
    { new: true }
  );
  if (!route) throw ApiError.notFound('Route not found');
  return route;
}

async function remove(routeId, projectId) {
  const route = await ApiRoute.findOneAndDelete({ _id: routeId, projectId });
  if (!route) throw ApiError.notFound('Route not found');
  return route;
}

module.exports = { create, list, update, remove };
