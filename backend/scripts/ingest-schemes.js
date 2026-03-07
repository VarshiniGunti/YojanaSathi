/**
 * Ingest scheme documents into ChromaDB
 * Run: npm run ingest
 */

import 'dotenv/config';
import { ChromaClient } from 'chromadb';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SCHEMES_JSON_PATH = join(__dirname, '../../schemes/schemes.json');
const CHROMA_PATH = process.env.CHROMA_PATH || './data/chroma';
const COLLECTION_NAME = process.env.CHROMA_COLLECTION_NAME || 'yojanasathi-schemes';

/**
 * Initialize ChromaDB and ingest schemes
 */
async function ingestSchemes() {
  try {
    console.log('🚀 Starting scheme ingestion...');

    // Initialize ChromaDB client (using default localhost:8000)
    const client = new ChromaClient();
    
    // Test connection
    await client.heartbeat();

    // Delete existing collection if it exists
    try {
      await client.deleteCollection({ name: COLLECTION_NAME });
      console.log('🗑️  Deleted existing collection');
    } catch (error) {
      // Collection doesn't exist, that's fine
    }

    // Create new collection
    const collection = await client.createCollection({
      name: COLLECTION_NAME,
      metadata: { description: 'Government scheme documents for YojanaSathi' },
    });

    console.log(`✅ Created collection: ${COLLECTION_NAME}`);

    // Read schemes
    const schemesData = readFileSync(SCHEMES_JSON_PATH, 'utf-8');
    const schemes = JSON.parse(schemesData);

    console.log(`📄 Found ${schemes.length} schemes to ingest`);

    // Prepare documents for ingestion
    const documents = [];
    const metadatas = [];
    const ids = [];

    schemes.forEach((scheme) => {
      // Create searchable text representation
      const eligibility = scheme.eligibility || {};
      const searchText = `
        Scheme: ${scheme.name}
        Ministry: ${scheme.ministry}
        Description: ${scheme.description}
        Profession: ${eligibility.profession ? eligibility.profession.join(', ') : 'All'}
        Category: ${eligibility.categories ? eligibility.categories.join(', ') : 'All'}
        Age: ${eligibility.age_min || 0} to ${eligibility.age_max || 100}
        Benefits: ${scheme.benefits ? scheme.benefits.join('. ') : ''}
        Tags: ${scheme.tags ? scheme.tags.join(', ') : ''}
      `.trim();

      documents.push(JSON.stringify(scheme));
      metadatas.push({
        id: scheme.id,
        name: scheme.name,
        ministry: scheme.ministry,
        professions: eligibility.profession ? eligibility.profession.join(',') : 'all',
        categories: eligibility.categories ? eligibility.categories.join(',') : 'all',
      });
      ids.push(scheme.id);
    });

    // Add documents to collection
    await collection.add({
      ids,
      documents,
      metadatas,
    });

    console.log(`✅ Ingested ${schemes.length} schemes into ChromaDB`);
    console.log(`📊 Collection: ${COLLECTION_NAME}`);
    console.log(`📂 Path: ${CHROMA_PATH}`);

    // Test query
    console.log('\n🔍 Testing retrieval...');
    const results = await collection.query({
      queryTexts: ['farmer schemes'],
      nResults: 3,
    });

    console.log(`✅ Retrieved ${results.documents[0].length} documents`);
    console.log('\n🎉 Ingestion complete!');

  } catch (error) {
    console.error('❌ Ingestion failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run ingestion
ingestSchemes();
