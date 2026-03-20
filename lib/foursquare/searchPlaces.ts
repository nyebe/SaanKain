import axios from 'axios';

import { RestaurantResult } from '@/types/restaurant';
import {
  GeoCoords,
  ParsedSearch,
} from '@/types/search';

import { createFoursquareClient } from './client';
import {
  FoursquarePlaceRaw,
  transformPlace,
} from './transform';

type FoursquareSearchResponse = {
    results: FoursquarePlaceRaw[];
};

const LOCATION_NORMALIZATIONS: Array<[RegExp, string]> = [
    [/^\s*bgc\b/i, 'BGC, Taguig'],
    [/^\s*bonifacio/i, 'BGC, Taguig'],
    [/^\s*sampaloc\b/i, 'Sampaloc, Manila'],
    [/^\s*taft\b/i, 'Taft, Manila'],
    [/^\s*q(\.)?c(\.)?$/i, 'Quezon City'],
    [/^\s*quezon\s+city/i, 'Quezon City'],
    [/^\s*makati/i, 'Makati'],
    [/^\s*ortigas/i, 'Ortigas, Pasig'],
];

function normalizeLocationText(locationText: string): string {
    const cleaned = locationText.trim();
    if (!cleaned) return cleaned;

    const hasCountry = /philippines/i.test(cleaned);
    const hasComma = cleaned.includes(',');

    for (const [pattern, replacement] of LOCATION_NORMALIZATIONS) {
        if (pattern.test(cleaned)) {
            return replacement + (hasCountry ? '' : ', Philippines');
        }
    }

    if (hasCountry || hasComma) return cleaned;
    return `${cleaned}, Philippines`;
}

function buildSearchParams(parsed: ParsedSearch, coords?: GeoCoords | null): Record<string, string> {
    const requestedFields = process.env.FOURSQUARE_FIELDS ?? 'fsq_place_id,name,location,categories,distance,date_closed';
    const defaultLimit = process.env.FOURSQUARE_RESULT_LIMIT ?? '10';

    const params: Record<string, string> = {
        fields: requestedFields,
        limit: defaultLimit,
    };

    if (parsed.cuisine) {
        params.query = parsed.cuisine;
    }

    if (parsed.locationText) {
        params.near = normalizeLocationText(parsed.locationText);
    } else if (coords) {
        params.ll = `${coords.lat},${coords.lng}`;
        params.sort = 'DISTANCE';
    }

    return params;
}

export async function searchPlaces(parsed: ParsedSearch, coords?: GeoCoords | null): Promise<RestaurantResult[]> {
    const client = createFoursquareClient();
    const params = buildSearchParams(parsed, coords);

    try {
        const response = await client.get<FoursquareSearchResponse>('/places/search', { params });

        if (!response.data?.results) {
            return [];
        }

        return response.data.results
            .filter((place) => !place.date_closed)
            .map(transformPlace);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;
            const body = error.response.data as { message?: string } | undefined;
            const detail = body?.message ?? error.message;

            if (status === 401) {
                throw new Error(`Foursquare authentication failed (401): ${detail}. Check that FOURSQUARE_API_KEY in .env is a valid Places API key from location.foursquare.com/developer — not a Client ID or Client Secret.`);
            }

            throw new Error(`Foursquare API error (${status}): ${detail}`);
        }
        throw error;
    }
}
