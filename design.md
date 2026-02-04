# System Design Document
## YojanaSathi – AI Government Scheme Finder

### Document Information
- **Project Name**: YojanaSathi
- **Version**: 1.0
- **Date**: February 4, 2026
- **Document Type**: System Design Document
- **Architecture**: Serverless RAG on AWS

---

## 1. High-Level Architecture

### 1.1 Architecture Overview
YojanaSathi implements a serverless Retrieval-Augmented Generation (RAG) architecture on AWS, designed for cost-effective scaling and high availability. The system processes user profiles, retrieves relevant government schemes, and generates personalized recommendations using AI reasoning.

### 1.2 Architecture Diagram (Textual Description)
```
[User Interface (React)] 
    ↓ HTTPS
[CloudFront CDN] 
    ↓
[API Gateway] 
    ↓ Lambda Proxy Integration
[Orchestration Lambda] 
    ↓ Parallel Processing
[Voice Processing]     [Translation]     [RAG Pipeline]
[Amazon Transcribe] → [Amazon Translate] → [Bedrock Knowledge Base]
    ↓                      ↓                      ↓
[Session Storage]      [Language Detection]   [OpenSearch Vector DB]
[DynamoDB]                 ↓                      ↓
    ↓                  [Response Translation] ← [Bedrock LLM]
[User Consent Mgmt]        ↓                      ↓
    ↓                  [Structured Output]   [Eligibility Reasoning]
[Privacy Controls] ←   [JSON Response]   ←   [Scheme Ranking]
```

### 1.3 Component Stack
- **Frontend**: React 18 + Tailwind CSS + Vite
- **CDN**: AWS CloudFront
- **API Gateway**: AWS API Gateway (REST API)
- **Compute**: AWS Lambda (Node.js 18.x)
- **AI/ML**: Amazon Bedrock (Claude 3 Sonnet)
- **Knowledge Base**: Bedrock Knowledge Base + OpenSearch Serverless
- **Storage**: Amazon S3 (scheme documents, embeddings)
- **Database**: DynamoDB (session storage, user consent)
- **Voice**: Amazon Transcribe
- **Translation**: Amazon Translate
- **Monitoring**: CloudWatch + X-Ray

---

## 2. Component Design

### 2.1 Frontend Layer

#### 2.1.1 React Application Structure
```
src/
├── components/
│   ├── ProfileForm.jsx          # User profile input
│   ├── VoiceInput.jsx           # Voice recording component
│   ├── LanguageSelector.jsx     # Language selection
│   ├── SchemeCard.jsx           # Scheme display component
│   ├── EligibilityExplainer.jsx # Eligibility reasoning display
│   └── ApplicationGuide.jsx     # Step-by-step guidance
├── pages/
│   ├── HomePage.jsx             # Landing and profile input
│   ├── ResultsPage.jsx          # Scheme recommendations
│   └── SchemeDetailsPage.jsx    # Detailed scheme view
├── services/
│   ├── apiClient.js             # API communication
│   ├── voiceService.js          # Voice input handling
│   └── translationService.js    # Client-side language utils
└── utils/
    ├── validation.js            # Input validation
    └── formatting.js            # Response formatting
```

#### 2.1.2 Key Frontend Features
- **Progressive Web App (PWA)** for offline capability
- **Responsive design** for mobile-first experience
- **Voice input visualization** with recording indicators
- **Language switching** without page reload
- **Accessibility compliance** (WCAG 2.1 AA)
- **Low-bandwidth optimization** with lazy loading

### 2.2 API Gateway Layer

#### 2.2.1 API Endpoints
```
POST /api/v1/schemes/search
- Body: { profile, query, language, voiceData? }
- Response: { schemes, eligibility, applicationGuide }

POST /api/v1/voice/transcribe
- Body: { audioData, language }
- Response: { transcription, confidence }

GET /api/v1/schemes/{schemeId}
- Response: { schemeDetails, documents, applicationSteps }

POST /api/v1/consent
- Body: { userId, consentType, granted }
- Response: { consentId, status }

GET /api/v1/health
- Response: { status, version, timestamp }
```

#### 2.2.2 API Gateway Configuration
- **CORS enabled** for frontend domain
- **Request validation** using JSON Schema
- **Rate limiting**: 100 requests/minute per IP
- **API key authentication** for admin endpoints
- **Request/response logging** for monitoring
- **Caching** for static scheme data (TTL: 1 hour)

### 2.3 Lambda Orchestration Layer

