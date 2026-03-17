import React from 'react';

import { DocHeaderProps } from '@/types/ui';

export default function DocHeader({ title, description, author, lastModified }: DocHeaderProps) {
    return (
        <header className="mb-6 bg-white/5 p-4 rounded-md">
            <div className="mx-auto max-w-5xl">
                <h1 className="text-2xl font-bold">{title}</h1>
                {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
                {(author || lastModified) && (
                    <div className="mt-2 text-xs text-muted-foreground flex gap-4">
                        {author && <span>By {author}</span>}
                        {lastModified && <span>Last updated {lastModified}</span>}
                    </div>
                )}
            </div>
        </header>
    )
}
