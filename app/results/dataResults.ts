import { fetchSearchResults } from '@/services/search';
import { ExecuteResponse } from '@/types/api';
import { GeoCoords } from '@/types/search';

export async function loadResults(message: string, coords?: GeoCoords | null): Promise<ExecuteResponse> {
    const ll = coords ? `${coords.lat},${coords.lng}` : undefined;
    return fetchSearchResults(message, ll);
}