#### 2.3.1 Main Orchestration Function
```javascript
// Lambda function structure
exports.handler = async (event) => {
  const { profile, query, language, voiceData } = JSON.parse(event.body);
  
  // 1. Process voice input (if provided)
  const textQuery = voiceData ? 
    await transcribeVoice(voiceData, language) : query;
  
  // 2. Translate to English (if needed)
  const englishQuery = language !== 'en' ? 
    await translateText(textQuery, language, 'en') : textQuery;
  
  // 3. RAG pipeline execution
  const relevantSchemes = await retrieveSchemes(profile, englishQuery);
  
  // 4. AI reasoning and ranking
  const rankedSchemes = await reasonAndRank(profile, relevantSchemes);
  
  // 5. Generate structured response
  const structuredResponse = await generateResponse(rankedSchemes, profile);
  
  // 6. Translate response back
  const localizedResponse = language !== 'en' ? 
    await translateResponse(structuredResponse, 'en', language) : structuredResponse;
  
  return {
    statusCode: 200,
    body: JSON.stringify(localizedResponse)
  };
};
```

#### 2.3.2 Lambda Configuration
- **Runtime**: Node.js 18.x
- **Memory**: 1024 MB (adjustable based on load)
- **Timeout**: 30 seconds
- **Environment Variables**: Bedrock endpoints, S3 buckets, DynamoDB tables
- **IAM Roles**: Least privilege access to required services
- **Dead Letter Queue**: SQS for failed invocations

### 2.4 RAG Pipeline Design

#### 2.4.1 Knowledge Base Structure
```
Scheme Document Structure:
{
  "schemeId": "PM-KISAN-2024",
  "name": "PM-KISAN Samman Nidhi",
  "description": "Income support for small farmers",
  "eligibility": {
    "landHolding": "≤2 hectares",
    "category": ["General", "OBC", "SC", "ST"],
    "income": "No income limit",
    "age": "18-70 years"
  },
  "benefits": {
    "amount": "₹6,000 per year",
    "installments": "3 installments of ₹2,000",
    "duration": "Ongoing"
  },
  "documents": [
    "Aadhaar Card",
    "Land Records",
    "Bank Account Details"
  ],
  "applicationProcess": [
    "Visit PM-KISAN portal",
    "Register with Aadhaar",
    "Upload land documents",
    "Submit application"
  ],
  "officialLinks": {
    "portal": "https://pmkisan.gov.in",
    "helpline": "155261"
  },
  "metadata": {
    "state": "All India",
    "ministry": "Agriculture",
    "lastUpdated": "2024-01-15"
  }
}
```

#### 2.4.2 Vector Embedding Strategy
- **Embedding Model**: Amazon Titan Embeddings G1 - Text
- **Chunk Size**: 512 tokens with 50-token overlap
- **Embedding Dimensions**: 1536
- **Similarity Metric**: Cosine similarity
- **Index Strategy**: Hierarchical Navigable Small World (HNSW)

#### 2.4.3 Retrieval Process
```javascript
async function retrieveSchemes(profile, query) {
  // 1. Create profile embedding
  const profileVector = await embedProfile(profile);
  
  // 2. Create query embedding
  const queryVector = await embedQuery(query);
  
  // 3. Combine embeddings (weighted)
  const combinedVector = combineVectors(profileVector, queryVector, {
    profileWeight: 0.7,
    queryWeight: 0.3
  });
  
  // 4. Vector search in OpenSearch
  const searchResults = await vectorSearch(combinedVector, {
    size: 20,
    minScore: 0.7
  });
  
  // 5. Re-rank based on profile matching
  return reRankByProfile(searchResults, profile);
}
```

### 2.5 AI Reasoning and Ranking

#### 2.5.1 Bedrock LLM Integration
- **Model**: Claude 3 Sonnet (anthropic.claude-3-sonnet-20240229-v1:0)
- **Temperature**: 0.1 (for consistent, factual responses)
- **Max Tokens**: 4000
- **Top P**: 0.9

#### 2.5.2 Prompt Engineering Strategy
```javascript
const ELIGIBILITY_PROMPT = `
You are an expert government scheme advisor for Indian citizens. 
Analyze the user profile and scheme details to provide accurate eligibility assessment.

User Profile:
- Age: {age}
- Annual Income: ₹{income}
- Category: {category}
- Profession: {profession}
- State: {state}

Scheme Details:
{schemeDetails}

Tasks:
1. Assess eligibility (Eligible/Not Eligible/Partially Eligible)
2. Explain reasoning in simple language
3. Identify missing requirements if not eligible
4. Suggest alternatives if applicable
5. Rate relevance score (1-10)

