import './globals.css';

import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
} from 'next/font/google';

import Footer from '@/components/layout/Footer';
import NavBar from '@/components/layout/NavBar';
import PageContainer from '@/components/layout/PageContainer';
import Providers from '@/providers/providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaanKain — Natural Language Restaurant Finder",
  description:
    "SaanKain is a Filipino-inspired natural-language restaurant discovery app. Users can search for places to eat using conversational queries like 'cheap sushi near makati open now'. Built with Next.js, TypeScript, and the Foursquare Places API.",
  applicationName: "SaanKain",
  authors: [
    {
      name: "Nyebe Creations",
    },
  ],
  keywords: [
    "restaurant finder",
    "natural language search",
    "food discovery",
    "Next.js project",
    "Foursquare API",
    "SaanKain",
    "Filipino food discovery",
  ],
  creator: "Nyebe Creations",
  metadataBase: new URL("https://saan-kain.vercel.app"),
  openGraph: {
    title: "SaanKain — Natural Language Restaurant Finder",
    description:
      "Search restaurants using natural language. Example: 'cheap sushi near makati open now'. Built with Next.js and Foursquare Places API.",
    siteName: "SaanKain",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <NavBar />

            <PageContainer>
              {children}
            </PageContainer>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
