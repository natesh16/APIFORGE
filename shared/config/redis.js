const Redis = require('ioredis');

/**
 * Create an ioredis client. `maxRetriesPerRequest: null` is required for
 * BullMQ; it is harmless for the management API.
 */
function createRedisClient(url, { role = 'client', logger } = {}) {
  const client = new Redis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: true,
  });
  client.on('error', (err) => logger?.error({ err, role }, 'Redis error'));
  return client;
}

module.exports = { createRedisClient };
