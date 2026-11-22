const { z } = require('zod');
const { createEnv } = require('@apiforge/shared/config/env');

const env = createEnv(
  z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(5000),
    MONGODB_URI: z.string().min(1),
    REDIS_URL: z.string().min(1),
    JWT_ACCESS_SECRET: z.string().min(16),
    JWT_REFRESH_SECRET: z.string().min(16),
    JWT_ACCESS_TTL: z.string().default('15m'),
    JWT_REFRESH_TTL: z.string().default('7d'),
    API_KEY_PEPPER: z.string().min(16),
    FRONTEND_URL: z.string().url().default('http://localhost:5173'),
    GATEWAY_BASE_URL: z.string().url().default('http://localhost:5001'),
    LOG_LEVEL: z.string().default('info'),
  })
);

module.exports = env;
