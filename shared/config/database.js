const mongoose = require('mongoose');

async function connectDatabase(uri, logger) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  logger?.info('MongoDB connected');
}

async function disconnectDatabase(logger) {
  await mongoose.disconnect();
  logger?.info('MongoDB disconnected');
}

module.exports = { connectDatabase, disconnectDatabase };
