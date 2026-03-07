/**
 * Global Error Handler Middleware
 */

import { logger } from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Bedrock specific errors
  if (err.name === 'ThrottlingException') {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'AI service is temporarily busy. Please try again in a moment.',
    });
  }

  if (err.name === 'ValidationException') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
    });
  }

  // AWS SDK errors
  if (err.$metadata) {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'AWS service temporarily unavailable. Please try again.',
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred'
    : err.message;

  res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
};
