const jwt = require('jsonwebtoken');
const env = require('../config/environment');
const ApiError = require('../utils/ApiError');
const User = require('@apiforge/shared/models/User');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw ApiError.unauthorized('Missing access token');

    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.sub);
    if (!user || user.status !== 'active') {
      throw ApiError.unauthorized('Invalid session');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token expired'));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid token'));
    }
    next(err);
  }
}

module.exports = { authenticate };
