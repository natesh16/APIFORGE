const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('@apiforge/shared/utils/asyncHandler');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth');
const { enforceTenant } = require('../../middleware/tenant');
const { requireProjectRole } = require('../../middleware/rbac');
const ctrl = require('./controller');
const { createKeySchema } = require('./validation');

router.use(authenticate);
router.use(enforceTenant);

router.post(
  '/',
  requireProjectRole('developer'),
  validate(createKeySchema),
  asyncHandler(ctrl.create)
);
router.get('/', requireProjectRole('viewer'), asyncHandler(ctrl.list));
router.post(
  '/:keyId/revoke',
  requireProjectRole('developer'),
  asyncHandler(ctrl.revoke)
);
router.post(
  '/:keyId/rotate',
  requireProjectRole('developer'),
  asyncHandler(ctrl.rotate)
);

module.exports = router;
