#!/bin/bash

# YojanaSathi AWS Infrastructure Setup Script (Linux/Mac)
# This script creates all required AWS resources for the project

set -e

echo "🚀 YojanaSathi AWS Infrastructure Setup"
echo "========================================"
echo ""

# Configuration
REGION="us-east-1"
S3_BUCKET="yojanasathi-kb-dev"
DYNAMODB_TABLE="yojanasathi-analytics"
IAM_ROLE="yojanasathi-lambda-role"
BEDROCK_MODEL="anthropic.claude-sonnet-4-v1"
SCHEMES_DIR="../schemes/markdown"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Step 1: Verify AWS CLI Configuration
echo -e "${YELLOW}Step 1: Verifying AWS CLI configuration...${NC}"

if aws sts get-caller-identity &> /dev/null; then
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    USER_ARN=$(aws sts get-caller-identity --query Arn --output text)
    echo -e "${GREEN}✅ AWS CLI configured successfully${NC}"
    echo -e "${GRAY}   Account: $ACCOUNT_ID${NC}"
    echo -e "${GRAY}   User: $USER_ARN${NC}"
else
    echo -e "${RED}❌ AWS CLI not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo ""

# Step 2: Create S3 Bucket
echo -e "${YELLOW}Step 2: Creating S3 bucket...${NC}"

if aws s3 ls "s3://$S3_BUCKET" &> /dev/null; then
    echo -e "${GREEN}✅ S3 bucket already exists: $S3_BUCKET${NC}"
else
    if aws s3 mb "s3://$S3_BUCKET" --region $REGION; then
        echo -e "${GREEN}✅ Created S3 bucket: $S3_BUCKET${NC}"
    else
        echo -e "${YELLOW}⚠️  S3 bucket creation skipped (may already exist)${NC}"
    fi
fi

echo ""

# Step 3: Create DynamoDB Table
echo -e "${YELLOW}Step 3: Creating DynamoDB table...${NC}"

if aws dynamodb describe-table --table-name $DYNAMODB_TABLE --region $REGION &> /dev/null; then
    echo -e "${GREEN}✅ DynamoDB table already exists: $DYNAMODB_TABLE${NC}"
else
    aws dynamodb create-table \
        --table-name $DYNAMODB_TABLE \
        --attribute-definitions AttributeName=queryId,AttributeType=S \
        --key-schema AttributeName=queryId,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST \
        --region $REGION > /dev/null
    
    echo -e "${GREEN}✅ Created DynamoDB table: $DYNAMODB_TABLE${NC}"
    echo -e "${GRAY}   Waiting for table to be active...${NC}"
    
    aws dynamodb wait table-exists --table-name $DYNAMODB_TABLE --region $REGION
    echo -e "${GRAY}   Table is now active${NC}"
fi

echo ""

# Step 4: Create IAM Role
echo -e "${YELLOW}Step 4: Creating IAM role for Lambda...${NC}"

# Create trust policy
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

if aws iam get-role --role-name $IAM_ROLE &> /dev/null; then
    echo -e "${GREEN}✅ IAM role already exists: $IAM_ROLE${NC}"
else
    aws iam create-role \
        --role-name $IAM_ROLE \
        --assume-role-policy-document file://trust-policy.json \
        --description "Execution role for YojanaSathi Lambda function" > /dev/null
    
    echo -e "${GREEN}✅ Created IAM role: $IAM_ROLE${NC}"
    
    # Wait for role to propagate
    sleep 5
fi

# Attach policies
echo -e "${GRAY}   Attaching policies...${NC}"

POLICIES=(
    "arn:aws:iam::aws:policy/AmazonBedrockFullAccess"
    "arn:aws:iam::aws:policy/AmazonS3FullAccess"
    "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
    "arn:aws:iam::aws:policy/TranslateFullAccess"
    "arn:aws:iam::aws:policy/AmazonTranscribeFullAccess"
    "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
)

for policy in "${POLICIES[@]}"; do
    aws iam attach-role-policy --role-name $IAM_ROLE --policy-arn $policy 2>&1 > /dev/null || true
done

echo -e "${GREEN}✅ Attached all required policies${NC}"

# Cleanup
rm -f trust-policy.json

echo ""

# Step 5: Upload Scheme Documents
echo -e "${YELLOW}Step 5: Uploading scheme documents to S3...${NC}"

if [ -d "$SCHEMES_DIR" ]; then
    MD_COUNT=$(find $SCHEMES_DIR -name "*.md" | wc -l)
    
    if [ $MD_COUNT -gt 0 ]; then
        aws s3 sync $SCHEMES_DIR "s3://$S3_BUCKET/schemes/" --region $REGION
        echo -e "${GREEN}✅ Uploaded $MD_COUNT scheme documents to S3${NC}"
    else
        echo -e "${YELLOW}⚠️  No markdown files found in $SCHEMES_DIR${NC}"
        echo -e "${GRAY}   Run 'npm run convert-schemes' in backend directory first${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Schemes directory not found: $SCHEMES_DIR${NC}"
    echo -e "${GRAY}   Run 'npm run convert-schemes' in backend directory first${NC}"
fi

echo ""

# Step 6: Test Bedrock Access
echo -e "${YELLOW}Step 6: Testing Amazon Bedrock access...${NC}"

cat > bedrock-test-payload.json << EOF
{
  "anthropic_version": "bedrock-2023-05-31",
  "max_tokens": 100,
  "messages": [
    {
      "role": "user",
      "content": "Say 'Hello from YojanaSathi' in one sentence."
    }
  ]
}
EOF

if aws bedrock-runtime invoke-model \
    --model-id $BEDROCK_MODEL \
    --body file://bedrock-test-payload.json \
    --region $REGION \
    bedrock-response.json &> /dev/null; then
    
    RESPONSE=$(cat bedrock-response.json | jq -r '.content[0].text')
    echo -e "${GREEN}✅ Bedrock access verified successfully${NC}"
    echo -e "${GRAY}   Model: $BEDROCK_MODEL${NC}"
    echo -e "${GRAY}   Response: $RESPONSE${NC}"
else
    echo -e "${RED}❌ Bedrock access test failed${NC}"
    echo -e "${GRAY}   Make sure you have enabled model access in Bedrock console${NC}"
fi

# Cleanup
rm -f bedrock-test-payload.json bedrock-response.json

echo ""

# Summary
echo "========================================"
echo -e "${GREEN}🎉 AWS Infrastructure Setup Complete!${NC}"
echo "========================================"
echo ""
echo -e "${GREEN}Resources Created:${NC}"
echo -e "  ✅ S3 Bucket: $S3_BUCKET"
echo -e "  ✅ DynamoDB Table: $DYNAMODB_TABLE"
echo -e "  ✅ IAM Role: $IAM_ROLE"
echo -e "  ✅ Scheme Documents: Uploaded to S3"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update backend/.env with your configuration"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:5173"
echo ""
echo -e "${GRAY}For deployment to Lambda, see: backend/scripts/deploy-lambda.sh${NC}"
