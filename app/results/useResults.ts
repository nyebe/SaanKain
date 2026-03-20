"use client"

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import useSearchHistory from '@/hooks/useSearchHistory';
import { RestaurantResult } from '@/types/restaurant';
import { GeoCoords } from '@/types/search';

import { loadResults } from './dataResults';

export default function useResults(coords: GeoCoords | null = null) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initial = searchParams?.get('message') ?? '';

    const PAGE_SIZE = 10;

    const [message, setMessage] = useState<string>(initial);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [results, setResults] = useState<RestaurantResult[]>([]);
    const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

    const { history, addEntry, removeEntry, clearHistory } = useSearchHistory();
    const lastAddedQuery = useRef<string>('');

    useEffect(() => {
        const msg = searchParams?.get('message');
        if (!msg) {
            setResults([]);
            setErrorMessage(null);
            setVisibleCount(PAGE_SIZE);
            setLoading(false);
            return;
        }
        const query = msg;

        let mounted = true;

        if (query !== lastAddedQuery.current) {
            addEntry(query);
            lastAddedQuery.current = query;
        }

        async function runFetch() {
            setLoading(true);
            setErrorMessage(null);
            setResults([]);
            setVisibleCount(PAGE_SIZE);
            try {
                const response = await loadResults(query, coords);
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

        runFetch();

        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, coords]);

    async function handleSubmit() {
        // no-op: navigation handled by SearchForm
    }

    function selectHistoryEntry(query: string) {
        setMessage(query);
        router.push(`/results?message=${encodeURIComponent(query)}`);
    }

    const visibleResults = results.slice(0, visibleCount);
    const hasMore = visibleCount < results.length;

    function loadMore() {
        setVisibleCount((prev) => prev + PAGE_SIZE);
    }

    return {
        message,
        setMessage,
        loading,
        errorMessage,
        results,
        visibleResults,
        hasMore,
        loadMore,
        handleSubmit,
        history,
        removeEntry,
        clearHistory,
        selectHistoryEntry,
    };
}

