"use client"

import {
    useEffect,
    useRef,
    useState,
} from 'react';

import { MapPin } from 'lucide-react';

import ViewModeToggle from '@/components/buttonGroup/ViewModeToggle';
import SearchForm from '@/components/forms/SearchForm';
import RestaurantLocationModal
    from '@/components/modals/RestaurantLocationModal';
import BookmarksSheet from '@/components/sheets/BookmarksSheet';
import SearchHistorySheet from '@/components/sheets/SearchHistorySheet';
import ErrorState from '@/components/states/ErrorState';
import LoadingState from '@/components/states/LoadingState';
import NoResultsHero from '@/components/states/NoResultsHero';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import ResultsList from '@/components/views/ResultsList';
import useBookmarks from '@/hooks/useBookmarks';
import useGeoLocation from '@/hooks/useGeoLocation';
import { RestaurantResult } from '@/types/restaurant';
import { ViewMode } from '@/types/ui';

import useResults from './useResults';

export default function ResultsClient() {
    const { useLocation, toggleLocation, coords, location, locationError, resolving } = useGeoLocation();
    const { bookmarks, isBookmarked, toggleBookmark, removeBookmark, clearBookmarks } = useBookmarks();
    const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantResult | null>(null);

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
    } = useResults(coords);
    const [view, setView] = useState<ViewMode>(() => {
        try {
            const v = localStorage.getItem('saankain_view') as ViewMode | null;
            return v ?? 'list';
        } catch {
            return 'list';
        }
    });
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
                <div className="flex items-center mb-6">
                    <SearchHistorySheet
                        history={history}
                        onSelect={selectHistoryEntry}
                        onRemove={removeEntry}
                        onClear={clearHistory}
                    />
                    <BookmarksSheet
                        bookmarks={bookmarks}
                        onSelect={(bookmarked) => setSelectedRestaurant({
                            fsqId: bookmarked.fsqId,
                            name: bookmarked.name,
                            address: bookmarked.address,
                            locality: bookmarked.locality,
                            region: bookmarked.region,
                            category: bookmarked.category,
                        })}
                        onRemove={removeBookmark}
                        onClear={clearBookmarks}
                    />
                    <Button
                        type="button"
                        variant={useLocation ? 'default' : 'outline'}
                        size="icon"
                        onClick={toggleLocation}
                        disabled={resolving}
                        title={useLocation ? 'Location active — click to disable' : 'Use my location'}
                        aria-label="Toggle location search"
                        className="shrink-0"
                    >
                        {resolving ? (
                            <Spinner className="size-4" />
                        ) : (
                            <MapPin className="size-4" />
                        )}
                    </Button>
                    {useLocation && (
                        <span className="shrink-0 tabular-nums text-xs text-muted-foreground ml-2 max-w-[60%] truncate">
                            {(() => {
                                const parts = [location?.municipality, location?.city, location?.region, location?.country].filter(Boolean) as string[];
                                if (parts.length > 0) return parts.join(', ');
                                return coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : '';
                            })()}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <SearchForm
                            message={message}
                            onChange={setMessage}
                            onSubmit={handleSubmit}
                            disabled={loading}
                            useLocation={useLocation}
                            toggleLocation={toggleLocation}
                            coords={coords}
                            resolving={resolving}
                            locationError={locationError}
                        />
                    </div>
                </div>

                {locationError && (
                    <p className="mt-2 text-xs text-destructive">{locationError}</p>
                )}

                <div className="mt-6">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div />
                        <ViewModeToggle
                            view={view}
                            onChange={(v) => {
                                setView(v);
                                try { localStorage.setItem('saankain_view', v); } catch { }
                            }}
                        />
                    </div>

                    {loading && <LoadingState />}
                    {errorMessage && <ErrorState message={errorMessage} />}

                    {showResults && (
                        <>
                            <ResultsList
                                results={visibleResults}
                                view={view}
                                onSelect={setSelectedRestaurant}
                                isBookmarked={isBookmarked}
                                onBookmark={toggleBookmark}
                            />

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
                    {!loading && !errorMessage && visibleResults.length === 0 && (
                        <NoResultsHero message={message} />
                    )}
                </div>
            </div>
            <RestaurantLocationModal
                restaurant={selectedRestaurant}
                open={selectedRestaurant !== null}
                onClose={() => setSelectedRestaurant(null)}
            />
        </main>
    );
}

