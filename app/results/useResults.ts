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
import { ViewMode } from '@/types/ui';

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

    // UI state moved from ResultsClient
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
    const categories = Array.from(
        new Set(results.map((r) => r.category).filter(Boolean) as string[])
    ).sort();

    const [view, setView] = useState<ViewMode>(() => {
        try {
            const v = localStorage.getItem('saankain_view') as ViewMode | null;
            return v ?? 'list';
        } catch {
            return 'list';
        }
    });

    const [sortField, setSortField] = useState<'name' | 'type' | 'distance'>(() => {
        try {
            const sf = localStorage.getItem('saankain_sort_field') as 'name' | 'type' | 'distance' | null;
            return sf ?? 'name';
        } catch {
            return 'name';
        }
    });
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(() => {
        try {
            const sd = localStorage.getItem('saankain_sort_direction') as 'asc' | 'desc' | null;
            return sd ?? 'asc';
        } catch {
            return 'asc';
        }
    });

    const sentinelRef = useRef<HTMLDivElement | null>(null);

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

        const nearMeRe = /\bnear\s+(me|here|nearby)\b/i;
        if (nearMeRe.test(query) && !coords) {
            setResults([]);
            setErrorMessage(
                'Could not find your location. Try turning on location (use the location button) so results are searched by your current location.'
            );
            setVisibleCount(PAGE_SIZE);
            setLoading(false);
            return;
        }

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
            } catch {
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
    }

    function selectHistoryEntry(query: string) {
        setMessage(query);
        router.push(`/results?message=${encodeURIComponent(query)}`);
    }

    // Filtering / pagination / sorting
    const filteredResults = selectedCategories.includes('all')
        ? results
        : results.filter((r) => (r.category ? selectedCategories.includes(r.category) : false));

    function sortResults(list: RestaurantResult[]) {
        const dir = sortDirection === 'asc' ? 1 : -1;
        return [...list].sort((a, b) => {
            if (sortField === 'name') {
                const A = (a.name || '').toLowerCase();
                const B = (b.name || '').toLowerCase();
                return A < B ? -1 * dir : A > B ? 1 * dir : 0;
            }
            if (sortField === 'type') {
                const A = (a.category || '').toLowerCase();
                const B = (b.category || '').toLowerCase();
                return A < B ? -1 * dir : A > B ? 1 * dir : 0;
            }
            const Ad = typeof a.distance === 'number' ? a.distance : Number.POSITIVE_INFINITY;
            const Bd = typeof b.distance === 'number' ? b.distance : Number.POSITIVE_INFINITY;
            return (Ad - Bd) * dir;
        });
    }

    const sortedResults = sortResults(filteredResults);
    const visibleResults = sortedResults.slice(0, visibleCount);
    const hasMore = visibleCount < sortedResults.length;

    function loadMore() {
        setVisibleCount((prev) => prev + PAGE_SIZE);
    }

    // IntersectionObserver to auto-load more when sentinel comes into view
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore();
                }
            },
            { rootMargin: '120px' }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore]);

    return {
        message,
        setMessage,
        loading,
        errorMessage,
        results,
        visibleResults,
        hasMore,
        loadMore,
        sentinelRef,
        selectedCategories,
        setSelectedCategories,
        categories,
        sortField,
        setSortField,
        sortDirection,
        setSortDirection,
        view,
        setView,
        handleSubmit,
        history,
        removeEntry,
        clearHistory,
        selectHistoryEntry,
    };
}

