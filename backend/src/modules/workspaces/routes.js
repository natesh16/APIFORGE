const router = require('express').Router();
const asyncHandler = require('@apiforge/shared/utils/asyncHandler');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/rbac');
const ctrl = require('./controller');
const { createWorkspaceSchema, inviteMemberSchema } = require('./validation');

router.use(authenticate);

router.post('/', validate(createWorkspaceSchema), asyncHandler(ctrl.create));
router.get('/', asyncHandler(ctrl.list));
router.post(
  '/:workspaceId/members',
  requireRole('admin'),
  validate(inviteMemberSchema),
  asyncHandler(ctrl.invite)
);

module.exports = router;
