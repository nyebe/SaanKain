"use client"

import { useState } from 'react';

import ViewModeToggle from '@/components/buttonGroup/ViewModeToggle';
import SearchForm from '@/components/forms/SearchForm';
import ErrorState from '@/components/states/ErrorState';
import LoadingState from '@/components/states/LoadingState';
import ResultsList from '@/components/views/ResultsList';
import { ViewMode } from '@/types/ui';

import useResults from './useResults';

export default function ResultsClient() {
    const { message, setMessage, loading, errorMessage, results, handleSubmit } = useResults();
    const [view, setView] = useState<ViewMode>('list');

    return (
        <main className="p-6">
            <div className="mx-auto max-w-3xl">
                <SearchForm
                    message={message}
                    onChange={setMessage}
                    onSubmit={handleSubmit}
                    disabled={loading}
                />

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
