import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    logger.info(
      `MongoDB connected -> ${mongoose.connection.name}`
    );
  } catch (error) {
    logger.error(
      'MongoDB connection failed',
      error
    );

    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}