/**
 * Convert schemes.json to individual markdown files
 * Run: npm run convert-schemes
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SCHEMES_JSON_PATH = join(__dirname, '../../schemes/schemes.json');
const OUTPUT_DIR = join(__dirname, '../../schemes/markdown');

/**
 * Convert scheme object to markdown format
 */
function schemeToMarkdown(scheme) {
  const eligibility = scheme.eligibility || {};

  return `# ${scheme.name}

## Category
${scheme.tags ? scheme.tags.join(', ') : 'General'}

## Ministry
${scheme.ministry}

## Description
${scheme.description}

## Eligibility Criteria

### Profession
${eligibility.profession ? eligibility.profession.join(', ') : 'All professions'}

### Category/Caste
${eligibility.categories ? eligibility.categories.join(', ') : 'All categories'}

### Age Requirement
${eligibility.age_min || 'No minimum'} to ${eligibility.age_max || 'No maximum'} years

### Income Limit
${eligibility.income_max || 'No income limit'}

### Additional Conditions
${eligibility.conditions ? eligibility.conditions.map(c => `- ${c}`).join('\n') : 'None'}

## Benefits
${scheme.benefits ? scheme.benefits.map(b => `- ${b}`).join('\n') : 'Check official website'}

## Required Documents
${scheme.documents ? scheme.documents.map((d, i) => `${i + 1}. ${d}`).join('\n') : 'Check official website'}

## Application Process
${scheme.apply_steps ? scheme.apply_steps.map((s, i) => `${i + 1}. ${s}`).join('\n') : 'Visit official website'}

## Official Link
${scheme.apply_link || 'Not available'}

## Target Beneficiaries
${eligibility.profession ? eligibility.profession.join(', ') : 'All citizens'}

## State Applicability
${scheme.state || 'All India'}

## Tags
${scheme.tags ? scheme.tags.join(', ') : 'government, scheme'}

---
*Document ID: ${scheme.id}*
*Last Updated: ${new Date().toISOString().split('T')[0]}*
`;
}

/**
 * Main conversion function
 */
function convertSchemesToMarkdown() {
  try {
    console.log('📄 Reading schemes.json...');

    // Read schemes
    const schemesData = readFileSync(SCHEMES_JSON_PATH, 'utf-8');
    const schemes = JSON.parse(schemesData);

    console.log(`✅ Found ${schemes.length} schemes`);

    // Create output directory
    if (!existsSync(OUTPUT_DIR)) {
      mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`📁 Created directory: ${OUTPUT_DIR}`);
    }

    // Convert each scheme
    schemes.forEach((scheme, index) => {
      const markdown = schemeToMarkdown(scheme);
      const filename = `${scheme.id}.md`;
      const filepath = join(OUTPUT_DIR, filename);

      writeFileSync(filepath, markdown, 'utf-8');
      console.log(`✅ [${index + 1}/${schemes.length}] Created: ${filename}`);
    });

    console.log(`\n🎉 Successfully converted ${schemes.length} schemes to markdown!`);
    console.log(`📂 Output directory: ${OUTPUT_DIR}`);

  } catch (error) {
    console.error('❌ Error converting schemes:', error.message);
    process.exit(1);
  }
}

// Run conversion
convertSchemesToMarkdown();
