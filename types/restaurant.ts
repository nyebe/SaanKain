export type RestaurantResult = {
    fsqId: string;
    name: string;
    address: string | null;
    locality: string | null;
    region: string | null;
    category: string | null;
    rating?: number | null;
    price?: number | null;
    isOpen?: boolean | null;
    distance?: number | null;
};

export type FoursquarePlace = {
    fsq_place_id?: string;
    fsq_id?: string;
    name: string;
    location?: {
        address?: string | null;
        locality?: string | null;
        region?: string | null;
    } | null;
    categories?: Array<{ id?: string; name?: string }> | null;
    distance?: number | null;
    date_closed?: string | null;
};
