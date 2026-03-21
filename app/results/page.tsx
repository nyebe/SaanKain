import { Suspense } from 'react';

import { Metadata } from 'next';

import ResultsClient from './ResultsClient';

export const revalidate = 3600;

export async function generateMetadata({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }): Promise<Metadata> {
    const message = Array.isArray(searchParams?.message) ? searchParams?.message[0] : searchParams?.message;
    const title = message ? `${message} — Results | SaanKain` : 'Results | SaanKain';
    return {
        title,
        description: 'Search restaurants using natural language — SaanKain results.',
    } as Metadata;
}

export default function ResultsPage() {
    return (
        <Suspense
            fallback={
                <main className="p-6">
                    <div className="mx-auto max-w-3xl">Loading results...</div>
                </main>
            }
        >
            <ResultsClient />
        </Suspense>
    );
}
