/**
 * RAG (Retrieval Augmented Generation) Service
 * Handles document retrieval from vector database
 */

import { ChromaClient } from 'chromadb';
import { logger } from '../config/logger.js';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize ChromaDB client
const chromaPath = process.env.CHROMA_PATH || './data/chroma';
const collectionName = process.env.CHROMA_COLLECTION_NAME || 'yojanasathi-schemes';

let chromaClient;
let collection;

/**
 * Initialize ChromaDB connection
 */
export async function initializeChroma() {
  try {
    chromaClient = new ChromaClient();

    // Get or create collection
    try {
      collection = await chromaClient.getCollection({ name: collectionName });
      logger.info('Connected to existing ChromaDB collection', { name: collectionName });
    } catch (error) {
      collection = await chromaClient.createCollection({
        name: collectionName,
        metadata: { description: 'Government scheme documents' },
      });
      logger.info('Created new ChromaDB collection', { name: collectionName });
    }

    return collection;
  } catch (error) {
    logger.error('Failed to initialize ChromaDB', { error: error.message });
    throw error;
  }
}

/**
 * Retrieve relevant schemes based on user profile
 */
export async function retrieveRelevantSchemes(userProfile, topK = 5) {
  try {
    // Try ChromaDB first if available
    if (!collection) {
      try {
        await initializeChroma();
      } catch (error) {
        logger.warn('ChromaDB unavailable, using local scheme dataset', { error: error.message });
        console.log('ChromaDB unavailable, using local scheme dataset');
        return loadLocalSchemes();
      }
    }

    // Build query text from user profile
    const queryText = `
      Profession: ${userProfile.occupation}
      Category: ${userProfile.category}
      Income: ${userProfile.income}
      Age: ${userProfile.age}
      State: ${userProfile.state}
    `;

    logger.info('Querying ChromaDB', { queryText, topK });

    // Query the collection
    const results = await collection.query({
      queryTexts: [queryText],
      nResults: topK,
    });

    if (!results.documents || results.documents[0].length === 0) {
      logger.warn('No documents found in ChromaDB, falling back to local schemes');
      console.log('ChromaDB unavailable, using local scheme dataset');
      return loadLocalSchemes();
    }

    // Parse retrieved documents
    const schemes = results.documents[0].map((doc, index) => {
      try {
        return JSON.parse(doc);
      } catch (error) {
        logger.error('Failed to parse scheme document', { error: error.message });
        return null;
      }
    }).filter(Boolean);

    logger.info('Retrieved schemes from ChromaDB', { count: schemes.length });

    return schemes;

  } catch (error) {
    logger.error('RAG retrieval failed', { error: error.message });
    console.log('ChromaDB unavailable, using local scheme dataset');
    // Fallback to local schemes
    return loadLocalSchemes();
  }
}

/**
 * Load schemes from local JSON file (fallback)
 */
async function loadLocalSchemes() {
  try {
    const schemesPath = join(__dirname, '../../schemes/schemes.json');

    try {
      const schemesData = await readFile(schemesPath, 'utf-8');
      const schemes = JSON.parse(schemesData);

      logger.info('Loaded schemes from local file', { count: schemes.length });

      return schemes;
    } catch (fileError) {
      logger.error('Local schemes file not found or corrupted', { 
        path: schemesPath, 
        error: fileError.message 
      });
      return [];
    }

  } catch (error) {
    logger.error('Failed to load local schemes', { error: error.message });
    return [];
  }
}

/**
 * Filter schemes by user profile (additional filtering after retrieval)
 */
export function filterSchemesByProfile(schemes, userProfile) {
  return schemes.filter(scheme => {
    const eligibility = scheme.eligibility || {};

    // Filter by profession
    if (eligibility.profession && eligibility.profession.length > 0) {
      if (!eligibility.profession.includes(userProfile.occupation)) {
        return false;
      }
    }

    // Filter by category
    if (eligibility.categories && eligibility.categories.length > 0) {
      if (!eligibility.categories.includes(userProfile.category)) {
        return false;
      }
    }

    // Filter by age
    if (eligibility.age_min && userProfile.age < eligibility.age_min) {
      return false;
    }
    if (eligibility.age_max && userProfile.age > eligibility.age_max) {
      return false;
    }

    return true;
  });
}

/**
 * Rank schemes by relevance score
 */
export function rankSchemes(schemes, userProfile) {
  return schemes.map(scheme => {
    let score = 0;
    const eligibility = scheme.eligibility || {};

    // Exact profession match
    if (eligibility.profession && eligibility.profession.includes(userProfile.occupation)) {
      score += 10;
    }

    // Exact category match
    if (eligibility.categories && eligibility.categories.includes(userProfile.category)) {
      score += 8;
    }

    // Age within range
    if (
      (!eligibility.age_min || userProfile.age >= eligibility.age_min) &&
      (!eligibility.age_max || userProfile.age <= eligibility.age_max)
    ) {
      score += 5;
    }

    // State match (if applicable)
    if (scheme.state && (scheme.state === 'All India' || scheme.state === userProfile.state)) {
      score += 3;
    }

    return { ...scheme, relevanceScore: score };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);
}
