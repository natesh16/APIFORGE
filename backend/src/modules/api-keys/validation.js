const { z } = require('zod');

const createKeySchema = z.object({
  name: z.string().min(1).max(80).optional(),
  scopes: z.array(z.string()).default([]),
  rateLimit: z
    .object({
      limit: z.number().int().positive().max(100000).default(100),
      windowSeconds: z.number().int().positive().max(86400).default(60),
    })
    .optional(),
  expiresAt: z.string().datetime().optional(),
});

module.exports = { createKeySchema };
