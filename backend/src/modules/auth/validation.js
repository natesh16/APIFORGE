const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(72),
  name: z.string().min(1).max(80).optional(),
});

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

module.exports = { registerSchema, loginSchema, refreshSchema };
