import Link from 'next/link';

import DocHeader from '@/components/ui/DocHeader';
import SectionCard from '@/components/cards/SectionCard';
import StepFlow from '@/components/views/StepFlow';
import SignalBadge from '@/components/badges/SignalBadge';
import TechnologyCard from '@/components/cards/TechnologyCard';

export default function AboutPage() {
    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-5xl">
                <DocHeader
                    title="About SaanKain"
                    description="A playful, Filipino-inspired natural-language restaurant discovery prototype."
                    author="Nyebe Creations"
                    lastModified="2026-03-17"
                />

                <div className="mt-6 space-y-6">
                    <SectionCard>
                        <h2 className="text-xl font-semibold">Project Introduction</h2>
                        <p className="mt-2 text-sm leading-relaxed">
                            Ever asked yourself: "Saan ba tayo kakain?" SaanKain lets users type that exact question — or anything
                            similar — using natural language. Example: <strong>"cheap sushi near makati open now"</strong>. The app
                            interprets the message, searches places, ranks results, and presents them in a clean, mobile-first UI.
                        </p>
                    </SectionCard>

                    <SectionCard>
                        <h2 className="text-xl font-semibold">How It Works</h2>
                        <p className="mt-2 text-sm text-muted-foreground">High-level pipeline:</p>
                        <div className="mt-4">
                            <StepFlow steps={["User Query", "Parser", "Foursquare API", "Ranking Engine", "Results UI"]} />
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <h2 className="text-xl font-semibold">Natural Language Parsing</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            The parser turns casual text into structured parameters such as <em>cuisine</em>, <em>priceLevel</em>,
                            <em>location</em>, and <em>openNow</em>. It's rule-based and deterministic so behavior is easy to explain.
                        </p>

                        <div className="mt-4">
                            <div className="bg-gray-900 text-white p-4 rounded-md font-mono text-sm">
{`{
  cuisine: "sushi",
  priceLevel: 1,
  location: "makati",
  openNow: true
}`}
                            </div>
                        </div>

                        <p className="mt-3 text-sm text-muted-foreground">
                            Implementation note: the parser currently uses concise rules and regular expressions. This keeps tests
                            reliable and interview-friendly. Future improvements could introduce LLM assistance for ambiguous queries.
                        </p>
                    </SectionCard>

                    <SectionCard>
                        <h2 className="text-xl font-semibold">Ranking System</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Results are ranked by a deterministic scoring function combining signals:</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <SignalBadge>Cuisine match</SignalBadge>
                            <SignalBadge>Price match</SignalBadge>
                            <SignalBadge>Open status</SignalBadge>
                            <SignalBadge>Rating</SignalBadge>
                            <SignalBadge>Distance</SignalBadge>
                        </div>

                        <p className="mt-3 text-sm text-muted-foreground">The scoring is deliberately simple and explainable for review and testing.</p>
                    </SectionCard>

                    <SectionCard>
                        <h2 className="text-xl font-semibold">Technology Stack</h2>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <TechnologyCard title="Frontend" items={["Next.js", "React", "TypeScript", "TailwindCSS", "shadcn/ui"]} />
                            <TechnologyCard title="Backend" items={["Next.js API", "Node.js", "TypeScript"]} />
                            <TechnologyCard title="Integration" items={["Foursquare Places API"]} />
                            <TechnologyCard title="Testing" items={["Vitest", "Playwright"]} />
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <h2 className="text-xl font-semibold">Why This Project Exists</h2>
                        <p className="mt-2 text-sm text-muted-foreground">The goal is to demonstrate product thinking, clean architecture, and testable systems. It's designed to be interview-friendly — small, focused, and explainable while still showing end-to-end engineering decisions.</p>
                    </SectionCard>

                    <SectionCard>
                        <h2 className="text-xl font-semibold">Future Improvements</h2>
                        <ul className="mt-2 list-disc pl-5 text-sm">
                            <li>LLM-assisted query interpretation to handle ambiguity</li>
                            <li>Better geolocation and reverse-geocoding for accuracy</li>
                            <li>User preference learning and personalization</li>
                            <li>Map views and directions</li>
                            <li>Richer cuisine detection with synonyms and aliases</li>
                        </ul>
                    </SectionCard>

                    <SectionCard>
                        <h2 className="text-xl font-semibold">Developer Notes</h2>
                        <p className="mt-2 text-sm text-muted-foreground">The repository follows a strict separation of concerns:</p>
                        <ul className="mt-2 list-disc pl-5 text-sm">
                            <li>UI — <code>components/</code></li>
                            <li>Hooks (logic) — <code>hooks/</code> and page colocated hooks</li>
                            <li>Services (data) — <code>services/</code></li>
                            <li>API — <code>app/api/</code> routes</li>
                            <li>Core modules — <code>lib/parser</code>, <code>lib/ranking</code>, <code>lib/foursquare</code></li>
                        </ul>
                    </SectionCard>

                    <div className="mt-6 prose prose-sm mb-12">
                        <h2 className="text-lg font-semibold">Closing</h2>
                        <p>
                            SaanKain is a small experiment combining Filipino culture, food discovery, and engineering curiosity. If
                            you want to dig deeper, open the <Link href="/docs/design-architecture.md">design architecture</Link>.
                        </p>
                        <p className="mt-4 text-sm">Salamat! — Nyebe Creations</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
