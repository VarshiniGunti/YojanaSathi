/**
 * Health Check Routes
 */

import express from 'express';
import { bedrockClient, docClient, s3Client } from '../config/aws.js';
import { logger } from '../config/logger.js';

const router = express.Router();

/**
 * GET /api/v1/health
 * Basic health check
 */
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * GET /api/v1/health/detailed
 * Detailed health check with AWS service status
 */
router.get('/detailed', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      bedrock: 'unknown',
      dynamodb: 'unknown',
      s3: 'unknown',
    },
  };

  // Check Bedrock
  try {
    await bedrockClient.config.region();
    health.services.bedrock = 'healthy';
  } catch (error) {
    health.services.bedrock = 'unhealthy';
    health.status = 'degraded';
  }

  // Check DynamoDB
  try {
    await docClient.config.region();
    health.services.dynamodb = 'healthy';
  } catch (error) {
    health.services.dynamodb = 'unhealthy';
    health.status = 'degraded';
  }

  // Check S3
  try {
    await s3Client.config.region();
    health.services.s3 = 'healthy';
  } catch (error) {
    health.services.s3 = 'unhealthy';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

export default router;
