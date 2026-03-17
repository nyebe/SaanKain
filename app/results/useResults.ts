"use client"

import {
    useEffect,
    useState,
} from 'react';

import { useSearchParams } from 'next/navigation';

import { RestaurantResult } from '@/types/restaurant';

import { loadResults } from './dataResults';

export default function useResults() {
    const searchParams = useSearchParams();
    const initial = searchParams?.get('message') ?? '';

    const [message, setMessage] = useState<string>(initial);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [results, setResults] = useState<RestaurantResult[]>([]);

    useEffect(() => {
        const msg = searchParams?.get('message');
        if (!msg) return;
        const query = msg; // capture as a plain string for async usage

        let mounted = true;

        async function fetch() {
            setLoading(true);
            setErrorMessage(null);
            setResults([]);
            try {
                const response = await loadResults(query);
                if (!mounted) return;
                if (response.success) {
                    setResults(response.results);
                } else {
                    setErrorMessage(response.error.message);
                }
            } catch (err) {
                if (!mounted) return;
                setErrorMessage('Something went wrong while fetching results.');
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        }

        fetch();

        return () => {
            mounted = false;
        };
    }, [searchParams]);

    // SearchForm also performs navigation; this submit is provided for parity but
    // the SearchForm will push the URL which triggers the effect above.
    async function handleSubmit() {
        // no-op: navigation handled by SearchForm
    }

    return { message, setMessage, loading, errorMessage, results, handleSubmit };
}
