import axios from 'axios';

import { RestaurantResult } from '@/types/restaurant';
import { ParsedSearch } from '@/types/search';

import { createFoursquareClient } from './client';
import {
  FoursquarePlaceRaw,
  transformPlace,
} from './transform';

type FoursquareSearchResponse = {
    results: FoursquarePlaceRaw[];
};

function buildSearchParams(parsed: ParsedSearch): Record<string, string> {
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
        params.near = parsed.locationText;
    }

    return params;
}

export async function searchPlaces(parsed: ParsedSearch): Promise<RestaurantResult[]> {
    const client = createFoursquareClient();
    const params = buildSearchParams(parsed);

    try {
        const response = await client.get<FoursquareSearchResponse>('/places/search', { params });

        if (!response.data?.results) {
            return [];
        }

        return response.data.results.map(transformPlace);
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
