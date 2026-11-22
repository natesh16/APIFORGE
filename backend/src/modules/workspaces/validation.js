const { z } = require('zod');

const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(80),
  slug: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
});

const inviteMemberSchema = z.object({
  email: z.string().email().toLowerCase(),
  role: z.enum(['admin', 'developer', 'viewer']).default('developer'),
});

module.exports = { createWorkspaceSchema, inviteMemberSchema };
