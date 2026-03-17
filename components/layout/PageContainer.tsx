"use client"

import { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

export default function PageContainer({ children }: { children: ReactNode }) {
    const pathname = usePathname() || '/';
    const isLanding = pathname === '/';

    const className = isLanding ? 'flex-1 min-h-0 flex' : 'flex-1 overflow-auto min-h-0';

    return <div className={className}>{children}</div>;
}
