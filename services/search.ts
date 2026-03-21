import axios from 'axios';

import { ExecuteResponse } from '@/types/api';

export async function fetchSearchResults(message: string, ll?: string): Promise<ExecuteResponse> {
    if (!process.env.NEXT_PUBLIC_EXECUTE_API_CODE) {
        return {
            success: false,
            error: {
                code: 'CONFIGURATION_ERROR',
                message: 'Search service is not configured properly. Please contact support.',
            },
        };
    }

    const params = new URLSearchParams({
        message,
        code: process.env.NEXT_PUBLIC_EXECUTE_API_CODE || '',
    });

    if (ll) {
        params.set('ll', ll);
    }

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
