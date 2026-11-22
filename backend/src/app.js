const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const pinoHttp = require('pino-http');

const env = require('./config/environment');
const logger = require('./utils/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());
app.use(
  pinoHttp({
    logger,
    autoLogging: { ignore: (req) => req.url === '/health' },
  })
);

app.get('/health', (req, res) =>
  res.json({ status: 'ok', uptime: process.uptime() })
);

app.get('/ready', (req, res) => {
  const mongoose = require('mongoose');
  let redisOk = false;
  try {
    const { getRedis } = require('./config/redis');
    redisOk = getRedis().status === 'ready';
  } catch {
    redisOk = false;
  }
  const mongoOk = mongoose.connection.readyState === 1;
  const ready = mongoOk && redisOk;
  res.status(ready ? 200 : 503).json({
    status: ready ? 'ready' : 'not_ready',
    dependencies: { mongo: mongoOk, redis: redisOk },
  });
});

// Specific project sub-resources first, then the projects collection.
app.use('/api/v1/auth', require('./modules/auth/routes'));
app.use('/api/v1/workspaces', require('./modules/workspaces/routes'));
app.use(
  '/api/v1/projects/:projectId/keys',
  require('./modules/api-keys/routes')
);
app.use(
  '/api/v1/projects/:projectId/routes',
  require('./modules/api-routes/routes')
);
app.use(
  '/api/v1/projects/:projectId/analytics',
  require('./modules/analytics/routes')
);
app.use(
  '/api/v1/projects/:projectId/logs',
  require('./modules/request-logs/routes')
);
app.use('/api/v1/projects', require('./modules/projects/routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
