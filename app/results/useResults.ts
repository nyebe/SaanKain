"use client"

import {
    useEffect,
    useState,
} from 'react';

import {
    useRouter,
    useSearchParams,
} from 'next/navigation';

import useSearchHistory from '@/hooks/useSearchHistory';
import { RestaurantResult } from '@/types/restaurant';

import { loadResults } from './dataResults';

export default function useResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initial = searchParams?.get('message') ?? '';

    const [message, setMessage] = useState<string>(initial);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [results, setResults] = useState<RestaurantResult[]>([]);

    const { history, addEntry, removeEntry, clearHistory } = useSearchHistory();

    useEffect(() => {
        const msg = searchParams?.get('message');
        if (!msg) return;
        const query = msg; // capture as a plain string for async usage

        let mounted = true;

        addEntry(query);

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

    function selectHistoryEntry(query: string) {
        setMessage(query);
        router.push(`/results?message=${encodeURIComponent(query)}`);
    }

    return {
        message,
        setMessage,
        loading,
        errorMessage,
        results,
        handleSubmit,
        history,
        removeEntry,
        clearHistory,
        selectHistoryEntry,
    };
}
