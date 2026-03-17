"use client"

import {
    HeartIcon,
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
import { BookmarksSheetProps } from '@/types/ui';

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

export default function BookmarksSheet({
    bookmarks,
    onSelect,
    onRemove,
    onClear,
}: BookmarksSheetProps) {
    return (
        <Sheet>
            <SheetTrigger
                render={
                    <Button variant="outline" size="icon" title="Saved restaurants" />
                }
            >
                <HeartIcon className="size-4" />
                <span className="sr-only">Saved restaurants</span>
            </SheetTrigger>

            <SheetContent side="left" showCloseButton={false} className="p-0 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Saved</span>
                        {bookmarks.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                                {bookmarks.length}/20
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {bookmarks.length > 0 && (
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
                    {bookmarks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground p-6 text-center">
                            <HeartIcon className="size-8 opacity-30" />
                            <p className="text-sm">Wala pang saved.<br />I-heart ang gusto mo!</p>
                        </div>
                    ) : (
                        <ul className="divide-y">
                            {bookmarks.map((entry) => (
                                <li
                                    key={entry.fsqId}
                                    className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 group"
                                >
                                    <SheetClose
                                        render={<button className="flex-1 text-left min-w-0" />}
                                        onClick={() => onSelect(entry)}
                                    >
                                        <p className="text-sm font-medium truncate leading-snug">
                                            {entry.name}
                                        </p>
                                        {entry.category && (
                                            <p className="text-xs text-muted-foreground truncate">
                                                {entry.category}
                                            </p>
                                        )}
                                        {(entry.address || entry.locality) && (
                                            <p className="text-xs text-muted-foreground truncate">
                                                {[entry.address, entry.locality].filter(Boolean).join(', ')}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Saved {formatDate(entry.savedAt)}
                                        </p>
                                    </SheetClose>

                                    <button
                                        onClick={() => onRemove(entry.fsqId)}
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
