const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');

let loaded = false;

function loadDotenv() {
  if (loaded) return;
  dotenv.config({
    path: process.env.ENV_FILE || path.resolve(process.cwd(), '.env'),
  });
  loaded = true;
}

/**
 * Validate process.env against a zod schema.
 * Throws a clear error instead of exiting the process so tests and CI
 * can surface the problem without killing the worker.
 */
function createEnv(schema) {
  loadDotenv();
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.flatten().fieldErrors;
    const err = new Error(
      `Invalid environment configuration: ${JSON.stringify(details)}`
    );
    err.details = details;
    throw err;
  }
  return parsed.data;
}

module.exports = { createEnv };
