export interface GeoCoords {
    lat: number;
    lng: number;
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
