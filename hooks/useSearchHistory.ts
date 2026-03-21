"use client"

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { SearchHistoryEntry } from '@/types/search';

const STORAGE_KEY = 'saankain_search_history';
const MAX_ENTRIES = 50;

function readFromStorage(): SearchHistoryEntry[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? (JSON.parse(stored) as SearchHistoryEntry[]) : [];
    } catch {
        return [];
    }
}

function writeToStorage(entries: SearchHistoryEntry[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
        // storage may be full or unavailable — fail silently
    }
}

export default function useSearchHistory() {
    const [history, setHistory] = useState<SearchHistoryEntry[]>([]);

    useEffect(() => {
        try {
            const stored = readFromStorage();
            setHistory(stored);
        } catch {
        }
    }, []);

    const addEntry = useCallback((query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        setHistory((prev) => {
            const deduped = prev.filter(
                (entry) => entry.query.toLowerCase() !== trimmed.toLowerCase()
            );
            const updated: SearchHistoryEntry[] = [
                { query: trimmed, usedAt: new Date().toISOString() },
                ...deduped,
            ].slice(0, MAX_ENTRIES);

            writeToStorage(updated);
            return updated;
        });
    }, []);

    const removeEntry = useCallback((query: string) => {
        setHistory((prev) => {
            const updated = prev.filter((entry) => entry.query !== query);
            writeToStorage(updated);
            return updated;
        });
    }, []);

    const clearHistory = useCallback(() => {
        writeToStorage([]);
        setHistory([]);
    }, []);

    return { history, addEntry, removeEntry, clearHistory };
}
