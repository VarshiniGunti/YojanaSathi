/**
 * Analytics Service
 * Logs queries to DynamoDB for analytics (no PII)
 */

import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, AWS_CONFIG } from '../config/aws.js';
import { logger } from '../config/logger.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Log search query to DynamoDB
 * Only stores: profession, state, category, timestamp, schemes_count
 * Does NOT store: age, income, gender (privacy)
 */
export async function logQuery(userProfile, schemesCount, language) {
  try {
    const queryId = uuidv4();
    const timestamp = new Date().toISOString();

    const item = {
      queryId,
      timestamp,
      profession: userProfile.occupation,
      state: userProfile.state,
      category: userProfile.category,
      language,
      schemesCount,
      // Explicitly NOT storing: age, income, gender
    };

    const command = new PutCommand({
      TableName: AWS_CONFIG.dynamoTable,
      Item: item,
    });

    await docClient.send(command);

    logger.info('Query logged to DynamoDB', {
      queryId,
      profession: userProfile.occupation,
      state: userProfile.state,
    });

    return queryId;

  } catch (error) {
    // Non-blocking - don't fail the request if analytics logging fails
    logger.error('Failed to log query to DynamoDB', {
      error: error.message,
    });

    return null;
  }
}

/**
 * Get analytics summary (for admin dashboard - future feature)
 */
export async function getAnalyticsSummary() {
  // TODO: Implement analytics aggregation
  // This would query DynamoDB and return:
  // - Total queries
  // - Queries by profession
  // - Queries by state
  // - Queries by category
  // - Average schemes per query

  return {
    message: 'Analytics summary not yet implemented',
  };
}
