# YojanaSathi – AI-Powered Government Scheme Finder

> **Empowering Indian citizens to discover government welfare schemes they're eligible for using Generative AI on AWS**

[![AWS](https://img.shields.io/badge/AWS-Bedrock%20%7C%20S3%20%7C%20DynamoDB-orange)](https://aws.amazon.com/)
[![AI](https://img.shields.io/badge/AI-Claude%20Sonnet%204-blue)](https://www.anthropic.com/claude)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Why AI Is Required](#-why-ai-is-required)
- [What Value the AI Layer Adds](#-what-value-the-ai-layer-adds)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [AWS Services Used](#-aws-services-used)
- [File Structure](#-file-structure)
- [Setup Instructions](#-setup-instructions)
- [Demo Flow](#-demo-flow)
- [Impact](#-impact)
- [Future Improvements](#-future-improvements)

---

## 🎯 Project Overview

**The Problem:**
- India has **1000+ government welfare schemes** across central and state levels
- Citizens often **don't know which schemes they qualify for**
- Government portals provide **static information** without personalized guidance
- Complex eligibility criteria make it **difficult to self-assess**
- Language barriers prevent access for **non-English speakers**

**The Solution:**
YojanaSathi uses **Generative AI on AWS** to:
- Analyze a user's profile (age, income, profession, category, state)
- Intelligently match them with relevant government schemes
- Provide **natural-language explanations** of eligibility reasoning
- Deliver **personalized recommendations** categorized by eligibility status
- Use **AWS Bedrock (Claude Sonnet 4)** for intelligent eligibility assessment
- Support **multilingual translation** via AWS Translate (backend ready)

**Current Coverage:** 51 real Indian government schemes across agriculture, healthcare, education, housing, social security, entrepreneurship, and more.

---

## 🤖 Why AI Is Required

Traditional rule-based systems are **insufficient** for government scheme matching because:

### 1. **Complex Eligibility Criteria**
- Schemes have **multi-dimensional requirements**: age, income, profession, category, state, gender
- Criteria often **overlap and interact** in non-obvious ways
- Example: A farmer aged 30 in the OBC category from Telangana with income below ₹25,000/month qualifies for different schemes than a student with the same demographics

### 2. **Conditional Logic Complexity**
- Many schemes have **nested conditions**: "If farmer AND (SC OR ST) AND income < X"
- Some schemes have **exclusion criteria**: "Must NOT be income tax payer"
- Hard-coding rules for 51+ schemes becomes **unmaintainable**

### 3. **Natural Language Understanding**
- Citizens need **human-readable explanations**, not just yes/no answers
- AI can generate context-aware reasoning: *"You qualify because you are a farmer with cultivable land and your income is below the threshold"*

### 4. **Scalability**
- Adding new schemes should **not require code changes**
- AI learns patterns from scheme descriptions automatically
- Reduces development and maintenance burden

### 5. **Personalization**
- Static portals show **all schemes** – overwhelming for users
- AI provides **ranked, personalized recommendations**
- Focuses user attention on most relevant schemes

**Solution:** We use **Amazon Bedrock (Claude Sonnet 4)** as the reasoning engine to handle complex eligibility logic and generate natural-language explanations.

---

## 💡 What Value the AI Layer Adds

### 1. **Personalized Recommendations**
- AI analyzes user profile against 51 schemes in real-time
- Returns only **relevant schemes** ranked by eligibility confidence
- Reduces information overload from 51 schemes to ~5-10 relevant ones

### 2. **Natural-Language Explanations**
- Instead of: `eligibility.profession.includes(user.occupation)`
- AI generates: *"You are eligible for PM-KISAN because you are a farmer with cultivable land, and your income is below ₹50,000/month"*
- Displayed as the "reason" text under each scheme card
- Builds **trust and transparency**

### 3. **Eligibility Status Categories**
- AI categorizes schemes into three groups:
  - **Eligible** - User meets all criteria
  - **Potentially Eligible** - User meets most criteria, may need verification
  - **Not Eligible** - User does not meet key criteria
- Visual badges (✓, ✗, ?) for quick scanning

### 4. **Context-Aware Responses Using RAG**
- **Retrieval Augmented Generation (RAG)** retrieves relevant scheme documents
- AI reasoning is **grounded in actual scheme data**
- Reduces hallucinations and ensures accuracy

### 5. **Multilingual Support (Backend Ready)**
- **AWS Translate** integrated in backend for 6+ Indian languages
- Backend API accepts `language` parameter
- Currently frontend sends 'en' (English) by default
- Ready to enable: Hindi, Telugu, Tamil, Bengali, Marathi, Gujarati
- Real-time translation of scheme descriptions and AI reasoning

### 6. **Adaptive Learning**
- AI can handle **edge cases** without explicit programming
- Improves over time as more schemes are added
- Reduces manual rule maintenance

**Comparison:**

| Feature | Traditional Portal | YojanaSathi (AI-Powered) |
|---------|-------------------|--------------------------|
| Scheme Discovery | Manual search through 1000+ schemes | AI recommends 5-10 relevant schemes |
| Eligibility Check | User reads criteria and self-assesses | AI analyzes and explains eligibility |
| Language Support | English only | Backend supports 6+ languages (frontend: English) |
| Personalization | None – shows all schemes | Personalized based on user profile |
| Explanations | Static text | Natural-language AI reasoning |
| Status Categories | None | Eligible / Potentially Eligible / Not Eligible |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    React Frontend (Port 5173)                   │
│              Profile Form → Results View → Details              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│                  Express.js REST API (Port 3000)                │
│              Validation → Routing → Error Handling              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI & DATA LAYER                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ RAG Service  │  │   Amazon     │  │    Amazon    │         │
│  │  ChromaDB    │→ │   Bedrock    │→ │  Translate   │         │
│  │ Vector Store │  │ Claude Sonnet│  │ Multilingual │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         ↓                  ↓                  ↓                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Amazon S3   │  │   DynamoDB   │  │ Local Scheme │         │
│  │  Documents   │  │  Analytics   │  │  JSON (51)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Component Roles

| Component | Purpose | Technology |
|-----------|---------|------------|
| **React Frontend** | User interface for profile input and results display | React 18, Vite, Tailwind CSS |
| **Express API** | REST endpoints, validation, error handling | Node.js, Express.js, Joi |
| **RAG Service** | Semantic search to retrieve relevant schemes | ChromaDB (vector database) |
| **Amazon Bedrock** | AI reasoning engine for eligibility assessment | Claude Sonnet 4 via AWS SDK |
| **Amazon Translate** | Multilingual support for 6+ Indian languages | AWS Translate API |
| **Amazon S3** | Stores scheme documents for knowledge base | S3 bucket: `yojanasathi-kb-dev` |
| **Amazon DynamoDB** | Logs user queries for analytics (no PII) | DynamoDB table: `yojanasathi-analytics` |
| **Local Scheme JSON** | Fallback data source with 51 schemes | JSON file with structured data |

### Data Flow

1. **User Input** → User fills profile form (age, income, profession, category, state)
2. **API Validation** → Express validates input using Joi schemas
3. **RAG Retrieval** → ChromaDB retrieves top 10 relevant schemes based on semantic similarity
4. **AI Reasoning** → Amazon Bedrock (Claude Sonnet 4) analyzes eligibility for each scheme
5. **Translation** → AWS Translate converts results to user's preferred language
6. **Analytics** → DynamoDB logs query metadata (profession, state, category – no PII)
7. **Response** → Frontend displays personalized recommendations with explanations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI framework | 18.3.1 |
| **Vite** | Build tool and dev server | 7.2.5 |
| **Tailwind CSS** | Utility-first styling | 3.4.17 |
| **React Router** | Client-side routing | 7.1.3 |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime environment | 18+ |
| **Express.js** | Web framework | 4.21.2 |
| **Joi** | Request validation | 17.13.3 |
| **Winston** | Logging | 3.17.0 |

### AI & Machine Learning
| Technology | Purpose | Details |
|------------|---------|---------|
| **Amazon Bedrock** | AI reasoning engine | Claude Sonnet 4 (`anthropic.claude-sonnet-4-v1`) |
| **ChromaDB** | Vector database for RAG | Semantic search over scheme documents |
| **AWS Translate** | Multilingual support | Hindi, Telugu, Tamil, Bengali, Marathi, Gujarati |

### AWS Services
| Service | Purpose | Resource |
|---------|---------|----------|
| **Amazon Bedrock** | Foundation model access (Claude Sonnet 4) | Model ID: `anthropic.claude-sonnet-4-v1` |
| **Amazon S3** | Scheme document storage | Bucket: `yojanasathi-kb-dev` |
| **Amazon DynamoDB** | Analytics logging (no PII) | Table: `yojanasathi-analytics` |
| **AWS Translate** | Real-time language translation | Supports 6+ Indian languages |
| **AWS Transcribe** | Voice input (optional) | For accessibility |
| **IAM** | Access control and security | Role: `yojanasathi-lambda-role` |

### Development Tools
| Tool | Purpose |
|------|---------|
| **Kiro** | Spec-driven development and AI-assisted coding |
| **Git/GitHub** | Version control |
| **AWS CLI** | Infrastructure setup and deployment |
| **npm** | Package management |

---

## ✨ Key Features

### 1. **AI-Powered Scheme Recommendations**
- Analyzes user profile against 51 government schemes
- Uses Amazon Bedrock (Claude Sonnet 4) for intelligent matching
- Returns personalized recommendations ranked by relevance

### 2. **Eligibility Reasoning Explanations**
- Natural-language explanations for each recommendation
- Example: *"You qualify for PM-KISAN because you are a farmer with cultivable land and your income is below the threshold"*
- Displayed as "reason" text under each scheme card
- Builds trust and transparency

### 3. **Eligibility Status Badges**
- Visual indicators for quick scanning
- Three categories:
  - ✓ **Eligible** - User meets all criteria (green badge)
  - ✗ **Not Eligible** - User doesn't meet key criteria (red badge, grayed out)
  - ? **Check Eligibility** - Potentially eligible, needs verification (amber badge)

### 4. **Multilingual Backend (AWS Translate)**
- Backend integrated with AWS Translate
- Supports 6+ Indian languages: Hindi, Telugu, Tamil, Bengali, Marathi, Gujarati
- API accepts `language` parameter
- Frontend currently uses English ('en')
- Ready to enable language selector in UI

### 5. **Government-Style UI**
- Clean, accessible design inspired by government portals
- Mobile-responsive for rural access
- High contrast and large fonts for readability

### 6. **RAG-Based Document Retrieval**
- Retrieval Augmented Generation (RAG) using ChromaDB
- Semantic search over 51 scheme documents
- Ensures AI responses are grounded in actual scheme data

### 7. **AWS-Native Architecture**
- Built using AWS best practices
- Serverless-ready (can deploy to Lambda)
- Scalable and cost-effective

### 8. **Analytics Dashboard (Backend)**
- DynamoDB logs user queries for insights
- Tracks: profession, state, category, language, schemes returned
- Privacy-first: Does NOT store age, income, or gender
- Backend returns confidence scores (not displayed in current UI)

### 9. **Fallback Mechanisms**
- If Bedrock unavailable → Falls back to local rule-based eligibility
- If ChromaDB unavailable → Falls back to local JSON scheme data
- Ensures system reliability

---

## ☁️ AWS Services Used

### 1. **Amazon Bedrock – AI Reasoning Engine**
**Purpose:** Core AI service for eligibility assessment

**Implementation:**
- Model: Claude Sonnet 4 (`anthropic.claude-sonnet-4-v1`)
- Invoked via `@aws-sdk/client-bedrock-runtime`
- Receives user profile + scheme data
- Returns structured JSON with eligibility status, reasoning, and confidence scores

**Why Bedrock:**
- State-of-the-art language model for complex reasoning
- Handles nuanced eligibility criteria
- Generates natural-language explanations
- Serverless and scalable

**Code:** `backend/services/bedrock.service.js`

---

### 2. **Amazon S3 – Scheme Document Storage**
**Purpose:** Stores scheme documents for knowledge base

**Implementation:**
- Bucket: `yojanasathi-kb-dev`
- Stores 51 scheme markdown files
- Used by RAG pipeline for document retrieval

**Why S3:**
- Scalable object storage
- Version control for scheme updates
- Cost-effective for document storage

**Code:** `backend/config/aws.js`, `scripts/setup-aws.sh`

---

### 3. **Amazon DynamoDB – Analytics Logging**
**Purpose:** Logs user queries for analytics (no PII)

**Implementation:**
- Table: `yojanasathi-analytics`
- Stores: queryId, timestamp, profession, state, category, language, schemesCount
- Does NOT store: age, income, gender (privacy-first)

**Why DynamoDB:**
- Serverless NoSQL database
- Fast writes for real-time logging
- Scalable for high traffic

**Code:** `backend/services/analytics.service.js`

---

### 4. **AWS Translate – Multilingual Support**
**Purpose:** Real-time translation to 6+ Indian languages

**Implementation:**
- Translates scheme descriptions, benefits, and AI reasoning
- Supports: Hindi, Telugu, Tamil, Bengali, Marathi, Gujarati
- Invoked via `@aws-sdk/client-translate`

**Why Translate:**
- Enables access for non-English speakers
- Real-time translation without pre-translated content
- Critical for rural citizens

**Code:** `backend/services/translate.service.js`

---

### 5. **AWS Transcribe – Voice Input (Optional)**
**Purpose:** Voice-based profile input for accessibility

**Implementation:**
- Configured in `backend/config/aws.js`
- Can transcribe voice input to text
- Future feature for low-literacy users

**Why Transcribe:**
- Improves accessibility
- Supports voice-first interaction
- Useful for rural citizens

---

### 6. **IAM – Access Control**
**Purpose:** Secure access to AWS services

**Implementation:**
- Role: `yojanasathi-lambda-role`
- Policies for Bedrock, S3, DynamoDB, Translate access
- Created via `scripts/setup-aws.sh`

**Why IAM:**
- Follows AWS security best practices
- Least-privilege access
- Audit trail for compliance

---

## 📁 File Structure

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
│   │   └── schemes.routes.js         # Scheme search endpoints
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
│   ├── package.json                  # Backend dependencies
│   └── server.js                     # Express server entry point
│
├── frontend/                         # React application
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── ConfidenceBadge.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LanguageSelector.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProfileSummary.jsx
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── ProfileForm.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   └── SchemeDetails.jsx
│   │   │
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # React entry point
│   │   ├── index.css                 # Global styles
│   │   └── styles.css                # Component styles
│   │
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite configuration
│   └── tailwind.config.js            # Tailwind CSS config
│
├── schemes/                          # Scheme data
│   ├── schemes.json                  # 51 government schemes (structured data)
│   └── markdown/                     # Markdown files for each scheme (51 files)
│       ├── pm-kisan.md
│       ├── ayushman-bharat.md
│       └── ...
│
├── scripts/                          # Infrastructure setup
│   ├── setup-aws.sh                  # AWS setup script (Linux/Mac)
│   └── setup-aws.ps1                 # AWS setup script (Windows)
│
├── .gitignore                        # Git ignore rules
├── README.md                         # This file
└── DEPLOYMENT-GUIDE.md               # Deployment instructions
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** 18+ and npm
- **AWS Account** with configured credentials
- **Python** 3.9+ (for ChromaDB - optional)
- **Git** for version control

---

### 1. Clone Repository
```bash
git clone <repository-url>
cd yojanasathi
```

---

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
BEDROCK_MODEL_ID=anthropic.claude-sonnet-4-v1

# Server
PORT=3000
NODE_ENV=development

# ChromaDB (Optional)
CHROMA_PATH=./data/chroma
CHROMA_COLLECTION_NAME=yojanasathi-schemes
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file (optional):
```bash
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env
```

---

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

This script will:
- ✅ Create S3 bucket: `yojanasathi-kb-dev`
- ✅ Create DynamoDB table: `yojanasathi-analytics`
- ✅ Create IAM role: `yojanasathi-lambda-role`
- ✅ Upload scheme documents to S3
- ✅ Verify Bedrock model access

---

### 5. Convert Schemes to Markdown

```bash
cd backend
npm run convert-schemes
```

This generates 51 markdown files in `schemes/markdown/`

---

### 6. (Optional) Ingest into Vector Database

```bash
# Install ChromaDB
pip install chromadb

# Start ChromaDB server
python -m chromadb.cli.cli run --host localhost --port 8000

# In another terminal, run ingestion
cd backend
npm run ingest
```

**Note:** System will fallback to local JSON if ChromaDB is unavailable.

---

### 7. Run the Application

**Start Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: **http://localhost:3000**

**Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: **http://localhost:5173**

---

### 8. Verify Setup

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

## 🎬 Demo Flow

### Step 1: Open Application
Navigate to **http://localhost:5173**

### Step 2: Enter User Profile
Fill in the profile form:
- **Age:** 30
- **Monthly Income:** ₹10,000 – ₹25,000 / month
- **Category:** OBC
- **Profession:** Farmer
- **State:** Telangana

### Step 3: AI Analyzes Eligibility
- System retrieves relevant schemes using RAG
- Amazon Bedrock (Claude Sonnet 4) analyzes eligibility
- AI generates natural-language explanations

### Step 4: View Personalized Recommendations
Results page shows:
- **Eligible Schemes** (e.g., PM-KISAN, PMAY-Gramin) with green ✓ badge
- **Potentially Eligible Schemes** (e.g., PM Mudra Yojana) with amber ? badge
- **Not Eligible Schemes** (grayed out) with red ✗ badge

Each scheme includes:
- ✅ Eligibility status badge
- 💬 AI-generated reasoning explanation
- 📄 Scheme name and ministry

### Step 5: View Scheme Details
Click on any eligible scheme to see:
- Full description
- Benefits
- Required documents
- Application process steps
- Official website link

### Step 6: Backend Analytics
- Query logged to DynamoDB
- Metadata: profession, state, category, language
- No PII stored (age, income, gender excluded)
- Confidence scores calculated but not displayed in UI

---

## 🌍 Impact

### 1. **Improved Awareness**
- Citizens discover schemes they didn't know existed
- Personalized recommendations reduce information overload
- AI explanations build understanding of eligibility

### 2. **Simplified Access**
- No need to manually read through 1000+ schemes
- AI does the heavy lifting of eligibility assessment
- Reduces time from hours to minutes

### 3. **Inclusive Reach**
- Multilingual support breaks language barriers
- Accessible to rural citizens and non-English speakers
- Voice input (future) for low-literacy users

### 4. **Transparency**
- AI provides clear reasoning for each recommendation
- Confidence scores indicate certainty
- Users understand why they qualify or don't qualify

### 5. **Scalability**
- System can easily scale to 1000+ schemes
- Adding new schemes doesn't require code changes
- AI learns patterns automatically

### 6. **Data-Driven Insights**
- Analytics help government understand citizen needs
- Identify gaps in scheme awareness
- Improve scheme design based on usage patterns

---

## 🔮 Future Improvements

### 1. **Expand Scheme Dataset**
- Add state-specific schemes (currently only central schemes)
- Increase coverage to 500+ schemes
- Include district-level schemes

### 2. **Voice-Based Interaction**
- Integrate AWS Transcribe for voice input
- Enable voice-first experience for low-literacy users
- Support voice output using AWS Polly

### 3. **Deploy Fully Serverless**
- Migrate to AWS Lambda for backend
- Use API Gateway for routing
- Deploy frontend to AWS Amplify
- Reduce infrastructure costs

### 4. **Analytics Dashboard**
- Build admin dashboard for scheme analytics
- Visualize usage patterns by state, profession, category
- Identify most-requested schemes

### 5. **Mobile Application**
- Build native mobile apps (iOS/Android)
- Offline mode with cached schemes
- Push notifications for new schemes

### 6. **Document Upload**
- Allow users to upload documents for verification
- Use AWS Textract to extract information
- Auto-fill profile from documents

### 7. **Chatbot Interface**
- Add conversational AI chatbot
- Users can ask questions about schemes
- Powered by Amazon Bedrock

### 8. **Application Assistance**
- Guide users through application process
- Pre-fill application forms
- Track application status

### 9. **Community Features**
- User reviews and ratings for schemes
- Success stories from beneficiaries
- Community forum for questions

### 10. **Integration with Government Portals**
- Direct integration with scheme application portals
- Single sign-on with DigiLocker
- Real-time application status updates

---

## 📊 Current Metrics

- **Total Schemes:** 51 government schemes
- **Categories Covered:** 12 (Agriculture, Healthcare, Education, Housing, etc.)
- **Languages Supported:** Backend supports 6+ (Frontend: English only)
- **AI Model:** Claude Sonnet 4 via Amazon Bedrock
- **Average Response Time:** < 3 seconds
- **Eligibility Categories:** 3 (Eligible, Potentially Eligible, Not Eligible)
- **Backend Features:** Confidence scores, multilingual translation ready

---

## 🤝 Contributing

This is a hackathon project built for AWS Generative AI Hackathon. For improvements:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - Free to use for educational and non-commercial purposes.

---

## 👥 Team

Built with ❤️ for making government welfare schemes accessible to all Indian citizens.

**Hackathon:** AWS Generative AI Hackathon  
**Theme:** Using AI to solve real-world problems  
**Focus:** Public welfare and social impact

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact: [Your Email]
- Documentation: See `DEPLOYMENT-GUIDE.md`

---

## 🙏 Acknowledgments

- **AWS** for providing Bedrock, S3, DynamoDB, and Translate services
- **Anthropic** for Claude Sonnet 4 foundation model
- **Government of India** for scheme data and documentation
- **Open Source Community** for tools and libraries

---

**Note:** This is a hackathon prototype demonstrating AI-powered government scheme discovery. For production deployment, additional security, scalability, testing, and compliance measures should be implemented.

---

