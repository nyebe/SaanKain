import axios from 'axios';

import { ExecuteResponse } from '@/types/api';

export async function fetchSearchResults(message: string): Promise<ExecuteResponse> {
    const params = new URLSearchParams({
        message,
        code: 'pioneerdevai',
    });

    try {
        const response = await axios.get<ExecuteResponse>(`/api/v1/execute?${params.toString()}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
            return error.response.data as ExecuteResponse;
        }
        return {
            success: false,
            error: {
                code: 'NETWORK_ERROR',
                message: 'Unable to reach the search service. Please check your connection.',
            },
        };
    }
}
