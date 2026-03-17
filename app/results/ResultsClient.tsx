"use client"

import { useState } from 'react';

import ViewModeToggle from '@/components/buttonGroup/ViewModeToggle';
import SearchForm from '@/components/forms/SearchForm';
import SearchHistorySheet from '@/components/sheets/SearchHistorySheet';
import ErrorState from '@/components/states/ErrorState';
import LoadingState from '@/components/states/LoadingState';
import ResultsList from '@/components/views/ResultsList';
import { ViewMode } from '@/types/ui';

import useResults from './useResults';

export default function ResultsClient() {
    const {
        message,
        setMessage,
        loading,
        errorMessage,
        results,
        handleSubmit,
        history,
        removeEntry,
        clearHistory,
        selectHistoryEntry,
    } = useResults();
    const [view, setView] = useState<ViewMode>('list');

    return (
        <main className="p-6">
            <div className="mx-auto max-w-3xl">
                <div className="flex items-start gap-2">
                    <SearchHistorySheet
                        history={history}
                        onSelect={selectHistoryEntry}
                        onRemove={removeEntry}
                        onClear={clearHistory}
                    />
                    <div className="flex-1">
                        <SearchForm
                            message={message}
                            onChange={setMessage}
                            onSubmit={handleSubmit}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div />
                        <ViewModeToggle view={view} onChange={setView} />
                    </div>

                    {loading && <LoadingState />}
                    {errorMessage && <ErrorState message={errorMessage} />}
                    {!loading && !errorMessage && <ResultsList results={results} view={view} />}
                </div>
            </div>
        </main>
    );
}
