/**
 * AWS SDK Configuration
 * Centralized AWS client initialization
 */

import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { TranslateClient } from '@aws-sdk/client-translate';
import { TranscribeClient } from '@aws-sdk/client-transcribe';

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

// Bedrock Runtime Client
export const bedrockClient = new BedrockRuntimeClient({
  region: AWS_REGION,
});

// DynamoDB Client
const dynamoClient = new DynamoDBClient({
  region: AWS_REGION,
});

export const docClient = DynamoDBDocumentClient.from(dynamoClient);

// S3 Client
export const s3Client = new S3Client({
  region: AWS_REGION,
});

// Translate Client
export const translateClient = new TranslateClient({
  region: AWS_REGION,
});

// Transcribe Client
export const transcribeClient = new TranscribeClient({
  region: AWS_REGION,
});

export const AWS_CONFIG = {
  region: AWS_REGION,
  s3Bucket: process.env.S3_BUCKET_NAME || 'yojanasathi-kb-dev',
  dynamoTable: process.env.DYNAMODB_TABLE_NAME || 'yojanasathi-analytics',
  bedrockModelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0',
  knowledgeBaseId: process.env.BEDROCK_KNOWLEDGE_BASE_ID || '',
};
