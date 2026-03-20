import Groq from 'groq-sdk';
import { z } from 'zod';

import { ParsedSearch } from '@/types/search';

const parsedSearchSchema = z.object({
    cuisine: z.string().trim().min(1).nullable().optional().transform((v) => v ?? null),
    locationText: z.string().trim().min(1).nullable().optional().transform((v) => v ?? null),
    priceLevel: z.number().int().min(1).max(4).nullable().optional().transform((v) => v ?? null),
    openNow: z.boolean().optional().default(false),
});

export async function llmParseMessage(raw: string): Promise<ParsedSearch> {
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instruct';

    if (!apiKey) {
        throw new Error('GROQ_API_KEY is not configured');
    }

    const client = new Groq({ apiKey });

    const prompt = `You extract restaurant search filters from user text.
Return ONLY a JSON object with keys: cuisine (string|null), locationText (string|null), priceLevel (1-4|null), openNow (boolean).
Rules:
- cuisine: cuisine or food style mentioned (e.g., "ramen"), else null.
- locationText: place text after "near" or obvious city/area (keep short). For Metro Manila districts, include the city (e.g., "Sampaloc, Manila"; "BGC, Taguig"). If no clear place, null.
- priceLevel: map words ["cheap"/"inexpensive"/"budget"->1, "moderate"/"mid"->2, "expensive"/"pricey"/"premium"->3, "luxury"/"fine dining"->4]; else null.
- openNow: true if user asks for open now/currently open, else false.
If unsure, prefer null/false. Respond with JSON only, no prose.`;

    const completion = await client.chat.completions.create({
        model,
        temperature: 0.2,
        max_tokens: 256,
        messages: [
            { role: 'system', content: prompt },
            {
                role: 'user',
                content: `User message: """${raw}"""\nReturn JSON now.`,
            },
        ],
        response_format: { type: 'json_object' },
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
        throw new Error('LLM returned empty response');
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(content);
    } catch (err) {
        throw new Error('LLM response was not valid JSON');
    }

    const validated = parsedSearchSchema.safeParse(parsed);
    if (!validated.success) {
        throw new Error('LLM output failed validation');
    }

    const data = validated.data;
    return {
        cuisine: data.cuisine ?? null,
        locationText: data.locationText ?? null,
        priceLevel: data.priceLevel ?? null,
        openNow: data.openNow ?? false,
    };
}

export default llmParseMessage;
