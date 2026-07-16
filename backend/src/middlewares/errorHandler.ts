import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import logger from '../utils/logger';

const handlePrismaUniqueConstraintError = (err: any) => {
  const target = err.meta?.target ? ` (${err.meta.target.join(', ')})` : '';
  const message = `Duplicate field value${target}. Please use another value!`;
  return new AppError(message, 400);
};

const handlePrismaValidationError = (err: any) => {
  const message = `Invalid input data: ${err.message}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: AppError | any, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError | any, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak details
    logger.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our end. Please try again later.',
    });
  }
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    let error = { ...err, message: err.message, stack: err.stack };

    if (err.code === 'P2002') error = handlePrismaUniqueConstraintError(err);
    if (err.name === 'PrismaClientValidationError') error = handlePrismaValidationError(err);

    sendErrorDev(error, res);
  } else {
    let error = { ...err, message: err.message };

    if (err.code === 'P2002') error = handlePrismaUniqueConstraintError(err);
    if (err.name === 'PrismaClientValidationError') error = handlePrismaValidationError(err);

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
