"use client"

import ResultGalleryCard from '@/components/cards/ResultGalleryCard';
import ResultListCard from '@/components/cards/ResultListCard';
import { RestaurantResult } from '@/types/restaurant';
import {
  ResultsListProps,
  ViewMode,
} from '@/types/ui';

export default function ResultsList({ results, view = 'list', onSelect, isBookmarked, onBookmark }: ResultsListProps & { view?: ViewMode }) {
  if (!results || results.length === 0) {
    return <div className="text-sm text-muted-foreground">Walang nahanap na kainan para sa query na ito. Try another cuisine or location.</div>;
  }

  const containerClass = view === 'gallery' ? 'flex justify-center flex-wrap gap-4' : 'flex flex-col gap-4'

  return (
    <div className={containerClass}>
      {results.map((item: RestaurantResult) => {
        const legacy = item as unknown as Record<string, unknown>;
        const fsq_place_id =
          item.fsqId ??
          (typeof legacy.fsq_place_id === 'string'
            ? (legacy.fsq_place_id as string)
            : typeof legacy.fsq_id === 'string'
              ? (legacy.fsq_id as string)
              : String(legacy.id ?? ''));

        const minimal = {
          fsq_place_id,
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
