"use client"

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { Filter } from 'lucide-react';

import LocationToggle from '@/components/buttonGroup/LocationToggle';
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
import {
    BookmarkedRestaurant,
    GeoCoords,
    GeoLocation,
    SearchHistoryEntry,
} from '@/types/search';
import { ViewMode } from '@/types/ui';

import useResults from './useResults';

function FunctionButtons({
    history,
    onSelectHistory,
    onRemoveHistory,
    onClearHistory,
    bookmarks,
    onSelectBookmark,
    onRemoveBookmark,
    onClearBookmarks,
    useLocation,
    toggleLocation,
    coords,
    location,
    resolving,
}: {
    history: SearchHistoryEntry[];
    onSelectHistory: (q: string) => void;
    onRemoveHistory: (q: string) => void;
    onClearHistory: () => void;
    bookmarks: BookmarkedRestaurant[];
    onSelectBookmark: (b: BookmarkedRestaurant) => void;
    onRemoveBookmark: (fsqId: string) => void;
    onClearBookmarks: () => void;
    useLocation?: boolean;
    toggleLocation: () => void;
    coords?: GeoCoords | null;
    location?: GeoLocation | null;
    resolving?: boolean;
}) {
    return (
        <>
            <div className="flex items-center gap-2">
                <SearchHistorySheet
                    history={history}
                    onSelect={onSelectHistory}
                    onRemove={onRemoveHistory}
                    onClear={onClearHistory}
                />
                <BookmarksSheet
                    bookmarks={bookmarks}
                    onSelect={onSelectBookmark}
                    onRemove={onRemoveBookmark}
                    onClear={onClearBookmarks}
                />
                <LocationToggle useLocation={useLocation} resolving={resolving} onToggle={toggleLocation} />
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
        </>
    );
}

function SearchResultsControls({
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
    selectedCategories,
    setSelectedCategories,
    categories,
    view,
    setView,
}: {
    sortField: 'name' | 'type' | 'distance';
    sortDirection: 'asc' | 'desc';
    setSortField: (f: 'name' | 'type' | 'distance') => void;
    setSortDirection: (d: 'asc' | 'desc') => void;
    selectedCategories: string[];
    setSelectedCategories: Dispatch<SetStateAction<string[]>>;
    categories: string[];
    view: ViewMode;
    setView: (v: ViewMode) => void;
}) {
    return (
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
                        {categories.map((c: string) => (
                            <DropdownMenuCheckboxItem
                                key={c}
                                checked={selectedCategories.includes(c)}
                                onCheckedChange={(v) => {
                                    setSelectedCategories((prev: string[]) => {
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
                        setView(v as ViewMode);
                        try { localStorage.setItem('saankain_view', v); } catch { }
                    }}
                />
            </div>
        </div>
    );
}

function ResultsListSection({
    visibleResults,
    view,
    setSelectedRestaurant,
    isBookmarked,
    toggleBookmark,
    sentinelRef,
    hasMore,
    isExhausted,
    loading,
    errorMessage,
    message,
}: {
    visibleResults: RestaurantResult[];
    view: ViewMode;
    setSelectedRestaurant: (r: RestaurantResult | null) => void;
    isBookmarked: (fsqId: string) => boolean;
    toggleBookmark: (item: RestaurantResult) => void;
    sentinelRef: React.RefObject<HTMLDivElement | null>;
    hasMore: boolean;
    isExhausted: boolean;
    loading: boolean;
    errorMessage: string | null;
    message: string;
}) {
    if (loading) return <LoadingState />;
    if (errorMessage) return <ErrorState message={errorMessage} />;

    if (!loading && !errorMessage && visibleResults.length === 0) return <NoResultsHero message={message} />;

    return (
        <>
            <ResultsList
                results={visibleResults}
                view={view}
                onSelect={setSelectedRestaurant}
                isBookmarked={isBookmarked}
                onBookmark={toggleBookmark}
            />

            <div ref={sentinelRef} className="h-1" />

            {hasMore && (
                <div className="flex justify-center py-6">
                    <Spinner className="size-5 text-muted-foreground" />
                </div>
            )}

            {isExhausted && (
                <p className="text-center text-xs text-muted-foreground py-6">Try a different search!</p>
            )}
        </>
    );
}

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
    } = useResults(coords);
    // note: sorting persistence on user action

    const isExhausted = !loading && !errorMessage && !hasMore && visibleResults.length > 0;

    return (
        <main className="p-6">
            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <FunctionButtons
                        history={history}
                        onSelectHistory={selectHistoryEntry}
                        onRemoveHistory={removeEntry}
                        onClearHistory={clearHistory}
                        bookmarks={bookmarks}
                        onSelectBookmark={(bookmarked: BookmarkedRestaurant) => setSelectedRestaurant({
                            fsqId: bookmarked.fsqId,
                            name: bookmarked.name,
                            address: bookmarked.address,
                            locality: bookmarked.locality,
                            region: bookmarked.region,
                            category: bookmarked.category,
                        })}
                        onRemoveBookmark={removeBookmark}
                        onClearBookmarks={clearBookmarks}
                        useLocation={useLocation}
                        toggleLocation={toggleLocation}
                        coords={coords}
                        location={location}
                        resolving={resolving}
                    />
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
                    <SearchResultsControls
                        sortField={sortField}
                        sortDirection={sortDirection}
                        setSortField={setSortField}
                        setSortDirection={setSortDirection}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        categories={categories}
                        view={view}
                        setView={setView}
                    />

                    <ResultsListSection
                        visibleResults={visibleResults}
                        view={view}
                        setSelectedRestaurant={setSelectedRestaurant}
                        isBookmarked={isBookmarked}
                        toggleBookmark={toggleBookmark}
                        sentinelRef={sentinelRef}
                        hasMore={hasMore}
                        isExhausted={isExhausted}
                        loading={loading}
                        errorMessage={errorMessage}
                        message={message}
                    />
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

