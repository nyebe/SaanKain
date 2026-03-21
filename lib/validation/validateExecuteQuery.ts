import { GeoCoords } from '@/types/search';

export type ValidationResult =
    | { valid: true; message: string; coords: GeoCoords | null }
    | { valid: false; error: { code: string; message: string } };

function parseCoords(ll: string | null): GeoCoords | 'INVALID' | null {
    if (!ll) return null;
    const parts = ll.split(',').map((p) => p.trim());
    if (parts.length !== 2) return 'INVALID';

    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    const validLat = Number.isFinite(lat) && lat >= -90 && lat <= 90;
    const validLng = Number.isFinite(lng) && lng >= -180 && lng <= 180;

    if (!validLat || !validLng) return 'INVALID';
    return { lat, lng };
}

export function validateExecuteQuery(
    code: string | null,
    message: string | null,
    ll: string | null = null
): ValidationResult {
    const validCode = process.env.NEXT_PUBLIC_EXECUTE_API_CODE;
    const maxLength = parseInt(process.env.MAX_MESSAGE_LENGTH ?? '500', 10);

    if (!code || !validCode || code !== validCode) {
        return {
            valid: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Invalid code',
            },
        };
    }

    if (!message || !message.trim()) {
        return {
            valid: false,
            error: {
                code: 'INVALID_REQUEST',
                message: 'message parameter is required',
            },
        };
    }

    if (message.length > maxLength) {
        return {
            valid: false,
            error: {
                code: 'INVALID_REQUEST',
                message: `message must be less than ${maxLength} characters`,
            },
        };
    }

    const coords = parseCoords(ll);
    if (coords === 'INVALID') {
        return {
            valid: false,
            error: {
                code: 'INVALID_COORDS',
                message: 'll must be "lat,lng" with valid numeric ranges',
            },
        };
    }

    return { valid: true, message: message.trim(), coords };
}
