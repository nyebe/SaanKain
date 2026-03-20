import { ParsedSearch } from '@/types/search';

import llmParseMessage from './llmParseMessage';
import {
  CUISINES,
  OPEN_NOW_PATTERNS,
  PRICE_KEYWORDS,
} from './rules';

function findCuisine(message: string): string | null {
    for (const c of CUISINES) {
        const re = new RegExp(`\\b${c}\\b`, 'i');
        if (re.test(message)) return c;
    }
    return null;
}

function findPriceLevel(message: string): number | null {
    for (const key of Object.keys(PRICE_KEYWORDS)) {
        const re = new RegExp(`\\b${key}\\b`, 'i');
        if (re.test(message)) return PRICE_KEYWORDS[key];
    }
    return null;
}

function findOpenNow(message: string): boolean {
    for (const p of OPEN_NOW_PATTERNS) {
        if (p.test(message)) return true;
    }
    return false;
}

function findLocation(message: string): string | null {
    const nearRe = /near\s+([a-z0-9\s\-]+)/i;
    const m = message.match(nearRe);
    if (!m) return null;
    let loc = m[1].trim();
    // strip trailing keywords
    loc = loc.replace(/\b(open now|open|restaurant|restaurants)\b/gi, '').trim();
    // remove any trailing price words
    loc = loc.replace(new RegExp(Object.keys(PRICE_KEYWORDS).join('|'), 'gi'), '').trim();
    return loc || null;
}

function parseMessageFallback(raw: string): ParsedSearch {
    const message = (raw || '').toLowerCase();

    const cuisine = findCuisine(message);
    const priceLevel = findPriceLevel(message);
    const openNow = findOpenNow(message);
    const locationText = findLocation(raw);

    return {
        cuisine: cuisine ?? null,
        locationText: locationText ?? null,
        priceLevel: priceLevel ?? null,
        openNow,
    };
}

export async function parseMessage(raw: string): Promise<ParsedSearch> {
    const shouldUseLLM =
        process.env.USE_LLM_PARSE !== 'false' &&
        process.env.NODE_ENV !== 'test' &&
        !!process.env.GROQ_API_KEY;

    if (shouldUseLLM) {
        try {
            const parsed = await llmParseMessage(raw);
            return parsed;
        } catch (err) {
            // fall through to regex fallback
        }
    }

    return parseMessageFallback(raw);
}

export default parseMessage;
