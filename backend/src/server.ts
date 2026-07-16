import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import app from './app';
import logger from './utils/logger';
import prisma from './config/db';

const PORT = process.env.PORT || 5000;

// Connect to database
prisma.$connect()
  .then(() => {
    logger.info('Database connection established successfully via Prisma ORM.');
    
    // Start listening
    const server = app.listen(PORT, () => {
      logger.info(`Noble Classes server listening on port ${PORT} in ${process.env.NODE_ENV} mode.`);
    });

    // Handle system shutdown gracefully
    const gracefulShutdown = async () => {
      logger.info('Shutting down server gracefully...');
      server.close(async () => {
        logger.info('HTTP server closed.');
        await prisma.$disconnect();
        logger.info('Database connections disconnected.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  })
  .catch((err) => {
    logger.error('Failed to establish database connection.', err);
    process.exit(1);
  });

// Catch global uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
  process.exit(1);
});

process.on('unhandledRejection', (err: any) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
  process.exit(1);
});
