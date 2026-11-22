const { z } = require('zod');

const handlerConfigSchema = z.union([
  z.object({ type: z.literal('STATIC_JSON'), payload: z.any() }),
  z.object({
    type: z.literal('HTTP_PROXY'),
    targetUrl: z.string().url(),
    method: z.string().optional(),
    headers: z.record(z.string()).optional(),
    timeoutMs: z.number().int().positive().max(30000).default(10000),
  }),
]);

const createRouteSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  path: z.string().min(1).max(200),
  handlerType: z.enum(['STATIC_JSON', 'HTTP_PROXY']),
  handlerConfig: handlerConfigSchema,
  cacheTTL: z.number().int().min(0).max(86400).default(0),
  requiredScopes: z.array(z.string()).default([]),
  enabled: z.boolean().default(true),
});

const updateRouteSchema = createRouteSchema.partial();

module.exports = { createRouteSchema, updateRouteSchema };
