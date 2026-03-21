"use client"

import { MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { LocationToggleProps } from '@/types/ui';

export default function LocationToggle({ useLocation, resolving, onToggle }: LocationToggleProps) {
    return (
        <div className="inline-flex items-center" data-slot="button-group">
            <Button
                type="button"
                variant={useLocation ? 'default' : 'outline'}
                size="icon"
                onClick={onToggle}
                disabled={resolving}
                title={useLocation ? 'Location active — click to disable' : 'Use my location'}
                aria-label="Toggle location search"
            >
                {resolving ? <Spinner className="size-4" /> : <MapPin className="size-4" />}
            </Button>
        </div>
    );
}
