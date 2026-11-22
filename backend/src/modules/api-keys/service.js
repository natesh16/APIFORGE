const crypto = require('crypto');

const ApiKey = require('@apiforge/shared/models/ApiKey');
const Project = require('@apiforge/shared/models/Project');
const ApiError = require('@apiforge/shared/utils/ApiError');
const env = require('../../config/environment');

/**
 * Generate a cryptographically secure API key.
 * Format: af_{live|test}_{prefix}_{secret}
 * Only the prefix and HMAC hash are stored.
 */
function generateRawKey(environment = 'development') {
  const prefix = crypto.randomBytes(6).toString('hex');
  const secret = crypto.randomBytes(24).toString('hex');
  const envTag = environment === 'production' ? 'live' : 'test';
  const raw = `af_${envTag}_${prefix}_${secret}`;
  const keyHash = crypto
    .createHmac('sha256', env.API_KEY_PEPPER)
    .update(raw)
    .digest('hex');
  return { raw, keyPrefix: `af_${envTag}_${prefix}`, keyHash };
}

async function create(projectId, payload) {
  const project = await Project.findById(projectId);
  if (!project) throw ApiError.notFound('Project not found');

  const { raw, keyPrefix, keyHash } = generateRawKey(project.environment);
  const key = await ApiKey.create({
    projectId,
    name: payload.name || 'API Key',
    keyPrefix,
    keyHash,
    scopes: payload.scopes || [],
    rateLimit: payload.rateLimit || { limit: 100, windowSeconds: 60 },
    expiresAt: payload.expiresAt,
  });

  // The raw key is returned exactly once.
  return { apiKey: key, rawKey: raw };
}

async function list(projectId) {
  return ApiKey.find({ projectId }).sort({ createdAt: -1 });
}

async function revoke(keyId, projectId) {
  const key = await ApiKey.findOneAndUpdate(
    { _id: keyId, projectId },
    { revokedAt: new Date() },
    { new: true }
  );
  if (!key) throw ApiError.notFound('API key not found');
  return key;
}

async function rotate(keyId, projectId) {
  const key = await ApiKey.findOne({ _id: keyId, projectId });
  if (!key) throw ApiError.notFound('API key not found');

  const project = await Project.findById(key.projectId);
  const { raw, keyPrefix, keyHash } = generateRawKey(project?.environment);

  key.keyPrefix = keyPrefix;
  key.keyHash = keyHash;
  key.revokedAt = null;
  await key.save();
  return { apiKey: key, rawKey: raw };
}

module.exports = { create, list, revoke, rotate, generateRawKey };
