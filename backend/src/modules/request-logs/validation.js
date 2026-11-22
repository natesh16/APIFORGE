const { z } = require('zod');

const listLogsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).default(50),
});

module.exports = { listLogsQuerySchema };
