const env = require('./config/environment');
const app = require('./app');
const { connectDatabase, disconnectDatabase } = require('./config/database');
const { connectRedis, disconnectRedis } = require('./config/redis');
const logger = require('./utils/logger');

async function start() {
  try {
    await connectDatabase();
    await connectRedis();

    const server = app.listen(env.PORT, () => {
      logger.info(`APIForge backend on http://localhost:${env.PORT}`);
    });

    const shutdown = async (signal) => {
      logger.info(`Received ${signal}, shutting down...`);
      server.close(async () => {
        await disconnectRedis();
        await disconnectDatabase();
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

start();
