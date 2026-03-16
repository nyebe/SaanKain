export type ValidationResult =
    | { valid: true; message: string }
    | { valid: false; error: { code: string; message: string } };

export function validateExecuteQuery(
    code: string | null,
    message: string | null
): ValidationResult {
    const validCode = process.env.EXECUTE_API_CODE;
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

    return { valid: true, message: message.trim() };
}
