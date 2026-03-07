# YojanaSathi AWS Infrastructure Setup Script (Windows PowerShell)
# This script creates all required AWS resources for the project

$ErrorActionPreference = "Stop"

Write-Host "🚀 YojanaSathi AWS Infrastructure Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$REGION = "us-east-1"
$S3_BUCKET = "yojanasathi-kb-dev"
$DYNAMODB_TABLE = "yojanasathi-analytics"
$IAM_ROLE = "yojanasathi-lambda-role"
$BEDROCK_MODEL = "anthropic.claude-sonnet-4-v1"
$SCHEMES_DIR = "../schemes/markdown"

# Step 1: Verify AWS CLI Configuration
Write-Host "Step 1: Verifying AWS CLI configuration..." -ForegroundColor Yellow

try {
    $identity = aws sts get-caller-identity --output json | ConvertFrom-Json
    Write-Host "✅ AWS CLI configured successfully" -ForegroundColor Green
    Write-Host "   Account: $($identity.Account)" -ForegroundColor Gray
    Write-Host "   User: $($identity.Arn)" -ForegroundColor Gray
} catch {
    Write-Host "❌ AWS CLI not configured. Please run 'aws configure' first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Create S3 Bucket
Write-Host "Step 2: Creating S3 bucket..." -ForegroundColor Yellow

try {
    $bucketExists = aws s3 ls "s3://$S3_BUCKET" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ S3 bucket already exists: $S3_BUCKET" -ForegroundColor Green
    } else {
        aws s3 mb "s3://$S3_BUCKET" --region $REGION
        Write-Host "✅ Created S3 bucket: $S3_BUCKET" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  S3 bucket creation skipped (may already exist)" -ForegroundColor Yellow
}

Write-Host ""

# Step 3: Create DynamoDB Table
Write-Host "Step 3: Creating DynamoDB table..." -ForegroundColor Yellow

try {
    $tableExists = aws dynamodb describe-table --table-name $DYNAMODB_TABLE --region $REGION 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ DynamoDB table already exists: $DYNAMODB_TABLE" -ForegroundColor Green
    } else {
        aws dynamodb create-table `
            --table-name $DYNAMODB_TABLE `
            --attribute-definitions AttributeName=queryId,AttributeType=S `
            --key-schema AttributeName=queryId,KeyType=HASH `
            --billing-mode PAY_PER_REQUEST `
            --region $REGION | Out-Null
        
        Write-Host "✅ Created DynamoDB table: $DYNAMODB_TABLE" -ForegroundColor Green
        Write-Host "   Waiting for table to be active..." -ForegroundColor Gray
        
        aws dynamodb wait table-exists --table-name $DYNAMODB_TABLE --region $REGION
        Write-Host "   Table is now active" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠️  DynamoDB table creation skipped (may already exist)" -ForegroundColor Yellow
}

Write-Host ""

# Step 4: Create IAM Role
Write-Host "Step 4: Creating IAM role for Lambda..." -ForegroundColor Yellow

# Create trust policy document
$trustPolicy = @"
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
"@

$trustPolicyFile = "trust-policy.json"
$trustPolicy | Out-File -FilePath $trustPolicyFile -Encoding utf8

try {
    $roleExists = aws iam get-role --role-name $IAM_ROLE 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ IAM role already exists: $IAM_ROLE" -ForegroundColor Green
    } else {
        aws iam create-role `
            --role-name $IAM_ROLE `
            --assume-role-policy-document file://$trustPolicyFile `
            --description "Execution role for YojanaSathi Lambda function" | Out-Null
        
        Write-Host "✅ Created IAM role: $IAM_ROLE" -ForegroundColor Green
        
        # Wait a moment for role to propagate
        Start-Sleep -Seconds 5
    }
    
    # Attach policies
    Write-Host "   Attaching policies..." -ForegroundColor Gray
    
    $policies = @(
        "arn:aws:iam::aws:policy/AmazonBedrockFullAccess",
        "arn:aws:iam::aws:policy/AmazonS3FullAccess",
        "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess",
        "arn:aws:iam::aws:policy/TranslateFullAccess",
        "arn:aws:iam::aws:policy/AmazonTranscribeFullAccess",
        "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
    )
    
    foreach ($policy in $policies) {
        aws iam attach-role-policy --role-name $IAM_ROLE --policy-arn $policy 2>&1 | Out-Null
    }
    
    Write-Host "✅ Attached all required policies" -ForegroundColor Green
    
} catch {
    Write-Host "⚠️  IAM role setup completed with warnings" -ForegroundColor Yellow
} finally {
    Remove-Item $trustPolicyFile -ErrorAction SilentlyContinue
}

Write-Host ""

# Step 5: Upload Scheme Documents to S3
Write-Host "Step 5: Uploading scheme documents to S3..." -ForegroundColor Yellow

if (Test-Path $SCHEMES_DIR) {
    $markdownFiles = Get-ChildItem -Path $SCHEMES_DIR -Filter "*.md"
    
    if ($markdownFiles.Count -gt 0) {
        aws s3 sync $SCHEMES_DIR "s3://$S3_BUCKET/schemes/" --region $REGION
        Write-Host "✅ Uploaded $($markdownFiles.Count) scheme documents to S3" -ForegroundColor Green
    } else {
        Write-Host "⚠️  No markdown files found in $SCHEMES_DIR" -ForegroundColor Yellow
        Write-Host "   Run 'npm run convert-schemes' in backend directory first" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠️  Schemes directory not found: $SCHEMES_DIR" -ForegroundColor Yellow
    Write-Host "   Run 'npm run convert-schemes' in backend directory first" -ForegroundColor Gray
}

Write-Host ""

# Step 6: Test Bedrock Access
Write-Host "Step 6: Testing Amazon Bedrock access..." -ForegroundColor Yellow

$testPayload = @"
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
"@

$testPayloadFile = "bedrock-test-payload.json"
$testPayload | Out-File -FilePath $testPayloadFile -Encoding utf8

try {
    $response = aws bedrock-runtime invoke-model `
        --model-id $BEDROCK_MODEL `
        --body file://$testPayloadFile `
        --region $REGION `
        bedrock-response.json 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $responseContent = Get-Content bedrock-response.json | ConvertFrom-Json
        Write-Host "✅ Bedrock access verified successfully" -ForegroundColor Green
        Write-Host "   Model: $BEDROCK_MODEL" -ForegroundColor Gray
        Write-Host "   Response: $($responseContent.content[0].text)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Bedrock access test failed" -ForegroundColor Red
        Write-Host "   Make sure you have enabled model access in Bedrock console" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Bedrock access test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Make sure you have enabled model access in Bedrock console" -ForegroundColor Gray
} finally {
    Remove-Item $testPayloadFile -ErrorAction SilentlyContinue
    Remove-Item bedrock-response.json -ErrorAction SilentlyContinue
}

Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 AWS Infrastructure Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Resources Created:" -ForegroundColor Cyan
Write-Host "  ✅ S3 Bucket: $S3_BUCKET" -ForegroundColor Green
Write-Host "  ✅ DynamoDB Table: $DYNAMODB_TABLE" -ForegroundColor Green
Write-Host "  ✅ IAM Role: $IAM_ROLE" -ForegroundColor Green
Write-Host "  ✅ Scheme Documents: Uploaded to S3" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update backend/.env with your configuration" -ForegroundColor White
Write-Host "2. Start backend: cd backend; npm run dev" -ForegroundColor White
Write-Host "3. Start frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host "4. Open http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "For deployment to Lambda, see: backend/scripts/deploy-lambda.sh" -ForegroundColor Gray
