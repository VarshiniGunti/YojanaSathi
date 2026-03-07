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
 * Detailed health check with AWS service configuration status
 */
router.get('/detailed', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      bedrock: 'configured',
      dynamodb: 'configured',
      s3: 'configured',
      translate: 'configured',
    },
    configuration: {
      bedrockModel: process.env.BEDROCK_MODEL_ID || 'default',
      s3Bucket: process.env.S3_BUCKET_NAME || 'default',
      dynamoTable: process.env.DYNAMODB_TABLE_NAME || 'default',
      region: process.env.AWS_REGION || 'us-east-1',
    },
  };

  // Simple configuration checks
  try {
    if (!process.env.BEDROCK_MODEL_ID) {
      health.services.bedrock = 'using-default';
    }
    if (!process.env.S3_BUCKET_NAME) {
      health.services.s3 = 'using-default';
    }
    if (!process.env.DYNAMODB_TABLE_NAME) {
      health.services.dynamodb = 'using-default';
    }
  } catch (error) {
    health.status = 'degraded';
    health.error = 'Configuration check failed';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

export default router;
