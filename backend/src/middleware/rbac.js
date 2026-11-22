const Membership = require('@apiforge/shared/models/Membership');
const ApiError = require('../utils/ApiError');

const ROLE_RANK = { viewer: 1, developer: 2, admin: 3 };

/**
 * Require a minimum workspace role. Reads workspaceId from params, body,
 * or an already-resolved workspace.
 */
function requireRole(minRole) {
  return async (req, res, next) => {
    try {
      const workspaceId =
        req.params.workspaceId || req.body.workspaceId || req.workspace?.id;
      if (!workspaceId) throw ApiError.badRequest('workspaceId required');

      const membership = await Membership.findOne({
        workspaceId,
        userId: req.user._id,
      });

      if (!membership) throw ApiError.forbidden('Not a workspace member');
      if (ROLE_RANK[membership.role] < ROLE_RANK[minRole]) {
        throw ApiError.forbidden(`Requires ${minRole} role`);
      }

      req.membership = membership;
      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Require a minimum role on the project already loaded by enforceTenant.
 */
function requireProjectRole(minRole) {
  return (req, res, next) => {
    if (!req.membership) return next(ApiError.forbidden('No project access'));
    if (ROLE_RANK[req.membership.role] < ROLE_RANK[minRole]) {
      return next(ApiError.forbidden(`Requires ${minRole} role`));
    }
    next();
  };
}

module.exports = { requireRole, requireProjectRole, ROLE_RANK };
