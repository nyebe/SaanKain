import { ReactNode } from 'react';

export default function SignalBadge({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2 px-2 py-1 text-xs rounded-md bg-white/5 border border-white/6">
            <svg className="w-3 h-3 text-muted-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {children}
        </span>
    )
}
