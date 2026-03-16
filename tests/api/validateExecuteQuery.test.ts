import {
  describe,
  expect,
  it,
} from 'vitest';

import { validateExecuteQuery } from '@/lib/validation/validateExecuteQuery';

describe('validateExecuteQuery — authentication', () => {
    it('rejects a wrong code', () => {
        const result = validateExecuteQuery('wrongcode', 'sushi near LA');
        expect(result.valid).toBe(false);
        if (!result.valid) expect(result.error.code).toBe('UNAUTHORIZED');
    });

    it('rejects an empty string code', () => {
        const result = validateExecuteQuery('', 'sushi near LA');
        expect(result.valid).toBe(false);
        if (!result.valid) expect(result.error.code).toBe('UNAUTHORIZED');
    });

    it('rejects a null code', () => {
        const result = validateExecuteQuery(null, 'sushi near LA');
        expect(result.valid).toBe(false);
        if (!result.valid) expect(result.error.code).toBe('UNAUTHORIZED');
    });

    it('rejects a code that is almost correct', () => {
        const result = validateExecuteQuery('pioneerdev', 'sushi near LA');
        expect(result.valid).toBe(false);
        if (!result.valid) expect(result.error.code).toBe('UNAUTHORIZED');
    });

    it('rejects a code with trailing space', () => {
        const result = validateExecuteQuery('pioneerdevai ', 'sushi near LA');
        expect(result.valid).toBe(false);
        if (!result.valid) expect(result.error.code).toBe('UNAUTHORIZED');
    });
});

describe('validateExecuteQuery — message validation', () => {
    it('rejects a null message', () => {
        const result = validateExecuteQuery('pioneerdevai', null);
        expect(result.valid).toBe(false);
        if (!result.valid) expect(result.error.code).toBe('INVALID_REQUEST');
    });

    it('rejects an empty message', () => {
        const result = validateExecuteQuery('pioneerdevai', '');
        expect(result.valid).toBe(false);
        if (!result.valid) expect(result.error.code).toBe('INVALID_REQUEST');
    });

    it('rejects a whitespace-only message', () => {
        const result = validateExecuteQuery('pioneerdevai', '   ');
        expect(result.valid).toBe(false);
        if (!result.valid) expect(result.error.code).toBe('INVALID_REQUEST');
    });

    it('rejects a message over 500 characters', () => {
        const result = validateExecuteQuery('pioneerdevai', 'a'.repeat(501));
        expect(result.valid).toBe(false);
        if (!result.valid) expect(result.error.code).toBe('INVALID_REQUEST');
    });

    it('accepts a message exactly 500 characters', () => {
        const result = validateExecuteQuery('pioneerdevai', 'a'.repeat(500));
        expect(result.valid).toBe(true);
    });
});

describe('validateExecuteQuery — valid inputs', () => {
    it('returns valid for correct code and message', () => {
        const result = validateExecuteQuery('pioneerdevai', 'sushi near BGC');
        expect(result.valid).toBe(true);
        if (result.valid) expect(result.message).toBe('sushi near BGC');
    });

    it('trims leading and trailing whitespace from message', () => {
        const result = validateExecuteQuery('pioneerdevai', '  cheap ramen  ');
        expect(result.valid).toBe(true);
        if (result.valid) expect(result.message).toBe('cheap ramen');
    });
});
