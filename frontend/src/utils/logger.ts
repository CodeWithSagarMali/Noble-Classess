// Frontend logger utility - wraps console with severity levels
const isDev = import.meta.env.DEV;

export const logger = {
  info: (msg: string) => isDev && console.log(`%c[INFO] ${msg}`, 'color: #22c55e'),
  warn: (msg: string) => isDev && console.warn(`%c[WARN] ${msg}`, 'color: #f59e0b'),
  error: (msg: string, err?: unknown) => console.error(`%c[ERROR] ${msg}`, 'color: #ef4444', err ?? ''),
  debug: (msg: string) => isDev && console.debug(`%c[DEBUG] ${msg}`, 'color: #6366f1'),
};

export default logger;
