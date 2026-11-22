const pino = require('pino');

function createLogger(level = process.env.LOG_LEVEL || 'info') {
  return pino({
    level,
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers["x-api-key"]',
        'req.body.password',
        'req.body.secret',
        '*.passwordHash',
        '*.keyHash',
      ],
      censor: '[REDACTED]',
    },
  });
}

module.exports = { createLogger };
