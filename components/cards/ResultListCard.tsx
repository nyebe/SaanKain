"use client"

import { Card } from '@/components/ui/card';
import { FoursquarePlace } from '@/types/restaurant';

function formatDistance(meters: number | null | undefined): string {
  if (meters == null) return '—';
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export default function ResultListCard({ item }: { item: FoursquarePlace }) {
  const category = item.categories && item.categories.length ? item.categories[0].name : null;
  const locationText = [item.location?.address, item.location?.locality, item.location?.region].filter(Boolean).join(', ');
  const closed = Boolean(item.date_closed);
  const seed = encodeURIComponent(item.fsq_place_id || item.name);
  const avatarUrl = `https://api.dicebear.com/9.x/identicon/svg?seed=${seed}`;

  return (
    <Card className="p-3">
      <div className="flex items-start gap-3">
        <img src={avatarUrl} alt={item.name} className="w-12 h-12 rounded-md shrink-0 bg-muted/10" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 justify-between w-full">
            <h3 className="text-base font-semibold truncate">{item.name}</h3>
            {category && (
              <div className="text-sm text-muted-foreground">{category}</div>
            )}
          </div>

          <div className="flex items-center gap-2 justify-between w-full">

            {locationText && (
              <div className="text-xs text-muted-foreground mt-1 truncate">{locationText}</div>
            )}

            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              {closed ? <span className="text-red-500">Closed</span> : <span className="text-green-600">Open</span>}
              <span>·</span>
              <span>{formatDistance(item.distance)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
