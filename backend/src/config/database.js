const {
  connectDatabase,
  disconnectDatabase,
} = require('@apiforge/shared/config/database');
const env = require('./environment');
const logger = require('../utils/logger');

module.exports = {
  connectDatabase: () => connectDatabase(env.MONGODB_URI, logger),
  disconnectDatabase: () => disconnectDatabase(logger),
};
