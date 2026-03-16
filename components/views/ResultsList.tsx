"use client"

import ResultCard from '@/components/cards/ResultCard';
import { ResultsListProps } from '@/types/ui';

export default function ResultsList({ results }: ResultsListProps) {
  if (!results || results.length === 0) {
    return <div className="text-sm text-muted-foreground">No results yet. Try a different query.</div>;
  }

  return (
    <div className="grid gap-4">
      {results.map((item) => (
        <ResultCard key={item.fsqId} item={item} />
      ))}
    </div>
  );
}
