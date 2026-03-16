import { fetchSearchResults } from '@/services/search';
import { ExecuteResponse } from '@/types/api';

export async function loadSearchResults(message: string): Promise<ExecuteResponse> {
    return fetchSearchResults(message);
}
