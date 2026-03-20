"use client"

import {
    ExternalLink,
    MapPin,
} from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { RestaurantLocationModalProps } from '@/types/ui';

export default function RestaurantLocationModal({ restaurant, open, onClose }: RestaurantLocationModalProps) {
    if (!restaurant) return null;

    const searchQuery = [restaurant.name, restaurant.address, restaurant.locality, restaurant.region]
        .filter(Boolean)
        .join(', ');
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{restaurant.name}</DialogTitle>
                </DialogHeader>

                {(restaurant.address || restaurant.locality) && (
                    <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="mt-0.5 size-4 shrink-0" />
                        <span>
                            {[restaurant.address, restaurant.locality, restaurant.region]
                                .filter(Boolean)
                                .join(', ')}
                        </span>
                    </p>
                )}

                <div className="mt-2 flex flex-col gap-3">
                    <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: 'default' }), 'w-full justify-start gap-2')}
                    >
                        <ExternalLink className="size-4" />
                        Open in Google Maps
                    </a>
                </div>
            </DialogContent>
        </Dialog>
    );
}
