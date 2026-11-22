const router = require('express').Router({ mergeParams: true });
const asyncHandler = require('@apiforge/shared/utils/asyncHandler');
const { authenticate } = require('../../middleware/auth');
const { enforceTenant } = require('../../middleware/tenant');
const { requireProjectRole } = require('../../middleware/rbac');
const ctrl = require('./controller');

router.use(authenticate);
router.use(enforceTenant);

router.get('/overview', requireProjectRole('viewer'), asyncHandler(ctrl.overview));

module.exports = router;
