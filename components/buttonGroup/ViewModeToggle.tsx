"use client"

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ViewModeToggleProps } from '@/types/ui';

export default function ViewModeToggle({ view, onChange, className }: ViewModeToggleProps) {
    return (
        <div className={cn("inline-flex items-center gap-2", className)} data-slot="button-group">
            <Button
                variant={view === "list" ? "default" : "ghost"}
                size="icon"
                aria-pressed={view === "list"}
                onClick={() => onChange("list")}
                title="List view"
                data-icon="inline-start"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <rect x="3" y="5" width="18" height="2" rx="1" fill="currentColor" />
                    <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" />
                    <rect x="3" y="17" width="18" height="2" rx="1" fill="currentColor" />
                </svg>
            </Button>

            <Button
                variant={view === "gallery" ? "default" : "ghost"}
                size="icon"
                aria-pressed={view === "gallery"}
                onClick={() => onChange("gallery")}
                title="Gallery view"
                data-icon="inline-start"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" />
                    <rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor" />
                    <rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor" />
                    <rect x="13" y="13" width="8" height="8" rx="1" fill="currentColor" />
                </svg>
            </Button>
        </div>
    )
}
