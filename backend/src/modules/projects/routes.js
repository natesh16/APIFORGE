const router = require('express').Router();
const asyncHandler = require('@apiforge/shared/utils/asyncHandler');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth');
const { enforceTenant } = require('../../middleware/tenant');
const ctrl = require('./controller');
const {
  createProjectSchema,
  updateProjectSchema,
  listProjectsQuerySchema,
} = require('./validation');

router.use(authenticate);

router.post('/', validate(createProjectSchema), asyncHandler(ctrl.create));
router.get(
  '/',
  validate(listProjectsQuerySchema, 'query'),
  asyncHandler(ctrl.list)
);
router.patch(
  '/:projectId',
  enforceTenant,
  validate(updateProjectSchema),
  asyncHandler(ctrl.update)
);

module.exports = router;
