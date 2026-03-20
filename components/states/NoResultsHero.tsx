"use client"

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Props = {
    message?: string;
};

const suggestions = [
    'sushi near makati',
    'ramen near bgc',
    'bbq near quezon city',
    'best pizza near me',
];

export default function NoResultsHero({ message }: Props) {
    const router = useRouter();

    function go(q: string) {
        router.push(`/results?message=${encodeURIComponent(q)}`);
    }

    return (
        <div className="py-12">
            <div className="mx-auto max-w-3xl text-center">
                <motion.div
                    className="mx-auto h-40 w-40 relative"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Image src="/app-logo/512x512.png" alt="SaanKain" fill />
                </motion.div>

                <motion.h3 className="mt-6 text-lg font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {message ? 'No results found' : 'Start a search to find places to eat'}
                </motion.h3>

                <p className="mt-2 text-sm text-muted-foreground">
                    {message ? 'Try these alternatives or refine your query.' : 'Try one of these example searches:'}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {suggestions.map((s) => (
                        <button
                            key={s}
                            onClick={() => go(s)}
                            className="px-3 py-1 rounded-full border border-border bg-card/70 text-sm hover:scale-105 transition-transform"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
