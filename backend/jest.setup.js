// Runs before any test module is imported. environment.js validates at import
// time, so every required variable must exist here first.
process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT || '5000';
process.env.MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apiforge_test';
process.env.REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
process.env.JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || 'test_access_secret_at_least_32_chars';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'test_refresh_secret_at_least_32_chars';
process.env.JWT_ACCESS_TTL = '15m';
process.env.JWT_REFRESH_TTL = '7d';
process.env.API_KEY_PEPPER =
  process.env.API_KEY_PEPPER || 'test_pepper_secret_at_least_32_chars';
process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.GATEWAY_BASE_URL = 'http://localhost:5001';
process.env.LOG_LEVEL = 'silent';
