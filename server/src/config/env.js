import 'dotenv/config';

const NODE_ENV = process.env.NODE_ENV || 'development';

function getEnv(name, defaultValue) {
  const value = process.env[name] || defaultValue;

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = Object.freeze({
  NODE_ENV,

  PORT: Number(process.env.PORT || 5000),

  MONGO_URI: getEnv(
    'MONGO_URI',
    'mongodb://127.0.0.1:27017/campusos_dev'
  ),

  JWT_SECRET: getEnv(
    'JWT_SECRET',
    'dev-secret-change-me'
  ),

  JWT_EXPIRES_IN:
    process.env.JWT_EXPIRES_IN || '7d',

  ALLOWED_COLLEGE_DOMAINS:
    (process.env.ALLOWED_COLLEGE_DOMAINS || '')
      .split(',')
      .map(domain => domain.trim().toLowerCase())
      .filter(Boolean),

  LOG_LEVEL:
    process.env.LOG_LEVEL || 'debug',
});