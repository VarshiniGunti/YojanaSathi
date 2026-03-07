/**
 * Request Validation Middleware
 * Uses Joi for schema validation
 */

import Joi from 'joi';
import { logger } from '../config/logger.js';

// User Profile Schema
export const userProfileSchema = Joi.object({
  age: Joi.number().integer().min(1).max(100).required(),
  income: Joi.string().valid(
    'Below ₹10,000 / month',
    '₹10,000 – ₹25,000 / month',
    '₹25,000 – ₹50,000 / month',
    'Above ₹50,000 / month'
  ).required(),
  category: Joi.string().valid('General', 'OBC', 'SC', 'ST', 'EWS').required(),
  occupation: Joi.string().valid(
    'Farmer',
    'Student',
    'Daily Wage Worker',
    'Self-Employed',
    'Street Vendor',
    'Salaried',
    'Homemaker',
    'Unemployed'
  ).required(),
  state: Joi.string().required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
});

// Search Request Schema
export const searchRequestSchema = Joi.object({
  userProfile: userProfileSchema.required(),
  query: Joi.string().allow('').optional(),
  language: Joi.string().valid('en', 'hi', 'te', 'ta', 'bn', 'mr', 'gu').default('en'),
});

/**
 * Validation middleware factory
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Validation error', { errors, body: JSON.stringify(req.body, null, 2) });

      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: errors,
      });
    }

    req.validatedBody = value;
    next();
  };
};

/**
 * Sanitize user input to prevent injection attacks
 */
export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = JSON.parse(JSON.stringify(req.body).replace(/<script[^>]*>.*?<\/script>/gi, ''));
  }
  next();
};
