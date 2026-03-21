"use client"

import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import { RestaurantResult } from '@/types/restaurant';
import { BookmarkedRestaurant } from '@/types/search';

const STORAGE_KEY = 'saankain_bookmarks';
const MAX_BOOKMARKS = 20;

function readFromStorage(): BookmarkedRestaurant[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? (JSON.parse(stored) as BookmarkedRestaurant[]) : [];
    } catch {
        return [];
    }
}

function writeToStorage(entries: BookmarkedRestaurant[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
    }
}

export default function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<BookmarkedRestaurant[]>([]);

    useEffect(() => {
        try {
            setBookmarks(readFromStorage());
        } catch {
        }
    }, []);

    const isBookmarked = useCallback(
        (fsqId: string): boolean => bookmarks.some((entry) => entry.fsqId === fsqId),
        [bookmarks]
    );

    const addBookmark = useCallback((item: RestaurantResult) => {
        setBookmarks((prev) => {
            if (prev.some((entry) => entry.fsqId === item.fsqId)) return prev;
            if (prev.length >= MAX_BOOKMARKS) return prev; // max reached — no-op
            const updated: BookmarkedRestaurant[] = [
                {
                    fsqId: item.fsqId,
                    name: item.name,
                    address: item.address ?? null,
                    locality: item.locality ?? null,
                    region: item.region ?? null,
                    category: item.category ?? null,
                    savedAt: new Date().toISOString(),
                },
                ...prev,
            ];
            writeToStorage(updated);
            return updated;
        });
    }, []);

    const removeBookmark = useCallback((fsqId: string) => {
        setBookmarks((prev) => {
            const updated = prev.filter((entry) => entry.fsqId !== fsqId);
            writeToStorage(updated);
            return updated;
        });
    }, []);

    const toggleBookmark = useCallback(
        (item: RestaurantResult) => {
            if (bookmarks.some((entry) => entry.fsqId === item.fsqId)) {
                removeBookmark(item.fsqId);
            } else {
                addBookmark(item);
            }
        },
        [bookmarks, addBookmark, removeBookmark]
    );

    const clearBookmarks = useCallback(() => {
        writeToStorage([]);
        setBookmarks([]);
    }, []);

    return { bookmarks, isBookmarked, addBookmark, removeBookmark, toggleBookmark, clearBookmarks };
}
