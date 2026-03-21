import type { Metadata } from 'next';

import LandingClient from './LandingClient';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SaanKain — Find restaurants near you',
    description: 'Type natural-language queries like "cheap sushi near makati open now" to discover restaurants.',
    openGraph: {
      title: 'SaanKain — Find restaurants near makati open now',
      description: 'Type natural-language queries like "cheap sushi near makati open now" to discover restaurants.',
      images: ['/app-logo/og.png'],
    },
  };
}

export default function LandingPage() {
  return <LandingClient />;
}
