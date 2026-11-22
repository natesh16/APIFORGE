const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('@apiforge/shared/utils/asyncHandler');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth');
const { enforceTenant } = require('../../middleware/tenant');
const { requireProjectRole } = require('../../middleware/rbac');
const ctrl = require('./controller');
const { listLogsQuerySchema } = require('./validation');

router.use(authenticate);
router.use(enforceTenant);

router.get(
  '/',
  requireProjectRole('viewer'),
  validate(listLogsQuerySchema, 'query'),
  asyncHandler(ctrl.list)
);

module.exports = router;
