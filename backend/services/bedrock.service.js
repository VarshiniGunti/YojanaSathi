/**
 * Amazon Bedrock Service
 * Handles Claude 3 Sonnet invocations for eligibility reasoning
 */

import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { bedrockClient, AWS_CONFIG } from '../config/aws.js';
import { logger } from '../config/logger.js';
import OpenAI from 'openai';

// OpenAI fallback client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Generate eligibility assessment prompt
 */
function generatePrompt(userProfile, retrievedSchemes) {
  return `You are YojanaSathi, a STRICT eligibility checker for Indian government schemes.

CRITICAL RULES - YOU MUST FOLLOW THESE EXACTLY:
1. BE EXTREMELY STRICT - Mark "Not Eligible" if even ONE criterion doesn't match
2. PROFESSION MUST MATCH EXACTLY - A "Farmer" scheme is NOT eligible for "Student" 
3. CATEGORY MUST MATCH - If scheme requires "SC/ST", then "OBC" or "General" is NOT eligible
4. CHECK EVERY CRITERION - profession, category, age, income, state
5. Return ONLY valid JSON - no markdown, no extra text

USER PROFILE:
- Profession: ${userProfile.occupation}
- Category: ${userProfile.category}
- Age: ${userProfile.age} years
- Income: ${userProfile.income}
- State: ${userProfile.state}
- Gender: ${userProfile.gender}

SCHEMES TO EVALUATE:
${retrievedSchemes.map((s, i) => `
${i + 1}. ${s.name}
   Target Profession: ${s.eligibility?.profession ? s.eligibility.profession.join(', ') : 'Any'}
   Target Categories: ${s.eligibility?.categories ? s.eligibility.categories.join(', ') : 'Any'}
   Age Range: ${s.eligibility?.age_min || 0}-${s.eligibility?.age_max || 100}
   Description: ${s.description}
`).join('\n')}

EVALUATION RULES:
1. Check profession FIRST:
   - If scheme has specific profession requirement AND user's profession is NOT in that list → "Not Eligible"
   - Example: Scheme for "Farmer" + User is "Student" = "Not Eligible"

2. Check category SECOND:
   - If scheme has specific category requirement AND user's category is NOT in that list → "Not Eligible"
   - Example: Scheme for "SC, ST" + User is "OBC" = "Not Eligible"

3. Check age THIRD:
   - If user's age is outside the age range → "Not Eligible"

4. Only mark "Eligible" if ALL criteria match
5. Mark "Potentially Eligible" ONLY if user meets profession and category but needs document verification

Return JSON array in this EXACT format:
[
  {
    "id": "scheme-id",
    "name": "Scheme Name",
    "status": "Eligible" | "Potentially Eligible" | "Not Eligible",
    "reasoning": "Brief explanation mentioning which criteria matched or didn't match",
    "confidence": 0.0 to 1.0
  }
]

Return ONLY the JSON array, nothing else.`;
}

/**
 * Invoke Claude 3 Sonnet via Bedrock
 */
export async function invokeBedrockModel(userProfile, retrievedSchemes) {
  try {
    const prompt = generatePrompt(userProfile, retrievedSchemes);

    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4096,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    const command = new InvokeModelCommand({
      modelId: AWS_CONFIG.bedrockModelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

    logger.info('Invoking Bedrock model', { modelId: AWS_CONFIG.bedrockModelId });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    logger.info('Bedrock response received', {
      stopReason: responseBody.stop_reason,
      usage: responseBody.usage,
    });

    // Extract JSON from response
    const content = responseBody.content[0].text;
    const jsonMatch = content.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Bedrock response');
    }

    const assessments = JSON.parse(jsonMatch[0]);
    return assessments;

  } catch (error) {
    logger.error('Bedrock invocation failed', { 
      error: error.message,
      errorName: error.name,
      errorCode: error.code,
      statusCode: error.$metadata?.httpStatusCode,
      requestId: error.$metadata?.requestId,
      stack: error.stack
    });

    // Fallback to OpenAI if available
    if (openai) {
      logger.info('Falling back to OpenAI');
      return await invokeOpenAIFallback(userProfile, retrievedSchemes);
    }

    throw error;
  }
}

/**
 * OpenAI fallback for when Bedrock is unavailable
 */
async function invokeOpenAIFallback(userProfile, retrievedSchemes) {
  try {
    const prompt = generatePrompt(userProfile, retrievedSchemes);

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are YojanaSathi, an AI assistant for Indian government schemes. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from OpenAI response');
    }

    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    logger.error('OpenAI fallback failed', { error: error.message });
    throw error;
  }
}

/**
 * Local fallback - rule-based eligibility (when both Bedrock and OpenAI fail)
 */
export function localEligibilityCheck(userProfile, schemes) {
  logger.warn('Using local rule-based eligibility check');

  return schemes.map(scheme => {
    const eligibility = scheme.eligibility || {};
    let status = 'Eligible';
    let reasoning = '';
    let confidence = 0.7;

    // Check profession
    if (eligibility.profession && !eligibility.profession.includes(userProfile.occupation)) {
      status = 'Not Eligible';
      reasoning = `This scheme is for ${eligibility.profession.join(', ')} only. Your profile shows ${userProfile.occupation}.`;
      confidence = 0.95;
    }
    // Check category
    else if (eligibility.categories && !eligibility.categories.includes(userProfile.category)) {
      status = 'Not Eligible';
      reasoning = `This scheme requires ${eligibility.categories.join(' or ')} category. Your profile shows ${userProfile.category}.`;
      confidence = 0.95;
    }
    // Check age
    else if (
      (eligibility.age_min && userProfile.age < eligibility.age_min) ||
      (eligibility.age_max && userProfile.age > eligibility.age_max)
    ) {
      status = 'Not Eligible';
      reasoning = `Age requirement: ${eligibility.age_min || 0}-${eligibility.age_max || 100} years. Your age: ${userProfile.age}.`;
      confidence = 0.95;
    }
    // Eligible
    else {
      reasoning = `You meet the basic eligibility criteria for this scheme based on your ${userProfile.occupation} profession and ${userProfile.category} category.`;
      confidence = 0.8;
    }

    return {
      id: scheme.id,
      name: scheme.name,
      status,
      reasoning,
      confidence,
    };
  });
}
