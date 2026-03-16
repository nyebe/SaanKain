import { ParsedSearch } from '@/types/search';
import { RestaurantResult } from '@/types/restaurant';

export type ExecuteSuccessResponse = {
    success: true;
    message: string;
    parsed: ParsedSearch;
    results: RestaurantResult[];
};

export type ExecuteErrorResponse = {
    success: false;
    error: {
        code: string;
        message: string;
    };
};

export type ExecuteResponse = ExecuteSuccessResponse | ExecuteErrorResponse;
