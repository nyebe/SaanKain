import { fetchSearchResults } from '@/services/search';
import { ExecuteResponse } from '@/types/api';

export async function loadResults(message: string): Promise<ExecuteResponse> {
    return fetchSearchResults(message);
}
