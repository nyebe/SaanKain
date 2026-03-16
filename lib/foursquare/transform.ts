import { RestaurantResult } from '@/types/restaurant';

export type FoursquarePlaceRaw = {
    fsq_place_id: string;
    name: string;
    location?: {
        address?: string;
        formatted_address?: string;
        locality?: string;
        region?: string;
    };
    categories?: { name: string }[];
    price?: number;
    distance?: number;
    date_closed?: string;
};

export function transformPlace(raw: FoursquarePlaceRaw): RestaurantResult {
    return {
        fsqId: raw.fsq_place_id,
        name: raw.name,
        address: raw.location?.address ?? raw.location?.formatted_address ?? null,
        locality: raw.location?.locality ?? null,
        region: raw.location?.region ?? null,
        category: raw.categories?.[0]?.name ?? null,
        rating: null, // premium field — not available on free tier
        price: raw.price ?? null,
        isOpen: raw.date_closed ? false : null,
        distance: raw.distance ?? null,
    };
}
