/**
 * Schemes API Routes
 */

import express from 'express';
import { validate, searchRequestSchema } from '../middleware/validation.js';
import { logger } from '../config/logger.js';
import { retrieveRelevantSchemes, rankSchemes } from '../services/rag.service.js';
import { invokeBedrockModel, localEligibilityCheck } from '../services/bedrock.service.js';
import { translateSchemeResults } from '../services/translate.service.js';
import { logQuery } from '../services/analytics.service.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

/**
 * POST /api/v1/schemes/search
 * Main search endpoint - retrieves and ranks schemes based on user profile
 */
router.post('/search', validate(searchRequestSchema), async (req, res, next) => {
  try {
    const { userProfile, query, language } = req.validatedBody;

    logger.info('Scheme search request', {
      occupation: userProfile.occupation,
      state: userProfile.state,
      category: userProfile.category,
      language,
    });

    // Step 1: Retrieve relevant schemes using RAG
    let schemes = await retrieveRelevantSchemes(userProfile, 10);

    if (schemes.length === 0) {
      return res.status(404).json({
        error: 'No Schemes Found',
        message: 'No schemes match your profile at this time.',
        results: [],
      });
    }

    // Step 2: Rank schemes by relevance
    schemes = rankSchemes(schemes, userProfile);

    // Step 3: Get AI eligibility assessment
    let assessments;
    try {
      assessments = await invokeBedrockModel(userProfile, schemes);
    } catch (error) {
      logger.warn('Bedrock failed, using local eligibility check', { error: error.message });
      assessments = localEligibilityCheck(userProfile, schemes);
    }

    // Step 4: Merge assessments with scheme data
    const results = schemes.map(scheme => {
      const assessment = assessments.find(a => a.id === scheme.id) || {
        status: 'Eligible',
        reasoning: 'Eligibility assessment pending',
        confidence: 0.5,
      };

      // Normalize confidence score to 0-1 range
      const normalizedConfidence = Math.min(Math.max(assessment.confidence || 0.5, 0), 1);

      return {
        id: scheme.id,
        name: scheme.name,
        state: scheme.state || 'All India',
        ministry: scheme.ministry,
        description: scheme.description,
        benefit: scheme.benefits ? scheme.benefits.join('. ') : '',
        documents: scheme.documents || [],
        applicationProcess: scheme.apply_steps || [],
        officialLinks: {
          portal: scheme.apply_link || '#',
          helpline: scheme.helpline || '',
        },
        score: normalizedConfidence,
        confidence: normalizedConfidence,
        ai_assessment: {
          status: assessment.status,
          reasoning: assessment.reasoning,
          confidence: normalizedConfidence,
          grounded: true,
        },
        retrieval: {
          score: scheme.relevanceScore || 0,
          grounded: true,
          sources: [scheme.id],
          confidence: 0.9,
        },
      };
    });

    // Step 5: Sort by eligibility status
    const sortedResults = [
      ...results.filter(r => r.ai_assessment.status === 'Eligible'),
      ...results.filter(r => r.ai_assessment.status === 'Potentially Eligible'),
      ...results.filter(r => r.ai_assessment.status === 'Not Eligible'),
    ];

    // Step 6: Translate if needed
    const translatedResults = await translateSchemeResults(sortedResults, language);

    // Step 7: Log analytics (non-blocking)
    logQuery(userProfile, translatedResults.length, language).catch(err => {
      logger.error('Analytics logging failed', { error: err.message });
    });

    // Step 8: Return response
    res.json({
      results: translatedResults,
      metadata: {
        timestamp: new Date().toISOString(),
        language,
        retrievalMethod: 'RAG',
        totalRetrieved: translatedResults.length,
        avgConfidence: translatedResults.reduce((sum, r) => sum + r.ai_assessment.confidence, 0) / translatedResults.length,
        citationCount: translatedResults.length,
      },
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/schemes/analyze-profile
 * Analyze user profile and return eligibility summary
 */
router.post('/analyze-profile', validate(searchRequestSchema), async (req, res, next) => {
  try {
    const { userProfile } = req.validatedBody;

    logger.info('Profile analysis request', {
      occupation: userProfile.occupation,
      category: userProfile.category,
    });

    // Retrieve schemes
    const schemes = await retrieveRelevantSchemes(userProfile, 20);

    // Get eligibility assessments
    let assessments;
    try {
      assessments = await invokeBedrockModel(userProfile, schemes);
    } catch (error) {
      assessments = localEligibilityCheck(userProfile, schemes);
    }

    // Count by status
    const summary = {
      eligible: assessments.filter(a => a.status === 'Eligible').length,
      potentiallyEligible: assessments.filter(a => a.status === 'Potentially Eligible').length,
      notEligible: assessments.filter(a => a.status === 'Not Eligible').length,
      total: assessments.length,
    };

    res.json({
      profile: {
        occupation: userProfile.occupation,
        category: userProfile.category,
        state: userProfile.state,
      },
      summary,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/schemes/:id
 * Get single scheme by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info('Get scheme by ID', { id });

    // Load schemes from local file
    const schemesPath = join(__dirname, '../../schemes/schemes.json');
    const schemesData = readFileSync(schemesPath, 'utf-8');
    const schemes = JSON.parse(schemesData);

    const scheme = schemes.find(s => s.id === id);

    if (!scheme) {
      return res.status(404).json({
        error: 'Scheme Not Found',
        message: `Scheme with ID '${id}' not found`,
      });
    }

    res.json({
      id: scheme.id,
      name: scheme.name,
      ministry: scheme.ministry,
      description: scheme.description,
      eligibility: scheme.eligibility,
      benefits: scheme.benefits,
      documents: scheme.documents,
      applicationProcess: scheme.apply_steps,
      officialLink: scheme.apply_link,
      tags: scheme.tags,
    });

  } catch (error) {
    next(error);
  }
});

export default router;
