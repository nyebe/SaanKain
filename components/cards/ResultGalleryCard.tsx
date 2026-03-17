"use client"

import { Card } from '@/components/ui/card';
import { ResultCardProps } from '@/types/ui';

export default function ResultGalleryCard({ item, className }: ResultCardProps & { className?: string }) {
    const subtitle = [item.category, item.locality || item.address].filter(Boolean).join(' · ');
    const distanceText = item.distance == null ? null : item.distance < 1000 ? `${item.distance} m` : `${(item.distance / 1000).toFixed(1)} km`;

    return (
        <Card className={`overflow-hidden rounded-lg w-60 ${className ?? ''}`}>
            <div className="flex flex-col">
                <div className="w-full bg-muted/10 h-44 sm:h-48 shrink-0 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Image</div>
                </div>

                <div className="p-4">
                    <div className="font-semibold text-sm truncate">{item.name}</div>
                    {subtitle && <div className="text-xs text-muted-foreground mt-1 truncate">{subtitle}</div>}

                    <div className="mt-3 text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                        {item.price != null && <span>{'₱'.repeat(Math.max(1, item.price))}</span>}
                        {item.rating != null && <span>⭐ {item.rating}</span>}
                        {distanceText && <span>· {distanceText}</span>}
                    </div>
                </div>
            </div>
        </Card>
    );
}
