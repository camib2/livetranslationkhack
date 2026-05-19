import { translate } from "google-translate-api-x";

interface TranslateOptions {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

interface TranslateResult {
  translatedText: string;
  detectedLanguage?: string;
}

/**
 * Translate text using Google Translate API
 */
export async function translateText(options: TranslateOptions): Promise<TranslateResult> {
  try {
    // Map our language codes to Google Translate language codes
    const sourceCode = mapLanguageCode(options.sourceLanguage);
    const targetCode = mapLanguageCode(options.targetLanguage);

    if (sourceCode === targetCode) {
      // No translation needed
      return { translatedText: options.text };
    }

    const result = await translate(options.text, {
      from: sourceCode,
      to: targetCode
    });

    return {
      translatedText: result.text || options.text,
      detectedLanguage: sourceCode
    };
  } catch (error) {
    console.error("Translation error:", error);
    // Return original text if translation fails
    return {
      translatedText: options.text,
      detectedLanguage: options.sourceLanguage
    };
  }
}

/**
 * Map our language codes to Google Translate codes
 */
function mapLanguageCode(lang: string): string {
  const map: Record<string, string> = {
    en: "en",
    it: "it",
    fi: "fi"
  };
  return map[lang] || "en";
}
