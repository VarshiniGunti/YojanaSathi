# YojanaSathi – AI-Powered Government Scheme Finder

> **Empowering Indian citizens to discover government welfare schemes they're eligible for using Generative AI on AWS**

[![AWS](https://img.shields.io/badge/AWS-Bedrock%20%7C%20S3%20%7C%20DynamoDB-orange)](https://aws.amazon.com/)
[![AI](https://img.shields.io/badge/AI-Claude%203%20Sonnet-blue)](https://www.anthropic.com/claude)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)

**Hackathon:** AI for Bharat by AWS  
**Team:** SoloForge AI
**Challanges** [Student Track] AI for Communities , Access & Public Impact

---

## Project Overview

**The Problem:**
- India has **1000+ government welfare schemes** across central and state levels
- Citizens often **don't know which schemes they qualify for**
- Government portals provide **static information** without personalized guidance
- Complex eligibility criteria make it **difficult to self-assess**
- Language barriers prevent access for **non-English speakers**

**The Solution:**
YojanaSathi uses **Generative AI on AWS** to:
- Analyze a user's profile (age, income, profession, category, state, gender)
- Intelligently match them with relevant government schemes using RAG (Retrieval Augmented Generation)
- Provide **natural-language explanations** of eligibility reasoning via Claude 3 Sonnet
- Deliver **personalized recommendations** categorized by eligibility status
- Support **multilingual translation** via AWS Translate for 6+ Indian languages
- Log analytics data (privacy-first - no PII stored) to DynamoDB

**Current Coverage:** 51+ real Indian government schemes across agriculture, healthcare, education, housing, social security, and entrepreneurship.

---

## Why AI Is Required

Traditional rule-based systems are **insufficient** for government scheme matching because:

### 1. **Complex Eligibility Criteria**
Government schemes have multi-dimensional requirements that interact in complex ways:
- **Profession-specific**: PM-KISAN for farmers, PMAY for specific income groups
- **Category-based**: Different schemes for SC/ST, OBC, General categories
- **Age and income thresholds**: Overlapping ranges across multiple schemes
- **State-specific variations**: Central vs state scheme eligibility

### 2. **Conditional Logic Complexity**
Real eligibility rules from the codebase:
```javascript
// Example from PM-KISAN scheme
"conditions": [
  "Must own cultivable land", 
  "Must not be an income tax payer", 
  "Must not be institutional landholder"
]
```
Hard-coding rules for 51+ schemes with nested conditions becomes unmaintainable.

### 3. **Natural Language Understanding**
Citizens need **human-readable explanations**, not just yes/no answers. Our Claude 3 Sonnet implementation generates contextual reasoning:
- *"You are eligible for PM-KISAN because you are a farmer with cultivable land and your income is below the threshold"*
- *"This scheme requires SC/ST category. Your profile shows OBC category."*

### 4. **Information Overload Reduction**
AI filters 51+ schemes down to 5-10 most relevant recommendations, ranked by eligibility confidence and relevance scores.

---

## What Value the AI Layer Adds

### 1. **Personalized Recommendations**
- RAG system retrieves top 10 most relevant schemes using ChromaDB vector search
- Claude 3 Sonnet analyzes complex eligibility criteria for each scheme
- Results ranked by relevance score and eligibility confidence

### 2. **Natural-Language Explanations**
Instead of cryptic eligibility rules, users get clear explanations:
- **Eligible**: *"You meet the basic eligibility criteria for this scheme based on your Farmer profession and OBC category"*
- **Not Eligible**: *"This scheme is for SC, ST only. Your profile shows OBC category"*
- **Potentially Eligible**: *"You meet most criteria but may need document verification"*

### 3. **Eligibility Status Categories**
AI categorizes each scheme into three clear buckets:
- **Eligible** - User meets all criteria
- **Potentially Eligible** - Meets most criteria, needs verification  
- **Not Eligible** - Doesn't meet key requirements

### 4. **RAG-Grounded Responses**
- ChromaDB stores vectorized scheme documents for semantic search
- AI reasoning is grounded in actual government scheme data
- Fallback to local JSON dataset if vector database unavailable

### 5. **Multilingual Support**
- AWS Translate integration for 6+ Indian languages (Hindi, Telugu, Tamil, Bengali, Marathi, Gujarati)
- Real-time translation of scheme descriptions and AI reasoning
- Language preference stored for personalization

### 6. **Robust Fallback Mechanisms**
- **Bedrock unavailable** → Falls back to OpenAI → Falls back to local rule-based logic
- **ChromaDB unavailable** → Falls back to local JSON scheme dataset
- **AWS Translate fails** → Returns original English text
- System remains functional even with AWS service outages

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                               │
│              React Frontend (Port 5173)                        │
│         Profile Form → Results View → Details                  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP API Calls
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API LAYER                                    │
│            Express.js REST API (Port 3000)                     │
│        Validation → Routing → Error Handling                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                 AI & DATA LAYER                                 │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ RAG Service  │→ │   Amazon     │→ │   AWS        │         │
│  │  ChromaDB    │  │   Bedrock    │  │  Translate   │         │
│  │ Vector Store │  │ Claude 3     │  │ Multi-lang   │         │
│  └──────────────┘  │   Sonnet     │  └──────────────┘         │
│         ↓           └──────────────┘         ↓                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Amazon S3   │  │   DynamoDB   │  │ Local JSON   │         │
│  │  Documents   │  │  Analytics   │  │ Fallback     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow
1. **User Input** → Profile form (age, income, profession, category, state, gender)
2. **API Validation** → Express + Joi schema validation
3. **RAG Retrieval** → ChromaDB semantic search OR local JSON fallback
4. **AI Reasoning** → Claude 3 Sonnet eligibility analysis OR rule-based fallback
5. **Translation** → AWS Translate for non-English languages
6. **Analytics** → DynamoDB logging (no PII stored)
7. **Response** → Personalized recommendations with explanations

---

## Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI framework | 19.2.0 |
| **Vite** | Build tool and dev server | 7.2.5 |
| **Tailwind CSS** | Utility-first styling | 3.4.17 |
| **React Router** | Client-side routing | 7.12.0 |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime environment | 18+ |
| **Express.js** | Web framework | 4.18.2 |
| **Joi** | Request validation | 17.12.0 |
| **Winston** | Logging | 3.11.0 |
| **Morgan** | HTTP request logging | 1.10.0 |

### AI & Machine Learning
| Technology | Purpose | Details |
|------------|---------|---------|
| **Amazon Bedrock** | AI reasoning engine | Claude 3 Sonnet (`anthropic.claude-3-sonnet-20240229-v1:0`) |
| **ChromaDB** | Vector database for RAG | Semantic search over scheme documents |
| **OpenAI** | Fallback AI service | GPT-4 Turbo (when Bedrock unavailable) |

### AWS Infrastructure
| Service | Purpose | Resource |
|---------|---------|----------|
| **Amazon Bedrock** | Foundation model access | Claude 3 Sonnet |
| **Amazon S3** | Scheme document storage | Bucket: `yojanasathi-kb-dev` |
| **Amazon DynamoDB** | Analytics logging (no PII) | Table: `yojanasathi-analytics` |
| **AWS Translate** | Real-time language translation | 6+ Indian languages |
| **AWS Transcribe** | Voice input (configured, not implemented) | For future accessibility |

---

## Key Features

### 1. **AI-Powered Scheme Recommendations**
- Analyzes user profile against 51+ government schemes
- Uses Claude 3 Sonnet via Amazon Bedrock for intelligent eligibility assessment
- RAG-based retrieval using ChromaDB for semantic scheme matching
- Confidence scoring and relevance ranking

### 2. **Eligibility Reasoning Explanations**
- Natural-language explanations for each recommendation
- Context-aware reasoning based on user profile attributes
- Clear explanations for why schemes are eligible/not eligible
- Builds trust and transparency in AI decisions

### 3. **Eligibility Status Badges**
- Visual indicators for quick scanning:
  - ✅ **Eligible** - Meets all criteria (green)
  - ❓ **Potentially Eligible** - Needs verification (amber)
  - ❌ **Not Eligible** - Doesn't qualify (red, grayed out)

### 4. **Multilingual Support**
- Backend integrated with AWS Translate
- Supports 6+ Indian languages: Hindi, Telugu, Tamil, Bengali, Marathi, Gujarati
- Real-time translation of scheme descriptions and AI reasoning
- Language preference handling in API

### 5. **Government-Style UI**
- Clean, accessible design inspired by government portals
- Mobile-responsive for rural access
- High contrast and large fonts for readability
- Single-page application with smooth navigation

### 6. **RAG-Based Document Retrieval**
- ChromaDB vector database for semantic search
- Fallback to local JSON dataset when vector DB unavailable
- Relevance scoring and ranking algorithms
- Grounded AI responses using actual scheme documents

### 7. **Privacy-First Analytics**
- DynamoDB logging for usage insights
- **Does NOT store**: age, income, gender (PII)
- **Only stores**: profession, state, category, language, timestamp
- Non-blocking analytics (doesn't fail requests)

### 8. **Robust Fallback Mechanisms**
- **Triple-layer AI fallback**: Bedrock → OpenAI → Local rules
- **Data fallback**: ChromaDB → Local JSON schemes
- **Translation fallback**: AWS Translate → Original English
- System remains functional during AWS service outages

### 9. **Production-Ready Infrastructure**
- Rate limiting (100 requests per 15 minutes)
- Security headers via Helmet.js
- CORS configuration
- Comprehensive error handling and logging
- Health check endpoints

---

## File Structure

```
yojanasathi/
│
├── backend/                          # Node.js Express API
│   ├── config/
│   │   ├── aws.js                    # AWS SDK configuration
│   │   └── logger.js                 # Winston logger setup
│   │
│   ├── middleware/
│   │   ├── errorHandler.js           # Global error handling
│   │   └── validation.js             # Joi request validation
│   │
│   ├── routes/
│   │   ├── health.routes.js          # Health check endpoints
│   │   └── schemes.routes.js         # Main API endpoints
│   │
│   ├── services/
│   │   ├── analytics.service.js      # DynamoDB analytics logging
│   │   ├── bedrock.service.js        # Amazon Bedrock AI reasoning
│   │   ├── rag.service.js            # RAG retrieval (ChromaDB)
│   │   └── translate.service.js      # AWS Translate multilingual
│   │
│   ├── scripts/
│   │   ├── convert-to-markdown.js    # Convert schemes to markdown
│   │   └── ingest-schemes.js         # Ingest schemes to ChromaDB
│   │
│   ├── .env.example                  # Environment variables template
│   ├── ecosystem.config.js           # PM2 production configuration
│   ├── package.json                  # Backend dependencies
│   └── server.js                     # Express server entry point
│
├── frontend/                         # React application
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   ├── pages/                    # Page components
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   │
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS config
│   └── .env.example                  # Frontend environment variables
│
├── schemes/                          # Scheme data
│   ├── schemes.json                  # 51+ government schemes (structured data)
│   └── markdown/                     # Markdown files for each scheme
│
├── scripts/                          # Infrastructure setup
│   ├── setup-aws.sh                  # AWS setup script (Linux/Mac)
│   └── setup-aws.ps1                 # AWS setup script (Windows)
│
├── .gitignore                        # Git ignore rules
├── README.md                         # This file
├── amplify.yml                       # AWS Amplify build config
└── deploy-backend.sh                 # EC2 deployment script
```

---

## Setup Instructions

### Prerequisites
- **Node.js** 18+ and npm
- **AWS Account** with configured credentials
- **Python** 3.9+ (for ChromaDB - optional)
- **Git** for version control

### 1. Clone Repository
```bash
git clone <repository-url>
cd yojanasathi
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your AWS credentials:
```env
# AWS Configuration
AWS_REGION=us-east-1
S3_BUCKET_NAME=yojanasathi-kb-dev
DYNAMODB_TABLE_NAME=yojanasathi-analytics
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0

# Server
PORT=3000
NODE_ENV=development

# ChromaDB (Optional)
CHROMA_PATH=./data/chroma
CHROMA_COLLECTION_NAME=yojanasathi-schemes

# OpenAI Fallback (Optional)
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-4-turbo-preview
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file (optional):
```bash
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env
```

### 4. AWS Infrastructure Setup
**Windows:**
```powershell
.\scripts\setup-aws.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/setup-aws.sh
./scripts/setup-aws.sh
```

This script creates:
- S3 bucket: `yojanasathi-kb-dev`
- DynamoDB table: `yojanasathi-analytics`
- IAM role with necessary permissions

### 5. (Optional) ChromaDB Setup
```bash
# Install ChromaDB
pip install chromadb

# Start ChromaDB server
python -m chromadb.cli.cli run --host localhost --port 8000

# In another terminal, ingest schemes
cd backend
npm run ingest
```

**Note:** System will fallback to local JSON if ChromaDB is unavailable.

### 6. Run the Application
**Start Backend:**
```bash
cd backend
npm start
```
Backend runs on: **http://localhost:3000**

**Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: **http://localhost:5173**

### 7. Verify Setup
**Health Check:**
```bash
curl http://localhost:3000/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-03-07T12:00:00.000Z",
  "uptime": 10.5,
  "environment": "development"
}
```

---

## Demo Flow

### Step 1: Open Application
Navigate to **http://localhost:5173**

### Step 2: Enter User Profile
Fill in the profile form:
- **Age:** 30
- **Monthly Income:** ₹10,000 – ₹25,000 / month
- **Category:** OBC
- **Profession:** Farmer
- **State:** Telangana
- **Gender:** Male

### Step 3: AI Analyzes Eligibility
- RAG system retrieves relevant schemes from ChromaDB (or local fallback)
- Claude 3 Sonnet analyzes eligibility for each scheme
- AI generates natural-language explanations
- Results translated if non-English language selected

### Step 4: View Personalized Recommendations
Results page shows:
- **Eligible Schemes** (e.g., PM-KISAN, PMAY-Gramin) with green badge
- **Potentially Eligible Schemes** (e.g., PM Mudra Yojana) with amber badge
- **Not Eligible Schemes** (grayed out) with red badge

Each scheme includes:
- Eligibility status badge and confidence score
- AI-generated reasoning explanation
- Scheme name, ministry, and description

### Step 5: View Scheme Details
Click on any scheme to see:
- Full description and benefits
- Required documents
- Step-by-step application process
- Official website link

### Step 6: Backend Analytics
- Query logged to DynamoDB (profession, state, category only)
- No PII stored (age, income, gender excluded)
- Analytics available for future admin dashboard

---

## Impact

### 1. **Improved Scheme Discovery**
- Citizens discover relevant schemes from 51+ options in seconds
- AI reduces information overload by showing only applicable schemes
- Personalized recommendations based on individual profile

### 2. **Simplified Eligibility Assessment**
- No need to manually read complex eligibility criteria
- AI provides clear explanations for each recommendation
- Confidence scoring helps users prioritize applications

### 3. **Language Accessibility**
- Multilingual support breaks language barriers
- Real-time translation of scheme descriptions and AI reasoning
- Accessible to non-English speaking rural citizens

### 4. **Transparency and Trust**
- AI provides clear reasoning for each recommendation
- Users understand why they qualify or don't qualify
- Grounded responses using actual government scheme data

### 5. **Scalable Architecture**
- System can easily scale to 1000+ schemes
- Adding new schemes doesn't require code changes
- AI learns patterns from scheme descriptions automatically

---

## Deployment Overview

**Intended Architecture:**
- **Frontend** → AWS Amplify (Static hosting)
- **Backend** → AWS EC2 (Node.js with PM2)
- **AI** → Amazon Bedrock (Claude 3 Sonnet)
- **Data** → Amazon S3 (documents) + DynamoDB (analytics)

**Deployment Files:**
- `amplify.yml` - AWS Amplify build configuration
- `deploy-backend.sh` - EC2 deployment script
- `ecosystem.config.js` - PM2 production configuration

---

## Current Status

- **Total Schemes:** 51+ Indian government schemes
- **Categories Covered:** Agriculture, Healthcare, Education, Housing, Social Security, Entrepreneurship
- **Languages Supported:** 6+ Indian languages (backend ready)
- **AI Model:** Claude 3 Sonnet via Amazon Bedrock
- **Fallback Systems:** 3-layer AI fallback, local data fallback
- **Privacy:** No PII stored in analytics

---

## Contributing

This is a hackathon project built for AI for Bharat by AWS. For improvements:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - Free to use for educational and non-commercial purposes.

---

## Acknowledgments

- **AWS** for providing Bedrock, S3, DynamoDB, and Translate services
- **Anthropic** for Claude 3 Sonnet foundation model
- **Government of India** for scheme data and documentation
- **Open Source Community** for tools and libraries

---

**Note:** This is a hackathon prototype demonstrating AI-powered government scheme discovery. For production deployment, additional security, scalability, testing, and compliance measures should be implemented.