Response Format:
{
  "eligibility": "Eligible|Not Eligible|Partially Eligible",
  "reasoning": "Clear explanation in user-friendly language",
  "missingRequirements": ["requirement1", "requirement2"],
  "alternatives": ["alternative scheme suggestions"],
  "relevanceScore": 8,
  "confidenceLevel": "High|Medium|Low"
}
`;
```

#### 2.5.3 Ranking Algorithm
```javascript
function calculateSchemeScore(scheme, profile, eligibilityResult) {
  const weights = {
    eligibility: 0.4,        // Primary factor
    benefitAmount: 0.25,     // Financial impact
    applicationEase: 0.15,   // User experience
    deadlineUrgency: 0.1,    // Time sensitivity
    profileMatch: 0.1        // Personal relevance
  };
  
  const scores = {
    eligibility: getEligibilityScore(eligibilityResult.eligibility),
    benefitAmount: normalizeBenefitAmount(scheme.benefits.amount),
    applicationEase: calculateApplicationComplexity(scheme.applicationProcess),
    deadlineUrgency: calculateDeadlineScore(scheme.deadline),
    profileMatch: calculateProfileMatch(scheme, profile)
  };
  
  return Object.keys(weights).reduce((total, factor) => 
    total + (weights[factor] * scores[factor]), 0
  );
}
```

### 2.6 Response Generation

#### 2.6.1 Structured Output Format
```javascript
const RESPONSE_SCHEMA = {
  "recommendedSchemes": [
    {
      "schemeId": "string",
      "name": "string",
      "description": "string",
      "eligibilityStatus": "Eligible|Not Eligible|Partially Eligible",
      "eligibilityReasoning": "string",
      "benefits": {
        "summary": "string",
        "amount": "string",
        "duration": "string"
      },
      "requiredDocuments": ["string"],
      "applicationSteps": [
        {
          "step": 1,
          "description": "string",
          "officialLink": "string",
          "estimatedTime": "string"
        }
      ],
      "relevanceScore": "number",
      "confidenceLevel": "string"
    }
  ],
  "summary": {
    "totalEligibleSchemes": "number",
    "estimatedTotalBenefit": "string",
    "nextSteps": "string"
  },
  "metadata": {
    "queryProcessedAt": "timestamp",
    "language": "string",
    "responseId": "string"
  }
}
```

---

## 3. Data Flow Design

### 3.1 End-to-End Data Flow
```
1. User Input → Frontend Validation → API Gateway
2. API Gateway → Lambda Orchestrator → Input Processing
3. Voice Data → Transcribe → Text Conversion
4. Text → Translate (if needed) → English Query
5. Profile + Query → RAG Pipeline → Scheme Retrieval
6. Retrieved Schemes → Bedrock LLM → Eligibility Assessment
7. Assessed Schemes → Ranking Algorithm → Sorted Results
8. Sorted Results → Response Generator → Structured Output
9. Structured Output → Translate (if needed) → Localized Response
10. Localized Response → API Gateway → Frontend Display
```

### 3.2 Data Storage Strategy

#### 3.2.1 S3 Bucket Organization
```
yojanasathi-knowledge-base/
├── schemes/
│   ├── central/
│   │   ├── agriculture/
│   │   ├── education/
│   │   └── healthcare/
│   └── state/
│       ├── maharashtra/
│       ├── karnataka/
│       └── tamil-nadu/
├── embeddings/
│   ├── scheme-vectors/
│   └── profile-vectors/
└── documents/
    ├── application-forms/
    └── guidelines/
```

#### 3.2.2 DynamoDB Table Design
```javascript
// User Sessions Table
{
  "PK": "SESSION#{sessionId}",
  "SK": "PROFILE",
  "userId": "optional-user-id",
  "profile": {
    "age": 35,
    "income": 500000,
    "category": "OBC",
    "profession": "Farmer",
    "state": "Maharashtra"
  },
  "consentGiven": true,
  "language": "hi",
  "createdAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2024-01-15T22:30:00Z"
}

// Query History Table (if consent given)
{
  "PK": "USER#{userId}",
  "SK": "QUERY#{timestamp}",
  "query": "farming schemes",
  "results": ["PM-KISAN", "PMFBY"],
  "language": "hi",
  "responseTime": 2.5
}
```

---

## 4. Security Design

### 4.1 Security Architecture
- **API Gateway**: WAF rules, rate limiting, CORS
- **Lambda**: VPC isolation, IAM roles, environment encryption
- **Data**: Encryption at rest (S3, DynamoDB), in transit (TLS 1.3)
- **Access Control**: Least privilege IAM policies
- **Monitoring**: CloudTrail, GuardDuty, Security Hub

