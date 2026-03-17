"use client"

import ResultListCard from '@/components/cards/ResultListCard';
import { ResultsListProps } from '@/types/ui';

export default function ResultsList({ results }: ResultsListProps) {
  if (!results || results.length === 0) {
    return <div className="text-sm text-muted-foreground">No results yet. Try a different query.</div>;
  }

  return (
    <div className="grid gap-4">
      {results.map((item) => (
        <ResultListCard key={item.fsqId} item={item} />
      ))}
    </div>
  );
}
