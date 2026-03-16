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
