
import { env } from '../config/env.js';

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const currentLevel = LEVELS[env.LOG_LEVEL] ?? LEVELS.info;

function log(level, ...args) {
  if (LEVELS[level] < currentLevel) return;
  const ts = new Date().toISOString();
  const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
  // eslint-disable-next-line no-console
  console[method](`[${ts}] [${level.toUpperCase()}]`, ...args);
}

export const logger = {
  debug: (...args) => log('debug', ...args),
  info: (...args) => log('info', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args),
};
