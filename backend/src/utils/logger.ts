enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

const formatMessage = (level: LogLevel, message: string): string => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}]: ${message}`;
};

export const logger = {
  info: (message: string) => {
    console.log(`\x1b[32m${formatMessage(LogLevel.INFO, message)}\x1b[0m`);
  },
  warn: (message: string) => {
    console.warn(`\x1b[33m${formatMessage(LogLevel.WARN, message)}\x1b[0m`);
  },
  error: (message: string, error?: any) => {
    console.error(`\x1b[31m${formatMessage(LogLevel.ERROR, message)}\x1b[0m`, error || '');
  },
  debug: (message: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\x1b[36m${formatMessage(LogLevel.DEBUG, message)}\x1b[0m`);
    }
  },
};

export default logger;
