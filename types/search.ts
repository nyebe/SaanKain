export interface GeoCoords {
    lat: number;
    lng: number;
}

export interface GeoLocation {
    coords: GeoCoords;
    displayName: string;
    address?: Record<string, unknown> | null;
    municipality?: string | null;
    city?: string | null;
    region?: string | null;
    country?: string | null;
}
export interface ParsedSearch {
    cuisine?: string | null;
    locationText?: string | null;
    priceLevel?: number | null;
    openNow?: boolean;
}

export interface SearchHistoryEntry {
    query: string;
    usedAt: string; // ISO date string
}

export interface BookmarkedRestaurant {
    fsqId: string;
    name: string;
    address: string | null;
    locality: string | null;
    region: string | null;
    category: string | null;
    savedAt: string; // ISO date string
}
