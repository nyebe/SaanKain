import ResultGalleryCard from '@/components/cards/ResultGalleryCard';
import ResultListCard from '@/components/cards/ResultListCard';
import SectionCard from '@/components/cards/SectionCard';
import DocHeader from '@/components/layout/DocHeader';
import { ColorSwatch } from '@/types/ui';

import InteractiveSamples from './InteractiveSamples';
import useMoodboardPage from './useMoodboardPage';

function ColorSwatchCard({ swatch }: { swatch: ColorSwatch }) {
    return (
        <div className="rounded-xl overflow-hidden border border-white/10 shadow-sm">
            <div className={`${swatch.bgClass} h-28 w-full`} />
            <div className="bg-white/5 p-4 space-y-1">
                <p className="font-semibold text-sm">{swatch.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{swatch.hex}</p>
                <p className="text-xs text-muted-foreground leading-snug">{swatch.description}</p>
            </div>
        </div>
    );
}

export default function MoodboardPage() {
    const { colorPalette } = useMoodboardPage();

    return (
        <main className="p-6">
            <div className="mx-auto max-w-5xl space-y-8">
                <DocHeader
                    title="SaanKain — Design Moodboard"
                    description="The visual language, tone, and design decisions behind the SaanKain experience."
                    author="Nyebe Creations"
                    lastModified="2026-03-17"
                />

                {/* 1. Design Vision */}
                <SectionCard>
                    <h2 className="text-xl font-bold">🗺️ Design Vision</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        SaanKain is built for the <strong className="text-foreground">curious explorer</strong> — the tourist who lands in Manila
                        with an empty stomach, or the local who wants to discover something new sa kapitbahay nila.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        The UI should feel like flipping through a <strong className="text-foreground">travel guide</strong> — warm, inviting, and
                        full of personality. Not a sterile delivery app. Not a spreadsheet of restaurants. A digital pasyal.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Every screen should answer one question: <strong className="text-foreground">"Saan ba tayo kakain?"</strong> — and make
                        the answer feel exciting.
                    </p>
                </SectionCard>

                {/* 2. Color Inspiration */}
                <SectionCard>
                    <h2 className="text-xl font-bold">🎨 Color Inspiration</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        The palette is drawn from <strong className="text-foreground">Filipino street food culture</strong> and the iconic
                        jeepney color traditions — vibrant, layered, and unapologetically local. Think calamansi sa fishball stalls,
                        ripe mangga sa palengke, and the red flames painted across jeepney hoods.
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                        {colorPalette.map((swatch) => (
                            <ColorSwatchCard key={swatch.hex} swatch={swatch} />
                        ))}
                    </div>
                </SectionCard>

                {/* 3. UI Inspiration */}
                <SectionCard>
                    <h2 className="text-xl font-bold">📍 UI Inspiration</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        SaanKain draws from the best of <strong className="text-foreground">travel discovery apps</strong> — Yelp's
                        review-forward cards, Google Maps' location-anchored browsing, and the wandering spirit of a Lonely Planet page.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        The focus is <strong className="text-foreground">exploration over transaction</strong>. We are not a delivery app.
                        There are no checkout flows, no rush. Just the joy of finding the right place to eat — wherever you are.
                    </p>
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {[
                            { label: 'Yelp', note: 'Review cards, photo-forward results, trust signals' },
                            { label: 'Google Maps', note: 'Location-anchored, open now filters, category chips' },
                            { label: 'Foursquare', note: 'Taste profiles, neighborhood context, discovery mode' },
                        ].map((inspiration) => (
                            <div
                                key={inspiration.label}
                                className="rounded-lg border border-white/10 bg-white/5 p-4"
                            >
                                <p className="font-semibold text-sm">{inspiration.label}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{inspiration.note}</p>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* 4. Typography */}
                <SectionCard>
                    <h2 className="text-xl font-bold">🔤 Typography</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        The UI uses a <strong className="text-foreground">friendly rounded font system</strong> — prioritizing legibility and
                        warmth over formality. Taglish text and mixed-language labels must be comfortable to read across screen sizes.
                    </p>
                    <div className="mt-6 space-y-4">
                        <div className="border-b border-white/10 pb-4">
                            <p className="text-3xl font-bold tracking-tight">Saan tayo kakain?</p>
                            <p className="mt-1 text-xs text-muted-foreground font-mono">text-3xl · font-bold · Heading</p>
                        </div>
                        <div className="border-b border-white/10 pb-4">
                            <p className="text-xl font-semibold">Cheap sushi near Makati, open now</p>
                            <p className="mt-1 text-xs text-muted-foreground font-mono">text-xl · font-semibold · Subheading</p>
                        </div>
                        <div className="border-b border-white/10 pb-4">
                            <p className="text-sm leading-relaxed">
                                A cozy Japanese restaurant in the heart of Makati. Affordable lunch sets, fresh salmon rolls, and the best
                                miso soup this side of Ayala.
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground font-mono">text-sm · leading-relaxed · Body</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Open now · ⭐ 4.7 · 0.3 km away</p>
                            <p className="mt-1 text-xs text-muted-foreground font-mono">text-xs · text-muted-foreground · Caption</p>
                        </div>
                    </div>
                </SectionCard>

                {/* 5. Card Design */}
                <SectionCard>
                    <h2 className="text-xl font-bold">🍽️ Card Design</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Restaurants are presented as <strong className="text-foreground">travel-style destination cards</strong> — not compact
                        list rows. Each card gives the user enough context to feel confident before clicking: name, cuisine, price signal,
                        distance, open status, and a short editorial vibe.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Cards use generous padding, rounded corners, and subtle borders to create a sense of depth — like a stack of
                        place cards you'd find at a tourism booth. Hover states lift the card slightly to signal interactivity.
                    </p>
                    <div className="mt-6">
                        <ResultListCard item={{
                            fsq_place_id: 'example-1',
                            name: 'Yabu: House of Katsu',
                            location: { address: 'BGC', locality: 'Taguig', region: 'Metro Manila' },
                            categories: [{ name: 'Japanese' }],
                            distance: 800,
                            date_closed: null,
                        }} />
                        <p className="mt-3 text-xs text-muted-foreground italic">↑ Example destination card — travel guide, not delivery list.</p>
                    </div>
                    <div className="mt-6">
                        <ResultGalleryCard item={{
                            fsq_place_id: 'example-1',
                            name: 'Yabu: House of Katsu',
                            location: { address: 'BGC', locality: 'Taguig', region: 'Metro Manila' },
                            categories: [{ name: 'Japanese' }],
                            distance: 800,
                            date_closed: null,
                        }} />
                        <p className="mt-3 text-xs text-muted-foreground italic">↑ Example destination card — travel guide, not delivery list.</p>
                    </div>

                </SectionCard>

                {/* 6. Interaction Design */}
                <SectionCard>
                    <h2 className="text-xl font-bold">✨ Interaction Design</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Animations are <strong className="text-foreground">subtle and playful</strong> — never flashy, never in the way. They
                        exist to acknowledge the user, not to entertain them.
                    </p>
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {[
                            {
                                label: 'Hover Feedback',
                                detail: 'Cards lift slightly on hover with a gentle shadow transition. Links and buttons respond with color shifts — not jarring flashes.',
                            },
                            {
                                label: 'Loading States',
                                detail: 'Skeleton loaders replace cards during fetch. A pulsing animation keeps the layout stable — walang biglang jumps sa layout.',
                            },
                            {
                                label: 'Error States',
                                detail: 'Friendly error messages with a retry affordance. The tone stays warm — "something went wrong, try again" — hindi robot ang dating.',
                            },
                        ].map((principle) => (
                            <div
                                key={principle.label}
                                className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2"
                            >
                                <p className="font-semibold text-sm">{principle.label}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{principle.detail}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                        The overall interaction feel should mirror that moment when a friendly local gives you a restaurant tip —
                        <strong className="text-foreground"> confident, warm, and instantly useful</strong>. Doon tayo.
                    </p>

                    <div className="mt-6">
                        <InteractiveSamples />
                    </div>
                </SectionCard>
            </div>
        </main>
    );
}
