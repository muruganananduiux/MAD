/**
 * Minimal Winston-style logger. Uses console but with levels + timestamps
 * so that logs are easy to grep in production.
 */
const LEVELS = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };
const level = (process.env.LOG_LEVEL || 'info').toLowerCase();
const currentLevel = LEVELS[level] ?? LEVELS.info;

function ts() {
  return new Date().toISOString();
}

function fmt(lvl, args) {
  const message = args
    .map((a) => (a instanceof Error ? `${a.message}\n${a.stack}` : typeof a === 'string' ? a : JSON.stringify(a)))
    .join(' ');
  return `[${ts()}] [${lvl.toUpperCase()}] ${message}`;
}

module.exports = {
  error: (...a) => currentLevel >= LEVELS.error && console.error(fmt('error', a)),
  warn: (...a) => currentLevel >= LEVELS.warn && console.warn(fmt('warn', a)),
  info: (...a) => currentLevel >= LEVELS.info && console.log(fmt('info', a)),
  http: (...a) => currentLevel >= LEVELS.http && console.log(fmt('http', a)),
  debug: (...a) => currentLevel >= LEVELS.debug && console.log(fmt('debug', a)),
};
