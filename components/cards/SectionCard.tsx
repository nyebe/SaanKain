import { ReactNode } from 'react';

export default function SectionCard({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bg-white/3 border border-white/6 rounded-lg p-4 sm:p-6 ${className ?? ''}`}>
            {children}
        </div>
    )
}
