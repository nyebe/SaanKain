import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { searchPlaces } from '@/lib/foursquare/searchPlaces';
import { parseMessage } from '@/lib/parser/parseMessage';
import { rankResults } from '@/lib/ranking/rankResults';
import { validateExecuteQuery } from '@/lib/validation/validateExecuteQuery';
import { ExecuteResponse } from '@/types/api';

export async function GET(request: NextRequest): Promise<NextResponse<ExecuteResponse>> {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const message = searchParams.get('message');
    const ll = searchParams.get('ll');

    const validation = validateExecuteQuery(code, message, ll);

    if (!validation.valid) {
        const httpStatus = validation.error.code === 'UNAUTHORIZED' ? 401 : 400;
        return NextResponse.json(
            { success: false, error: validation.error },
            { status: httpStatus }
        );
    }

    const parsed = await parseMessage(validation.message);

    try {
        const results = await searchPlaces(parsed, validation.coords);
        const ranked = rankResults(results, parsed);

        return NextResponse.json({
            success: true,
            message: validation.message,
            parsed,
            results: ranked,
        });
    } catch (err) {
        const detail = err instanceof Error ? err.message : 'Unexpected error';

        if (typeof detail === 'string' && /Boundaries could not be determined/i.test(detail)) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'LOCATION_SUGGESTION',
                        message: 'Could not find your location. Try turning on location (use the location button) so results are searched by your current location.',
                    },
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'SEARCH_ERROR',
                    message: detail,
                },
            },
            { status: 500 }
        );
    }
}
