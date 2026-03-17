"use client"

import ResultGalleryCard from '@/components/cards/ResultGalleryCard';
import ResultListCard from '@/components/cards/ResultListCard';
import {
  ResultsListProps,
  ViewMode,
} from '@/types/ui';

export default function ResultsList({ results, view = 'list', onSelect, isBookmarked, onBookmark }: ResultsListProps & { view?: ViewMode }) {
  if (!results || results.length === 0) {
    return <div className="text-sm text-muted-foreground">No results yet. Try a different query.</div>;
  }

  const containerClass = view === 'gallery' ? 'flex justify-center flex-wrap gap-4' : 'flex flex-col gap-4'

  return (
    <div className={containerClass}>
      {results.map((item) => {
        const minimal = {
          fsq_place_id: (item as any).fsqId || (item as any).fsq_place_id || String((item as any).id || ''),
          name: item.name,
          location: {
            address: item.address ?? null,
            locality: item.locality ?? null,
            region: item.region ?? null,
          },
          categories: item.category ? [{ name: item.category }] : null,
          distance: item.distance ?? null,
          date_closed: null,
        };

        if (view === 'gallery') {
          return <ResultGalleryCard
            key={minimal.fsq_place_id}
            item={minimal}
            onClick={() => onSelect?.(item)}
            isBookmarked={isBookmarked?.(minimal.fsq_place_id)}
            onBookmark={onBookmark ? () => onBookmark(item) : undefined}
          />;
        }

        return <ResultListCard
          key={minimal.fsq_place_id}
          item={minimal}
          onClick={() => onSelect?.(item)}
          isBookmarked={isBookmarked?.(minimal.fsq_place_id)}
          onBookmark={onBookmark ? () => onBookmark(item) : undefined}
        />;
      })}
    </div>
  );
}
