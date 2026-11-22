const { createRedisClient } = require('@apiforge/shared/config/redis');
const env = require('./environment');
const logger = require('../utils/logger');

let client;
let subscriber;
let publisher;

async function connectRedis() {
  client = createRedisClient(env.REDIS_URL, { role: 'client', logger });
  subscriber = createRedisClient(env.REDIS_URL, { role: 'subscriber', logger });
  publisher = createRedisClient(env.REDIS_URL, { role: 'publisher', logger });

  await Promise.all([
    client.connect(),
    subscriber.connect(),
    publisher.connect(),
  ]);
  logger.info('Redis connected');
}

async function disconnectRedis() {
  await Promise.allSettled([
    client?.quit(),
    subscriber?.quit(),
    publisher?.quit(),
  ]);
}

function getRedis() {
  if (!client) throw new Error('Redis not initialised');
  return client;
}

module.exports = { connectRedis, disconnectRedis, getRedis };
