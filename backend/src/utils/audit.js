const AuditLog = require('@apiforge/shared/models/AuditLog');

/**
 * Best-effort audit trail. Logging failures must never break a request.
 */
async function recordAudit(req, action, resourceType, resourceId, metadata) {
  try {
    const workspaceId =
      req.project?.workspaceId || req.workspace?._id || req.body.workspaceId;
    if (!workspaceId || !req.user) return;
    await AuditLog.create({
      workspaceId,
      actorId: req.user._id,
      action,
      resourceType,
      resourceId,
      metadata,
    });
  } catch {
    // swallow: audit is non-critical
  }
}

module.exports = { recordAudit };
