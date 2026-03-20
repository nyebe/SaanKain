import { describe, expect, it } from 'vitest';

import { parseMessage } from '@/lib/parser/parseMessage';

describe('parseMessage - happy path', () => {
    it('detects sushi cuisine', async () => {
        const result = await parseMessage('cheap sushi near makati');
        expect(result.cuisine).toBe('sushi');
    });

    it('detects pizza cuisine', async () => {
        const result = await parseMessage('find a pizza place near BGC');
        expect(result.cuisine).toBe('pizza');
    });

    it('detects ramen cuisine', async () => {
        const result = await parseMessage('best ramen open now');
        expect(result.cuisine).toBe('ramen');
    });

    it('maps cheap keyword to priceLevel 1', async () => {
        const result = await parseMessage('cheap sushi');
        expect(result.priceLevel).toBe(1);
    });

    it('maps inexpensive keyword to priceLevel 1', async () => {
        const result = await parseMessage('inexpensive burger near taguig');
        expect(result.priceLevel).toBe(1);
    });

    it('maps budget keyword to priceLevel 1', async () => {
        const result = await parseMessage('budget korean food');
        expect(result.priceLevel).toBe(1);
    });

    it('maps moderate keyword to priceLevel 2', async () => {
        const result = await parseMessage('moderate priced sushi');
        expect(result.priceLevel).toBe(2);
    });

    it('maps expensive keyword to priceLevel 3', async () => {
        const result = await parseMessage('expensive steakhouse near manila');
        expect(result.priceLevel).toBe(3);
    });

    it('detects location after near', async () => {
        expect((await parseMessage('sushi near BGC')).locationText?.toLowerCase()).toBe('bgc');
        expect((await parseMessage('pizza near makati')).locationText?.toLowerCase()).toBe('makati');
    });

    it('detects openNow from open now', async () => {
        const result = await parseMessage('pizza place open now');
        expect(result.openNow).toBe(true);
    });

    it('parses full complex query', async () => {
        const result = await parseMessage('cheap sushi near makati open now');
        expect(result.cuisine).toBe('sushi');
        expect(result.priceLevel).toBe(1);
        expect(result.locationText?.toLowerCase()).toBe('makati');
        expect(result.openNow).toBe(true);
    });

    it('strips open now from location text', async () => {
        const result = await parseMessage('korean food near BGC open now');
        const loc = result.locationText?.toLowerCase() ?? '';
        expect(loc).not.toContain('open now');
        expect(loc).toContain('bgc');
    });
});

describe('parseMessage - edge cases', () => {
    it('returns null cuisine when no match', async () => {
        expect((await parseMessage('place to eat')).cuisine).toBeNull();
    });

    it('returns null priceLevel when no price keyword', async () => {
        expect((await parseMessage('sushi near BGC')).priceLevel).toBeNull();
    });

    it('returns null locationText when near is absent', async () => {
        expect((await parseMessage('cheap sushi open now')).locationText).toBeNull();
    });

    it('returns openNow false when keyword absent', async () => {
        expect((await parseMessage('cheap sushi')).openNow).toBe(false);
    });

    it('handles empty string gracefully', async () => {
        const result = await parseMessage('');
        expect(result.cuisine).toBeNull();
        expect(result.priceLevel).toBeNull();
        expect(result.locationText).toBeNull();
        expect(result.openNow).toBe(false);
    });

    it('handles whitespace-only string gracefully', async () => {
        const result = await parseMessage('   ');
        expect(result.cuisine).toBeNull();
        expect(result.openNow).toBe(false);
    });
});
