import { Suspense } from 'react';

import ResultsClient from './ResultsClient';

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
