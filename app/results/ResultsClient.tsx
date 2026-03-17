"use client"

import {
    useEffect,
    useRef,
    useState,
} from 'react';

import ViewModeToggle from '@/components/buttonGroup/ViewModeToggle';
import SearchForm from '@/components/forms/SearchForm';
import SearchHistorySheet from '@/components/sheets/SearchHistorySheet';
import ErrorState from '@/components/states/ErrorState';
import LoadingState from '@/components/states/LoadingState';
import { Spinner } from '@/components/ui/spinner';
import ResultsList from '@/components/views/ResultsList';
import { ViewMode } from '@/types/ui';

import useResults from './useResults';

export default function ResultsClient() {
    const {
        message,
        setMessage,
        loading,
        errorMessage,
        visibleResults,
        hasMore,
        loadMore,
        handleSubmit,
        history,
        removeEntry,
        clearHistory,
        selectHistoryEntry,
    } = useResults();
    const [view, setView] = useState<ViewMode>('list');
    const sentinelRef = useRef<HTMLDivElement>(null);

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
    }, [hasMore, loadMore]);

    const showResults = !loading && !errorMessage && visibleResults.length > 0;
    const isExhausted = !loading && !errorMessage && !hasMore && visibleResults.length > 0;

    return (
        <main className="p-6">
            <div className="mx-auto max-w-3xl">
                <SearchHistorySheet
                    history={history}
                    onSelect={selectHistoryEntry}
                    onRemove={removeEntry}
                    onClear={clearHistory}
                />
                <div className="flex items-start gap-2">
                    <div className="flex-1">
                        <SearchForm
                            message={message}
                            onChange={setMessage}
                            onSubmit={handleSubmit}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div />
                        <ViewModeToggle view={view} onChange={setView} />
                    </div>

                    {loading && <LoadingState />}
                    {errorMessage && <ErrorState message={errorMessage} />}

                    {showResults && (
                        <>
                            <ResultsList results={visibleResults} view={view} />

                            {/* Scroll sentinel — triggers loadMore when visible */}
                            <div ref={sentinelRef} className="h-1" />

                            {hasMore && (
                                <div className="flex justify-center py-6">
                                    <Spinner className="size-5 text-muted-foreground" />
                                </div>
                            )}

                            {isExhausted && (
                                <p className="text-center text-xs text-muted-foreground py-6">
                                    Yan na lahat ng results. Try a different search!
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
