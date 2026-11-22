const Project = require('@apiforge/shared/models/Project');
const ApiError = require('@apiforge/shared/utils/ApiError');

async function create(payload) {
  // Project slugs are globally unique for the demo gateway path.
  const existing = await Project.findOne({ slug: payload.slug });
  if (existing) throw ApiError.conflict('Project slug already exists');
  return Project.create(payload);
}

async function listForWorkspace(workspaceId) {
  return Project.find({ workspaceId }).sort({ createdAt: -1 });
}

async function update(projectId, patch) {
  const project = await Project.findByIdAndUpdate(projectId, patch, {
    new: true,
  });
  if (!project) throw ApiError.notFound('Project not found');
  return project;
}

module.exports = { create, listForWorkspace, update };
