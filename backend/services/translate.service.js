/**
 * Amazon Translate Service
 * Handles multilingual translation
 */

import { TranslateTextCommand } from '@aws-sdk/client-translate';
import { translateClient } from '../config/aws.js';
import { logger } from '../config/logger.js';

// Language code mapping
const LANGUAGE_MAP = {
  en: 'en',
  hi: 'hi',
  te: 'te',
  ta: 'ta',
  bn: 'bn',
  mr: 'mr',
  gu: 'gu',
};

/**
 * Translate text using Amazon Translate
 */
export async function translateText(text, targetLanguage) {
  // Skip translation for English
  if (targetLanguage === 'en' || !targetLanguage) {
    return text;
  }

  try {
    const targetLangCode = LANGUAGE_MAP[targetLanguage] || 'en';

    const command = new TranslateTextCommand({
      Text: text,
      SourceLanguageCode: 'en',
      TargetLanguageCode: targetLangCode,
    });

    const response = await translateClient.send(command);

    logger.info('Translation successful', {
      sourceLanguage: 'en',
      targetLanguage: targetLangCode,
      textLength: text.length,
    });

    return response.TranslatedText;

  } catch (error) {
    logger.error('Translation failed', {
      error: error.message,
      targetLanguage,
    });

    // Return original text if translation fails
    return text;
  }
}

/**
 * Translate scheme results
 */
export async function translateSchemeResults(schemes, targetLanguage) {
  if (targetLanguage === 'en' || !targetLanguage) {
    return schemes;
  }

  try {
    const translatedSchemes = await Promise.all(
      schemes.map(async (scheme) => {
        // Fields to translate
        const fieldsToTranslate = [
          'description',
          'ai_assessment.reasoning',
        ];

        // Translate benefits array
        const translatedBenefits = await Promise.all(
          (scheme.benefits || []).map(benefit => translateText(benefit, targetLanguage))
        );

        // Translate application process array
        const translatedProcess = await Promise.all(
          (scheme.applicationProcess || []).map(step => translateText(step, targetLanguage))
        );

        // Translate description
        const translatedDescription = await translateText(
          scheme.description || '',
          targetLanguage
        );

        // Translate AI reasoning
        const translatedReasoning = scheme.ai_assessment?.reasoning
          ? await translateText(scheme.ai_assessment.reasoning, targetLanguage)
          : '';

        return {
          ...scheme,
          description: translatedDescription,
          benefits: translatedBenefits,
          applicationProcess: translatedProcess,
          ai_assessment: {
            ...scheme.ai_assessment,
            reasoning: translatedReasoning,
          },
        };
      })
    );

    logger.info('Translated scheme results', {
      count: translatedSchemes.length,
      targetLanguage,
    });

    return translatedSchemes;

  } catch (error) {
    logger.error('Batch translation failed', {
      error: error.message,
      targetLanguage,
    });

    // Return original schemes if translation fails
    return schemes;
  }
}

/**
 * Get language name from code
 */
export function getLanguageName(code) {
  const names = {
    en: 'English',
    hi: 'हिंदी',
    te: 'తెలుగు',
    ta: 'தமிழ்',
    bn: 'বাংলা',
    mr: 'मराठी',
    gu: 'ગુજરાતી',
  };

  return names[code] || 'English';
}
