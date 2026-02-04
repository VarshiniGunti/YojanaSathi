# YojanaSathi – AI Government Scheme Finder

YojanaSathi is a multilingual AI-powered assistant that helps Indian citizens discover government welfare schemes they are eligible for using simple profile inputs like age, income, category, profession, and state.

The system uses Retrieval-Augmented Generation (RAG) with a verified knowledge base and Amazon Bedrock to provide grounded, explainable, and trustworthy scheme recommendations along with document checklists and step-by-step application guidance.

---

## Problem Statement

Citizens in India often struggle to find government welfare schemes they qualify for due to:
- Complex government portals  
- Lack of personalization  
- Language barriers  
- Misinformation from generic AI/chatbots  

YojanaSathi bridges this gap using AI grounded in verified data.

---

## Solution Overview

YojanaSathi collects basic user profile details and uses AI reasoning with RAG to:
- Match users with relevant government schemes  
- Explain why they are eligible  
- Show benefits and required documents  
- Provide step-by-step application instructions  

The focus is accessibility, transparency, and inclusion.

---

## Key Features

- Profile-based scheme discovery  
- Multilingual input and output  
- Voice input support (speech-to-text)  
- RAG-grounded AI responses  
- Ranked scheme recommendations  
- Explainable eligibility reasoning  
- Document checklist  
- Step-by-step application guidance  
- Responsible AI and privacy safeguards  

---

## System Architecture

Serverless Retrieval-Augmented Generation (RAG) system built on AWS.

| Layer | Technology |
|------|------------|
| Frontend | React + Tailwind CSS |
| API Layer | AWS API Gateway |
| Backend | AWS Lambda |
| AI Engine | Amazon Bedrock |
| Knowledge Base | S3 + OpenSearch |
| Translation | Amazon Translate |
| Voice Processing | Amazon Transcribe |
| Session Storage (Optional) | DynamoDB |

---

## How It Works

1. User enters profile details (age, income, category, profession, state)  
2. Optional voice input is converted to text  
3. Input is translated if required  
4. RAG retrieves relevant government scheme data  
5. Bedrock performs eligibility reasoning and ranking  
6. System generates structured recommendations  
7. Results are shown with explanations, document checklist, and application steps  

---

## Documentation

- requirements.md — Software Requirements Specification  
- design.md — System Design Document  

---

## Goal

To improve access to government welfare schemes by making discovery personalized, transparent, and multilingual, enabling inclusive public impact.

---

## Hackathon Project

This project was built as part of the AI for Bharat Hackathon - Student Track AI for public impact and community access.

Powered by AWS  
Hackathon Platform: Hack2Skill
