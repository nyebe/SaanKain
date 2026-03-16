"use client"

import { Card } from '@/components/ui/card';
import { ResultCardProps } from '@/types/ui';

function formatDistance(meters: number | null | undefined): string {
  if (meters == null) return '—';
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatPrice(price: number | null | undefined): string {
  if (price == null) return '—';
  return '$'.repeat(Math.max(1, price));
}

export default function ResultCard({ item }: ResultCardProps) {
  const openLabel = item.isOpen === true ? 'Open now' : item.isOpen === false ? 'Closed' : null;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold truncate">{item.name}</h3>

          {item.category && (
            <div className="text-sm text-muted-foreground">{item.category}</div>
          )}

          {(item.address || item.locality) && (
            <div className="text-xs text-muted-foreground mt-1">
              {[item.address, item.locality, item.region].filter(Boolean).join(', ')}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
            <span>Price: {formatPrice(item.price)}</span>
            {item.rating != null && <span>Rating: {item.rating}</span>}
            {openLabel && (
              <span className={item.isOpen ? 'text-green-600' : 'text-red-500'}>
                {openLabel}
              </span>
            )}
          </div>
        </div>

        <div className="text-right text-xs text-muted-foreground shrink-0">
          {formatDistance(item.distance)}
        </div>
      </div>
    </Card>
  );
}
