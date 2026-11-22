const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('@apiforge/shared/models/User');
const Workspace = require('@apiforge/shared/models/Workspace');
const Membership = require('@apiforge/shared/models/Membership');
const ApiError = require('@apiforge/shared/utils/ApiError');
const env = require('../../config/environment');

const BCRYPT_ROUNDS = 12;

function signAccess(user) {
  return jwt.sign({ sub: user._id.toString() }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_TTL,
  });
}

function signRefresh(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      jti: crypto.randomBytes(16).toString('hex'),
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_TTL }
  );
}

async function register({ email, password, name }) {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('Email already registered');

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await User.create({ email, passwordHash, name });

  const base =
    email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'workspace';
  const slug = `${base}-${crypto.randomBytes(3).toString('hex')}`;

  const workspace = await Workspace.create({
    name: `${name || email}'s Workspace`,
    slug,
    ownerId: user._id,
  });
  await Membership.create({
    workspaceId: workspace._id,
    userId: user._id,
    role: 'admin',
  });

  return { user, workspace };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw ApiError.unauthorized('Invalid credentials');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw ApiError.unauthorized('Invalid credentials');
  if (user.status !== 'active') throw ApiError.unauthorized('Account suspended');

  user.lastLoginAt = new Date();
  await user.save();

  return {
    user,
    accessToken: signAccess(user),
    refreshToken: signRefresh(user),
  };
}

async function refresh({ refreshToken }) {
  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user || user.status !== 'active') {
      throw ApiError.unauthorized('Invalid session');
    }
    return { accessToken: signAccess(user) };
  } catch (err) {
    if (err.isOperational) throw err;
    throw ApiError.unauthorized('Invalid refresh token');
  }
}

module.exports = { register, login, refresh, signAccess, signRefresh };
