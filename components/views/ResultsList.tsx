"use client"

import React from "react";
import ResultCard from "@/components/cards/ResultCard";

interface SearchResultItem {
  id: string;
  name: string;
  cuisine: string;
  priceLevel: number;
  rating: number;
  distanceMeters?: number;
}

interface ResultsListProps {
  results: SearchResultItem[];
}

export default function ResultsList({ results }: ResultsListProps) {
  if (!results || results.length === 0) {
    return <div className="text-sm text-muted-foreground">No results yet. Try a different query.</div>;
  }

  return (
    <div className="grid gap-4">
      {results.map((item) => (
        <ResultCard key={item.id} item={item} />
      ))}
    </div>
  );
}
