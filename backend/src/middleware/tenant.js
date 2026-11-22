const Project = require('@apiforge/shared/models/Project');
const Membership = require('@apiforge/shared/models/Membership');
const ApiError = require('../utils/ApiError');

/**
 * Loads project -> membership for the current user and attaches both to req.
 * Every /projects/:projectId/* route runs through this.
 */
async function enforceTenant(req, res, next) {
  try {
    const userId = req.user._id;
    const { projectId } = req.params;
    if (!projectId) return next(ApiError.badRequest('projectId required'));

    const project = await Project.findById(projectId);
    if (!project) throw ApiError.notFound('Project not found');

    const membership = await Membership.findOne({
      workspaceId: project.workspaceId,
      userId,
    });
    if (!membership) throw ApiError.forbidden('No access to this project');

    req.project = project;
    req.membership = membership;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { enforceTenant };
