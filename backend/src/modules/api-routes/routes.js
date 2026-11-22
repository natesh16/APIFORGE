const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('@apiforge/shared/utils/asyncHandler');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth');
const { enforceTenant } = require('../../middleware/tenant');
const { requireProjectRole } = require('../../middleware/rbac');
const ctrl = require('./controller');
const { createRouteSchema, updateRouteSchema } = require('./validation');

router.use(authenticate);
router.use(enforceTenant);

router.post(
  '/',
  requireProjectRole('developer'),
  validate(createRouteSchema),
  asyncHandler(ctrl.create)
);
router.get('/', requireProjectRole('viewer'), asyncHandler(ctrl.list));
router.patch(
  '/:routeId',
  requireProjectRole('developer'),
  validate(updateRouteSchema),
  asyncHandler(ctrl.update)
);
router.delete(
  '/:routeId',
  requireProjectRole('developer'),
  asyncHandler(ctrl.remove)
);

module.exports = router;