### 4.2 Privacy Controls
```javascript
// Consent Management
const ConsentTypes = {
  PROFILE_STORAGE: 'profile_storage',
  QUERY_HISTORY: 'query_history',
  ANALYTICS: 'analytics',
  PERSONALIZATION: 'personalization'
};

// Data Retention Policy
const RetentionPolicies = {
  SESSION_DATA: '12 hours',
  CONSENTED_PROFILE: '1 year',
  QUERY_LOGS: '30 days',
  ANALYTICS_DATA: '2 years (anonymized)'
};
```

### 4.3 Input Validation
```javascript
const ProfileSchema = {
  type: 'object',
  properties: {
    age: { type: 'integer', minimum: 0, maximum: 120 },
    income: { type: 'integer', minimum: 0, maximum: 10000000 },
    category: { enum: ['General', 'OBC', 'SC', 'ST', 'EWS'] },
    profession: { type: 'string', maxLength: 100 },
    state: { enum: INDIAN_STATES }
  },
  required: ['age', 'income', 'category', 'state']
};
```

---

## 5. Cost Optimization Strategy

### 5.1 Serverless Cost Model
```javascript
// Estimated Monthly Costs (1000 users, 10 queries/user)
const CostEstimate = {
  'Lambda Invocations': '$2.00',      // 10,000 invocations
  'Bedrock API Calls': '$15.00',     // Claude 3 Sonnet usage
  'OpenSearch Serverless': '$25.00', // Vector search
  'API Gateway': '$3.50',            // 10,000 requests
  'S3 Storage': '$5.00',             // Knowledge base
  'DynamoDB': '$2.50',               // Session storage
  'CloudFront': '$1.00',             // CDN
  'Total Estimated': '$54.00/month'
};
```

### 5.2 Cost Optimization Techniques
- **Lambda**: Right-sizing memory, provisioned concurrency for predictable load
- **Bedrock**: Batch processing, response caching, prompt optimization
- **OpenSearch**: Auto-scaling, index optimization, query caching
- **S3**: Intelligent tiering, lifecycle policies
- **DynamoDB**: On-demand billing, TTL for session data

---

## 6. Scalability Design

### 6.1 Auto-Scaling Configuration
```javascript
const ScalingConfig = {
  lambda: {
    concurrency: 1000,           // Reserved concurrency
    provisioned: 10,             // Warm instances
    autoScaling: true
  },
  openSearch: {
    minCapacity: 2,              // OCU units
    maxCapacity: 10,
    targetUtilization: 70
  },
  dynamoDB: {
    mode: 'ON_DEMAND',           // Auto-scaling
    backupEnabled: true
  }
};
```

### 6.2 Performance Optimization
- **Caching Strategy**: CloudFront (static), Lambda (in-memory), DynamoDB (query results)
- **Connection Pooling**: Reuse database connections across Lambda invocations
- **Parallel Processing**: Concurrent API calls for translation and transcription
- **Response Compression**: Gzip compression for API responses

---

## 7. Failure Handling and Resilience

### 7.1 Error Handling Strategy
```javascript
const ErrorHandling = {
  'Bedrock API Failure': {
    fallback: 'Rule-based eligibility matching',
    retry: 'Exponential backoff (3 attempts)',
    timeout: '30 seconds'
  },
  'Translation Service Failure': {
    fallback: 'English-only response with apology',
    retry: 'Immediate retry once',
    timeout: '10 seconds'
  },
  'Voice Transcription Failure': {
    fallback: 'Prompt user to type query',
    retry: 'User-initiated retry',
    timeout: '15 seconds'
  },
  'Knowledge Base Unavailable': {
    fallback: 'Cached popular schemes',
    retry: 'Circuit breaker pattern',
    timeout: '5 seconds'
  }
};
```

### 7.2 Circuit Breaker Implementation
```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureThreshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }
  
  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}
```

---

## 8. Responsible AI Measures

### 8.1 AI Safety Controls
```javascript
const ResponsibleAI = {
  'Content Filtering': {
    'Input Validation': 'Reject harmful or inappropriate queries',
    'Output Sanitization': 'Remove potentially harmful content',
    'Bias Detection': 'Monitor for discriminatory responses'
  },
  'Explainability': {
    'Reasoning Display': 'Show why schemes were recommended',
    'Confidence Scores': 'Indicate AI confidence levels',
    'Source Attribution': 'Link to official scheme documents'
  },
  'Human Oversight': {
    'Admin Dashboard': 'Monitor AI responses and user feedback',
    'Escalation Path': 'Route complex queries to human experts',
    'Feedback Loop': 'Collect user feedback for model improvement'
  }
};
```

