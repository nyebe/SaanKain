import { SearchResult } from '@/types/search';

export function getSimulatedResults(message: string): SearchResult[] {
    return [
        {
            id: 'res-1',
            name: `SaanKain — ${message.slice(0, 20)}`,
            cuisine: 'Filipino',
            priceLevel: 2,
            rating: 4.4,
            distanceMeters: 850,
        },
        {
            id: 'res-2',
            name: `Neighbourhood Eats`,
            cuisine: 'Sushi',
            priceLevel: 1,
            rating: 4.1,
            distanceMeters: 1200,
        },
        {
            id: 'res-3',
            name: `Budget Bites`,
            cuisine: 'Fast Food',
            priceLevel: 1,
            rating: 3.9,
            distanceMeters: 400,
        },
    ];
}
