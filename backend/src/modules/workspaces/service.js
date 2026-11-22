const crypto = require('crypto');

const Workspace = require('@apiforge/shared/models/Workspace');
const Membership = require('@apiforge/shared/models/Membership');
const User = require('@apiforge/shared/models/User');
const AuditLog = require('@apiforge/shared/models/AuditLog');
const ApiError = require('@apiforge/shared/utils/ApiError');

async function create(userId, { name, slug }) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'workspace';
  const finalSlug =
    slug || `${base}-${crypto.randomBytes(3).toString('hex')}`;

  const workspace = await Workspace.create({
    name,
    slug: finalSlug,
    ownerId: userId,
  });
  await Membership.create({
    workspaceId: workspace._id,
    userId,
    role: 'admin',
  });
  await AuditLog.create({
    workspaceId: workspace._id,
    actorId: userId,
    action: 'workspace.create',
    resourceType: 'Workspace',
    resourceId: workspace._id,
  });
  return workspace;
}

async function listForUser(userId) {
  const memberships = await Membership.find({ userId }).populate(
    'workspaceId'
  );
  return memberships
    .filter((m) => m.workspaceId)
    .map((m) => ({ ...m.workspaceId.toObject(), role: m.role }));
}

async function invite(workspaceId, actorId, { email, role }) {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw ApiError.notFound('Workspace not found');

  const user = await User.findOne({ email });
  if (!user) throw ApiError.badRequest('User must register first');

  const existing = await Membership.findOne({
    workspaceId,
    userId: user._id,
  });
  if (existing) throw ApiError.conflict('User already a member');

  const membership = await Membership.create({
    workspaceId,
    userId: user._id,
    role,
    invitationStatus: 'accepted',
  });
  await AuditLog.create({
    workspaceId,
    actorId,
    action: 'member.invite',
    resourceType: 'Membership',
    resourceId: membership._id,
    metadata: { role, email },
  });
  return membership;
}

module.exports = { create, listForUser, invite };
