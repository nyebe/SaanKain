"use client"

import {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    Filter,
    MapPin,
} from 'lucide-react';

import SortControl from '@/components/buttonGroup/SortControl';
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
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
        results: allResults,
        visibleResults: hookVisibleResults,
        loadMore,
        handleSubmit,
        history,
        removeEntry,
        clearHistory,
        selectHistoryEntry,
    } = useResults(coords);

    const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);

    const categories = Array.from(
        new Set(allResults.map((r) => r.category).filter(Boolean) as string[])
    ).sort();

    const filteredResults = selectedCategories.includes('all')
        ? allResults
        : allResults.filter((r) => (r.category ? selectedCategories.includes(r.category) : false));

    const visibleResults = filteredResults.slice(0, hookVisibleResults.length);
    const hasMore = visibleResults.length < filteredResults.length;
    const [view, setView] = useState<ViewMode>(() => {
        try {
            const v = localStorage.getItem('saankain_view') as ViewMode | null;
            return v ?? 'list';
        } catch {
            return 'list';
        }
    });
    const sentinelRef = useRef<HTMLDivElement>(null);
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
                <div className="mb-6">
                    <div className="flex items-center gap-2">
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
                    </div>

                    {useLocation && (
                        <div className="mt-2">
                            <span className="tabular-nums text-xs text-muted-foreground max-w-[100%] truncate block">
                                {(() => {
                                    const parts = [
                                        location?.barangay,
                                        location?.town,
                                        location?.cityDistrict,
                                        location?.municipality,
                                        location?.city,
                                        location?.region,
                                        location?.country,
                                    ].filter(Boolean) as string[];
                                    if (parts.length > 0) return parts.join(', ');
                                    return coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : '';
                                })()}
                            </span>
                        </div>
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
                        <div className="flex items-center gap-2">
                            <SortControl
                                field={sortField}
                                direction={sortDirection}
                                onChange={(field, dir) => {
                                    setSortField(field);
                                    setSortDirection(dir);
                                    try { localStorage.setItem('saankain_sort_field', field); localStorage.setItem('saankain_sort_direction', dir); } catch { }
                                }}
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div aria-label="Filter results">
                                        <Filter className="h-4 w-4" />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent sideOffset={8} className="min-w-[160px]">
                                    <DropdownMenuCheckboxItem
                                        checked={selectedCategories.includes('all')}
                                        onCheckedChange={(v) => {
                                            if (v) setSelectedCategories(['all']);
                                        }}
                                    >
                                        All
                                    </DropdownMenuCheckboxItem>
                                    {categories.map((c) => (
                                        <DropdownMenuCheckboxItem
                                            key={c}
                                            checked={selectedCategories.includes(c)}
                                            onCheckedChange={(v) => {
                                                setSelectedCategories((prev) => {
                                                    const next = prev.filter((x) => x !== 'all');
                                                    if (v) {
                                                        return Array.from(new Set([...next, c]));
                                                    }
                                                    const removed = next.filter((x) => x !== c);
                                                    return removed.length === 0 ? ['all'] : removed;
                                                });
                                            }}
                                        >
                                            {c}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <ViewModeToggle
                                view={view}
                                onChange={(v) => {
                                    setView(v);
                                    try { localStorage.setItem('saankain_view', v); } catch { }
                                }}
                            />
                        </div>
                    </div>

                    {loading && <LoadingState />}
                    {errorMessage && <ErrorState message={errorMessage} />}

                    {showResults && (
                        <>
                            <ResultsList
                                results={[...visibleResults].sort((a, b) => {
                                    const dir = sortDirection === 'asc' ? 1 : -1;
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
                                    // distance
                                    const Ad = typeof a.distance === 'number' ? a.distance : Number.POSITIVE_INFINITY;
                                    const Bd = typeof b.distance === 'number' ? b.distance : Number.POSITIVE_INFINITY;
                                    return (Ad - Bd) * dir;
                                })}
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
                                    Try a different search!
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

