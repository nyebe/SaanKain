import type { Metadata } from 'next';

import AboutClient from './AboutClient';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'About — SaanKain',
        description: 'About SaanKain — natural-language restaurant discovery prototype.',
        openGraph: {
            title: 'About — SaanKain',
            description: 'About SaanKain — natural-language restaurant discovery prototype.',
            images: ['/app-logo/512x512.png'],
        },
    };
}

export default function AboutPage() {
    return <AboutClient />;
}
