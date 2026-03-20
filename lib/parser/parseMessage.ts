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
    loc = loc.replace(/\b(open now|open|restaurant|restaurants)\b/gi, '').trim();
    loc = loc.replace(new RegExp(Object.keys(PRICE_KEYWORDS).join('|'), 'gi'), '').trim();
    const normalized = loc.toLowerCase().replace(/[.,!?:;]$/g, '').trim();
    const vagueList = ['me', 'here', 'nearby', 'dito', 'rito', 'doon', 'dun'];
    if (vagueList.includes(normalized)) return 'me';

    // Return normalized (lowercase) location text so callers get a
    // predictable, comparable value (e.g., 'bgc').
    return normalized || null;
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
    async function translateIfTagalog(text: string): Promise<{ text: string; detectedTagalog: boolean }> {
        const customMap: Record<string, string> = {
            malapit: 'near',
            inumin: 'beverage',
            inuman: 'beverage',
            pagkain: 'food',
            meryenda: 'snacks',
            kapehan: 'coffee shop',
            tindahan: 'store',
        };

        function applyCustomMappings(s: string) {
            if (!s) return s;
            const keys = Object.keys(customMap).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            if (keys.length === 0) return s;
            const re = new RegExp(`\\b(${keys.join('|')})\\b`, 'gi');
            return s.replace(re, (m) => {
                const lower = m.toLowerCase();
                return customMap[lower] ?? m;
            });
        }

        return { text: applyCustomMappings(text), detectedTagalog: false };
    }

    const translatedRes = await translateIfTagalog(raw);
    const translated = translatedRes.text;
    const detectedTagalog = translatedRes.detectedTagalog;
    const shouldUseLLM =
        process.env.USE_LLM_PARSE !== 'false' &&
        process.env.NODE_ENV !== 'test' &&
        !!process.env.GROQ_API_KEY;
    const vagueNearRe = /\bnear\s+(me|here|nearby)\b/i;
    if (shouldUseLLM && !(detectedTagalog && vagueNearRe.test(translated))) {
        try {
            const parsed = await llmParseMessage(translated);
            return parsed;
        } catch {
        }
    }

    return parseMessageFallback(translated);
}

export default parseMessage;
