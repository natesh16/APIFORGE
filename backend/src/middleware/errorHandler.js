const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

function notFound(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID';
  }
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate key';
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON body';
  }

  if (statusCode >= 500) logger.error({ err }, 'Unhandled error');

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(process.env.NODE_ENV === 'development' && statusCode >= 500
      ? { stack: err.stack }
      : {}),
  });
}

module.exports = { notFound, errorHandler };
