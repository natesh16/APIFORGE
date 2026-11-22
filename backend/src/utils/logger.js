const { createLogger } = require('@apiforge/shared/utils/logger');
const env = require('../config/environment');

module.exports = createLogger(env.LOG_LEVEL);
