"use client"

import React from "react";
import { Card } from "@/components/ui/card";

interface ResultItem {
  id: string;
  name: string;
  cuisine: string;
  priceLevel: number;
  rating: number;
  distanceMeters?: number;
}

interface ResultCardProps {
  item: ResultItem;
}

export default function ResultCard({ item }: ResultCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <div className="text-sm text-muted-foreground">{item.cuisine}</div>
          <div className="text-xs text-muted-foreground mt-1">Price: {'$'.repeat(Math.max(1, item.priceLevel))} · Rating: {item.rating}</div>
        </div>

        <div className="text-right text-sm">
          {item.distanceMeters ? <div>{Math.round(item.distanceMeters / 100)} km</div> : <div>—</div>}
        </div>
      </div>
    </Card>
  );
}
