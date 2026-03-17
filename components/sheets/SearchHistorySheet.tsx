"use client"

import {
    ClockIcon,
    Trash2Icon,
    XIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { SearchHistorySheetProps } from '@/types/ui';

function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

export default function SearchHistorySheet({
    history,
    onSelect,
    onRemove,
    onClear,
}: SearchHistorySheetProps) {
    return (
        <Sheet>
            <SheetTrigger
                render={
                    <Button variant="outline" size="icon" title="Search history" />
                }
            >
                <ClockIcon className="size-4" />
                <span className="sr-only">Search history</span>
            </SheetTrigger>

            <SheetContent side="left" showCloseButton={false} className="p-0 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <span className="font-semibold text-sm">Search History</span>
                    <div className="flex items-center gap-1">
                        {history.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClear}
                                className="text-muted-foreground text-xs"
                            >
                                Clear all
                            </Button>
                        )}
                        <SheetClose
                            render={<Button variant="ghost" size="icon-sm" />}
                        >
                            <XIcon className="size-4" />
                            <span className="sr-only">Close</span>
                        </SheetClose>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground p-6 text-center">
                            <ClockIcon className="size-8 opacity-30" />
                            <p className="text-sm">Wala pang history.<br />Mag-search ka muna!</p>
                        </div>
                    ) : (
                        <ul className="divide-y">
                            {history.map((entry) => (
                                <li
                                    key={entry.usedAt + entry.query}
                                    className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 group"
                                >
                                    <SheetClose
                                        render={<button className="flex-1 text-left min-w-0" />}
                                        onClick={() => onSelect(entry.query)}
                                    >
                                        <p className="text-sm font-medium truncate leading-snug">
                                            {entry.query}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {formatDate(entry.usedAt)}
                                        </p>
                                    </SheetClose>

                                    <button
                                        onClick={() => onRemove(entry.query)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive mt-0.5 flex-shrink-0"
                                        title="Remove"
                                    >
                                        <Trash2Icon className="size-4" />
                                        <span className="sr-only">Remove</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
