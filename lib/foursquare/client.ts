import axios, { AxiosInstance } from 'axios';

export function createFoursquareClient(): AxiosInstance {
    const apiKey = process.env.FOURSQUARE_API_KEY;
    const apiBase = process.env.FOURSQUARE_API_BASE;

    if (!apiKey || apiKey.startsWith('your_')) {
        throw new Error('FOURSQUARE_API_KEY is not configured. Set a valid Foursquare API key in your .env file.');
    }

    if (!apiBase) {
        throw new Error('FOURSQUARE_API_BASE not configured');
    }

    return axios.create({
        baseURL: apiBase,
        timeout: 5000,
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'X-Places-Api-Version': '2025-06-17',
            Accept: 'application/json',
        },
    });
}