### 8.2 Bias Mitigation
- **Training Data**: Ensure diverse representation across states, categories, professions
- **Response Monitoring**: Track recommendation patterns across demographic groups
- **Fairness Metrics**: Measure equal access to scheme recommendations
- **Regular Audits**: Quarterly reviews of AI decision patterns

---

## 9. Monitoring and Observability

### 9.1 Metrics and KPIs
```javascript
const MonitoringMetrics = {
  'Performance': [
    'Response time (p50, p95, p99)',
    'Error rate by component',
    'Throughput (requests/second)',
    'Lambda cold start frequency'
  ],
  'Business': [
    'User satisfaction score',
    'Scheme recommendation accuracy',
    'Application completion rate',
    'Language usage distribution'
  ],
  'AI Quality': [
    'Eligibility assessment accuracy',
    'Translation quality scores',
    'Voice transcription accuracy',
    'User feedback sentiment'
  ]
};
```

### 9.2 Alerting Strategy
- **Critical**: API Gateway 5xx errors > 1%
- **Warning**: Response time > 5 seconds for 5 minutes
- **Info**: New user registration, high query volume
- **Custom**: AI confidence scores below threshold

---

## 10. Testing Strategy

### 10.1 Testing Framework
- **Unit Tests**: Jest for Lambda functions, React Testing Library for frontend
- **Integration Tests**: AWS SDK mocks, API Gateway testing
- **End-to-End Tests**: Playwright for user journey testing
- **Load Tests**: Artillery.js for performance testing
- **AI Tests**: Custom framework for LLM response validation

### 10.2 Property-Based Testing
We will implement property-based tests to validate system correctness:

#### 10.2.1 Core Properties
**Property 1.1: Eligibility Consistency**
- For any valid user profile, the eligibility assessment should be deterministic
- The same profile should always receive the same eligibility result for a given scheme

**Property 1.2: Ranking Monotonicity**
- Higher-scoring schemes should always appear before lower-scoring schemes
- Schemes with identical scores should maintain stable ordering

**Property 1.3: Translation Preservation**
- Translating a response to another language and back should preserve semantic meaning
- Key information (amounts, dates, requirements) should remain accurate

**Property 1.4: Input Validation Completeness**
- All invalid inputs should be rejected with appropriate error messages
- All valid inputs should be processed successfully

#### 10.2.2 Testing Framework
- **Library**: fast-check (JavaScript property-based testing)
- **Test Execution**: Integrated with Jest test suite
- **Generators**: Custom generators for user profiles, scheme data, and queries
- **Shrinking**: Automatic minimization of failing test cases

---

## 11. Deployment Strategy

### 11.1 Infrastructure as Code
```yaml
# CloudFormation/CDK Stack Structure
YojanaSathiStack:
  - VPC and Security Groups
  - Lambda Functions and Layers
  - API Gateway and Custom Domain
  - S3 Buckets and Policies
  - DynamoDB Tables
  - OpenSearch Serverless Collection
  - CloudFront Distribution
  - IAM Roles and Policies
  - CloudWatch Dashboards and Alarms
```

### 11.2 CI/CD Pipeline
```yaml
# GitHub Actions Workflow
stages:
  - Code Quality: ESLint, Prettier, Security scan
  - Unit Tests: Jest with coverage reporting
  - Integration Tests: AWS service mocks
  - Build: React app, Lambda packages
  - Deploy Staging: Automated deployment
  - E2E Tests: Playwright test suite
  - Deploy Production: Manual approval required
  - Post-Deploy: Health checks and monitoring
```

---

## 12. Future Enhancements

### 12.1 Planned Features
- **Mobile App**: React Native application for better mobile experience
- **Offline Mode**: Cached scheme data for basic functionality without internet
- **Document Upload**: OCR for automatic document verification
- **Application Tracking**: Integration with government portals for status updates
- **Community Features**: User reviews and success stories

### 12.2 Technical Improvements
- **Edge Computing**: CloudFront Functions for faster response times
- **Advanced AI**: Fine-tuned models for better scheme understanding
- **Real-time Updates**: Event-driven architecture for scheme data updates
- **Multi-modal Input**: Image and document analysis capabilities

---

*This design document provides the technical foundation for implementing YojanaSathi and will be updated as the system evolves through development and deployment phases.*