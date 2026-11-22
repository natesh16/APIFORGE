const { z } = require('zod');

const createProjectSchema = z.object({
  workspaceId: z.string().length(24),
  name: z.string().min(1).max(80),
  slug: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9-]+$/),
  environment: z.enum(['development', 'production']).default('development'),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  environment: z.enum(['development', 'production']).optional(),
  status: z.enum(['active', 'suspended']).optional(),
});

const listProjectsQuerySchema = z.object({
  workspaceId: z.string().length(24).optional(),
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  listProjectsQuerySchema,
};
