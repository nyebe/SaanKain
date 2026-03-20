"use client"

import { HeartIcon } from 'lucide-react';
import Image from 'next/image';

import { Card } from '@/components/ui/card';
import { FoursquarePlace } from '@/types/restaurant';

export default function ResultGalleryCard({
    item,
    className,
    onClick,
    isBookmarked = false,
    onBookmark,
}: {
    item: FoursquarePlace;
    className?: string;
    onClick?: () => void;
    isBookmarked?: boolean;
    onBookmark?: () => void;
}) {
    const category = item.categories && item.categories.length ? item.categories[0].name : null;
    const locationText = [item.location?.locality, item.location?.address].filter(Boolean).join(' · ');
    const distanceText =
        item.distance == null
            ? null
            : item.distance < 1000
                ? `${item.distance} m`
                : `${(item.distance / 1000).toFixed(1)} km`;
    const fsqId = item.fsq_place_id || item.fsq_id || item.name;
    const seed = encodeURIComponent(fsqId);
    const avatarUrl = `https://api.dicebear.com/9.x/identicon/svg?seed=${seed}`;

    return (
        <Card className={`overflow-hidden rounded-lg w-43 lg:w-60 relative ${onClick ? 'cursor-pointer transition-colors hover:bg-muted/50' : ''} ${className ?? ''}`} onClick={onClick}>
            {onBookmark && (
                <button
                    onClick={(evt) => { evt.stopPropagation(); onBookmark(); }}
                    className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-rose-500 transition-colors"
                    title={isBookmarked ? 'Remove bookmark' : 'Save restaurant'}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Save restaurant'}
                >
                    <HeartIcon
                        className={`size-4 ${isBookmarked ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                </button>
            )}
            <div className="flex flex-col">
                <div className="w-full bg-muted/10 h-32 lg:h-48 shrink-0 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        <div className="w-10 h-10 rounded-md bg-muted/10 shrink-0 overflow-hidden">
                            <Image src={avatarUrl} alt={item.name} width={40} height={40} />
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">{item.name}</div>
                            {category && <div className="text-xs text-muted-foreground mt-1 truncate">{category}</div>}
                        </div>
                    </div>

                    {locationText && <div className="text-xs text-muted-foreground mt-3 truncate">{locationText}</div>}

                    <div className="mt-3 text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                        {distanceText && <span>{distanceText}</span>}
                    </div>
                </div>
            </div>
        </Card>
    );
}
