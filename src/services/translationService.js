// Translation Service: Dynamic translation using external API + persistent client caching

const CACHE_PREFIX = 'learnsphere_trans_cache_';

// In-memory cache for ultra-fast same-session lookups
const memoryCache = new Map();

/**
 * Checks if a string looks like code, URL, or programming syntax that should NOT be translated.
 */
function shouldSkipTranslation(text) {
  if (!text || typeof text !== 'string') return true;
  const trimmed = text.trim();
  if (trimmed.length === 0) return true;

  // Pure numbers, dates, times, currencies
  if (/^[\d\s.,:;!?%$\-—+/*=()]+$/.test(trimmed)) return true;

  // URLs or file paths
  if (/^(https?:\/\/|\/|www\.)/i.test(trimmed)) return true;

  // Code snippets or programming keywords
  if (/^(const|let|var|function|import|export|class|return|SELECT|INSERT|UPDATE|DELETE|public|private)\b/.test(trimmed)) {
    return true;
  }

  // Bracket/curly brace code
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return true;
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) return true;

  return false;
}

/**
 * Retrieves cached translation from memory or localStorage.
 */
function getCached(text, targetLang) {
  const cacheKey = `${targetLang}:::${text}`;
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${targetLang}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed[text] === 'string') {
        memoryCache.set(cacheKey, parsed[text]);
        return parsed[text];
      }
    }
  } catch {
    // LocalStorage quota or parse error ignored
  }

  return null;
}

/**
 * Persists a translated string to memory and localStorage.
 */
function setCache(text, targetLang, translatedText) {
  const cacheKey = `${targetLang}:::${text}`;
  memoryCache.set(cacheKey, translatedText);

  try {
    const storageKey = `${CACHE_PREFIX}${targetLang}`;
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[text] = translatedText;

    // Limit cache size to 1000 items per language to avoid quota issues
    const keys = Object.keys(parsed);
    if (keys.length > 1000) {
      delete parsed[keys[0]];
    }

    localStorage.setItem(storageKey, JSON.stringify(parsed));
  } catch {
    // LocalStorage write failed safely
  }
}

/**
 * Translates text dynamically using an external translation provider.
 * Falls back to original text gracefully on network/API failure.
 *
 * @param {string} text - The source text (typically English).
 * @param {string} targetLang - Target language code ('hi', 'pa', 'fr', 'es', 'de').
 * @returns {Promise<string>} Translated text or original text.
 */
export async function translateText(text, targetLang = 'en') {
  if (!text || targetLang === 'en' || shouldSkipTranslation(text)) {
    return text;
  }

  // 1. Check local cache
  const cached = getCached(text, targetLang);
  if (cached) {
    return cached;
  }

  // 2. Check if a secure backend translation proxy or direct API key is configured
  const apiKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_TRANSLATION_API_KEY;
  const apiUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_TRANSLATION_API_URL;

  try {
    let translated = null;

    if (apiUrl) {
      // Custom backend proxy endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, target: targetLang, source: 'en' })
      });
      if (response.ok) {
        const data = await response.json();
        translated = data.translatedText || data.translation;
      }
    } else if (apiKey) {
      // Official Google Cloud Translation API (v2)
      const endpoint = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, target: targetLang, source: 'en', format: 'text' })
      });
      if (response.ok) {
        const data = await response.json();
        translated = data?.data?.translations?.[0]?.translatedText;
      }
    } else {
      // Standard public Google Translate GTX endpoint (CORS-friendly, reliable client fallback)
      const encoded = encodeURIComponent(text);
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encoded}`;

      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          translated = data[0].map((item) => (item ? item[0] : '')).join('');
        }
      }
    }

    if (translated && typeof translated === 'string' && translated.trim().length > 0) {
      setCache(text, targetLang, translated);
      return translated;
    }
  } catch (error) {
    // Network or API failure: log in dev and gracefully return original text
    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
      console.warn(`[TranslationService] API request failed for language "${targetLang}":`, error.message);
    }
  }

  // Graceful fallback to original content
  return text;
}

/**
 * Batch translates an array of strings in parallel with caching.
 */
export async function translateBatch(items, targetLang = 'en') {
  if (!Array.isArray(items) || items.length === 0 || targetLang === 'en') {
    return items;
  }
  return Promise.all(items.map((item) => translateText(item, targetLang)));
}
