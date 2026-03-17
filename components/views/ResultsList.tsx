"use client"

import ResultListCard from '@/components/cards/ResultListCard';
import { ResultsListProps } from '@/types/ui';

export default function ResultsList({ results }: ResultsListProps) {
  if (!results || results.length === 0) {
    return <div className="text-sm text-muted-foreground">No results yet. Try a different query.</div>;
  }

  return (
    <div className="grid gap-4">
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

        return <ResultListCard key={minimal.fsq_place_id} item={minimal} />;
      })}
    </div>
  );
}
