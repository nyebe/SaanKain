"use client"

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function InteractiveSamples() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function startLoading() {
        setError(null);
        setLoading(true);
        setTimeout(() => setLoading(false), 1400);
    }

    function triggerError() {
        setLoading(false);
        setError('May problema. Subukan ulit.');
    }

    return (
        <div className="mt-6 space-y-4">
            {/* Hover demo */}
            <div>
                <p className="text-sm font-semibold">Hover demo</p>
                <div className="mt-3">
                    <Card className="transition-transform hover:-translate-y-1 hover:shadow-lg cursor-pointer max-w-md">
                        <div className="px-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold">Kanto Grill</p>
                                    <p className="text-xs text-muted-foreground">Local · Sampaloc</p>
                                </div>
                                <div className="text-xs text-muted-foreground">0.4 km</div>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">Small, interactive card that lifts on hover — gentle feedback for exploration.</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Loading demo */}
            <div>
                <p className="text-sm font-semibold">Loading (skeleton) demo</p>
                <div className="mt-3 flex items-center gap-3">
                    <Button onClick={startLoading} disabled={loading}>Start fetch</Button>
                    <Button variant="ghost" onClick={() => { setLoading(false); setError(null); }}>Reset</Button>
                </div>

                <div className="mt-3">
                    {loading ? (
                        <div className="space-y-2 max-w-md">
                            <div className="h-6 w-3/4 bg-muted/30 animate-pulse rounded" />
                            <div className="h-4 w-1/2 bg-muted/30 animate-pulse rounded" />
                            <div className="h-10 bg-muted/30 animate-pulse rounded" />
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">No active fetch. Click "Start fetch" to see skeletons.</div>
                    )}
                </div>
            </div>

            {/* Error demo */}
            <div>
                <p className="text-sm font-semibold">Error sample</p>
                <div className="mt-3 max-w-md">
                    <Card className="p-4">
                        <div>
                            <p className="font-semibold">Ay, may nangyari</p>
                            <p className="mt-1 text-xs text-muted-foreground">{error ?? 'Everything seems fine.'}</p>

                            <div className="mt-3 flex gap-2">
                                <Button onClick={() => { startLoading(); setTimeout(triggerError, 800); }}>Simulate error</Button>
                                <Button variant="ghost" onClick={() => { setError(null); }}>Dismiss</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
