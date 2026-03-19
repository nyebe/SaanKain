import SignalBadge from '@/components/badges/SignalBadge';
import SectionCard from '@/components/cards/SectionCard';
import TechnologyCard from '@/components/cards/TechnologyCard';
import DocHeader from '@/components/layout/DocHeader';
import StepFlow from '@/components/views/StepFlow';

export default function AboutPage() {
    return (
        <main className="p-6">
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
                </div>
            </div>
        </main>
    )
}
