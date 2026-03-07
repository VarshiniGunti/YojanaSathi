# YojanaSathi – AI Powered Government Scheme Finder

> **Empowering Indian citizens to discover government welfare schemes they're eligible for using Generative AI on AWS**

[![AWS](https://img.shields.io/badge/AWS-Amplify%20%7C%20API%20Gateway%20%7C%20Bedrock-orange)](https://aws.amazon.com/)
[![AI](https://img.shields.io/badge/AI-Claude%203%20Sonnet-blue)](https://www.anthropic.com/claude)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)

**Hackathon:** AI for Bharat by AWS  
**Team:** SoloForge AI  

**Challenges:** [Student Track] AI for Communities, Access & Public Impact  

---

# Project Overview

## The Problem

India has **1000+ government welfare schemes** across central and state governments.

However:

- Citizens often **do not know which schemes they qualify for**
- Government portals provide **static information without personalization**
- Eligibility rules are **complex and difficult to understand**
- Users must manually search across multiple government websites
- Language barriers limit accessibility for rural users

---

## The Solution

**YojanaSathi** uses **Generative AI on AWS** to provide personalized scheme recommendations.

Users enter a simple profile:

- Age
- Monthly income
- Profession
- Category
- State
- Gender

The system then:

1. Retrieves relevant schemes using **RAG (Retrieval Augmented Generation)**
2. Uses **Claude 3 Sonnet via Amazon Bedrock** for reasoning
3. Generates **natural-language explanations**
4. Categorizes schemes by eligibility
5. Supports **multilingual translation**

---

# Why AI Is Required

Government schemes contain **complex eligibility criteria**.

Example requirements include:

- Income thresholds
- Category restrictions (SC/ST/OBC)
- Profession specific conditions
- Age requirements
- State-specific eligibility

Traditional rule-based systems struggle to maintain such complex logic across **hundreds of schemes**.

AI enables:

- Natural language reasoning
- Flexible eligibility analysis
- Personalized recommendations
- Clear explanations for users

---

# Key Features

## AI-Powered Scheme Recommendations

- Uses **RAG retrieval with ChromaDB**
- Uses **Claude 3 Sonnet via Amazon Bedrock**
- Provides relevance scoring and eligibility reasoning

---

## Natural Language Explanations

Example AI explanation:

```
You are eligible for PM-KISAN because you are a farmer and your income is below the threshold.
```

or

```
This scheme requires SC/ST category while your profile shows OBC.
```

---

## Eligibility Status Categories

| Status | Meaning |
|------|------|
| Eligible | User meets eligibility criteria |
| Potentially Eligible | Needs document verification |
| Not Eligible | Does not meet key conditions |

---

# Data Flow

1. User submits profile from frontend
2. API Gateway routes request to backend
3. Backend retrieves relevant schemes using RAG
4. Claude 3 Sonnet evaluates eligibility
5. Results translated if needed
6. Analytics logged to DynamoDB
7. Recommendations returned to user

---

# Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
React | UI framework |
Vite | Build tool |
Tailwind CSS | Styling |
React Router | Navigation |

---

## Backend

| Technology | Purpose |
|---|---|
Node.js | Runtime |
Express.js | API framework |
Joi | Validation |
Winston | Logging |
Morgan | HTTP logging |

---

## AI & ML

| Technology | Purpose |
|---|---|
Amazon Bedrock | AI reasoning |
Claude 3 Sonnet | Foundation model |
ChromaDB | Vector search |
RAG | Context retrieval |

---

# AWS Services Used

| Service | Purpose |
|---|---|
AWS Amplify | Frontend hosting |
API Gateway | Secure API routing |
EC2 | Backend server |
Nginx | Reverse proxy |
Amazon Bedrock | AI reasoning |
AWS Translate | Multilingual translation |
Amazon S3 | Scheme document storage |
DynamoDB | Analytics logging |
Route53 | Domain management |
AWS Certificate Manager | HTTPS SSL certificates |

---
**Architecture**

YojanaSathi uses a cloud-native AWS architecture combining Amplify for frontend hosting, API Gateway for secure API access, EC2 for backend compute, and Amazon Bedrock for AI-powered eligibility reasoning.

# AWS Cloud Architecture

```text
                         ┌─────────────────────────────┐
                         │        Users / Browser      │
                         │   Mobile / Desktop Clients  │
                         └──────────────┬──────────────┘
                                        │
                                        ▼
                           Custom Domain (Route53)
                           https://yojanasathi.tech
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │        AWS Amplify          │
                         │  React Frontend Hosting     │
                         │  CI/CD from GitHub          │
                         └──────────────┬──────────────┘
                                        │ HTTPS
                                        ▼
                         ┌─────────────────────────────┐
                         │        API Gateway          │
                         │  Secure API Management      │
                         │  CORS + Routing             │
                         └──────────────┬──────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │         AWS EC2             │
                         │   Node.js Express Backend   │
                         │   Managed with PM2          │
                         └──────────────┬──────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │        Nginx Proxy          │
                         │  Routes /api → Node server  │
                         └──────────────┬──────────────┘
                                        │
                                        ▼
               ┌──────────────────────────────────────────────┐
               │              AI & Data Layer                  │
               │                                              │
               │  Amazon Bedrock → Claude 3 Sonnet            │
               │  AWS Translate → Multilingual responses      │
               │  Amazon S3 → Scheme knowledge base           │
               │  DynamoDB → Privacy-safe analytics           │
               │  ChromaDB → Vector retrieval (RAG)           │
               └──────────────────────────────────────────────┘
```
---

# File Structure

```
yojanasathi
│
├── backend
│   ├── config
│   ├── middleware
│   ├── routes
│   ├── services
│   └── server.js
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── App.jsx
│
├── schemes
│   └── schemes.json
│
├── scripts
│
├── amplify.yml
├── deploy-backend.sh
└── README.md
```

---

# Deployment Overview

## Frontend

Hosted on **AWS Amplify**

- Automatic CI/CD from GitHub
- Custom domain via Route53
- HTTPS via AWS Certificate Manager

---

## Backend

Hosted on **AWS EC2**

- Node.js + Express server
- PM2 process manager
- Nginx reverse proxy

---

## AI Layer

Uses **Amazon Bedrock**

```
Model: Claude 3 Sonnet
```

---

# Current Coverage

- **51+ government schemes**
- Agriculture
- Healthcare
- Education
- Housing
- Social security
- Entrepreneurship

---

# License

MIT License - Free to use for educational and non-commercial purposes.

---

# Acknowledgments

- AWS for infrastructure and Bedrock
- Anthropic for Claude 3 Sonnet
- Government of India for scheme data
- Open source community
