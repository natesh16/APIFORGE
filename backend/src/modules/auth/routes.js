const router = require('express').Router();
const asyncHandler = require('@apiforge/shared/utils/asyncHandler');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth');
const ctrl = require('./controller');
const { registerSchema, loginSchema, refreshSchema } = require('./validation');

router.post('/register', validate(registerSchema), asyncHandler(ctrl.register));
router.post('/login', validate(loginSchema), asyncHandler(ctrl.login));
router.post('/refresh', validate(refreshSchema), asyncHandler(ctrl.refresh));
router.get('/me', authenticate, asyncHandler(ctrl.me));

module.exports = router;
