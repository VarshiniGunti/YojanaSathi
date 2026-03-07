# YojanaSathi — AI-Powered Government Scheme Finder

## The Problem

India has 1,000+ government welfare schemes, yet most eligible citizens never benefit. Government portals are fragmented, eligibility rules are complex, and language barriers shut out rural users. Welfare funds go unclaimed because people simply don't know what they qualify for.

## What I Built

YojanaSathi is a multilingual AI assistant where a citizen enters a basic profile — age, income, profession, category (SC/ST/OBC/General), state, and gender — and instantly receives a personalized list of government schemes they're eligible for, with plain-language explanations of why.

## How It Works

User profiles are sent from a **React + Tailwind** frontend (hosted on **AWS Amplify**) through **AWS API Gateway** to a **Node.js/Express** backend running on **AWS EC2** behind an Nginx reverse proxy. The backend performs **RAG (Retrieval-Augmented Generation)** — it queries a **ChromaDB** vector database of 51+ curated schemes to fetch the most relevant ones for that profile. These are passed as context to **Claude 3 Sonnet via Amazon Bedrock**, which reasons over complex eligibility rules (income thresholds, caste categories, state-specific conditions) and returns a natural-language verdict: *Eligible / Potentially Eligible / Not Eligible* with a human-readable explanation. Responses are then translated into the user's preferred language using **AWS Translate**. Scheme documents are stored on **Amazon S3**, analytics are logged to **DynamoDB**, and the custom domain is managed via **Route53** with SSL via **AWS Certificate Manager**.

## AWS Services Used

`Amazon Bedrock` · `AWS Amplify` · `API Gateway` · `EC2` · `AWS Translate` · `Amazon S3` · `DynamoDB` · `Route53` · `AWS Certificate Manager`

## Why AI

Traditional rule engines can't handle India's welfare complexity — eligibility spans income brackets, caste codes, occupational types, age bands, and state-level amendments. Claude 3 Sonnet reasons over unstructured eligibility text flexibly and at scale, grounded by RAG to prevent hallucination.

## Impact

- 51+ schemes across agriculture, healthcare, education, housing, and social security
- Multilingual support breaking language barriers for rural citizens
- One profile → instant, personalized, explainable welfare guidance for 1.4 billion people

---
*AI for Bharat Hackathon by AWS | Student Track: AI for Communities, Access & Public Impact*  
*[github.com/VarshiniGunti/YojanaSathi](https://github.com/VarshiniGunti/YojanaSathi)*
