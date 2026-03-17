import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full border-t border-white/5 bg-transparent mt-8">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Nyebe Creations</div>
                    <div className="flex gap-4 text-sm">
                        <Link href="/about" className="hover:underline">About</Link>
                        <Link href="/moodboard" className="hover:underline">Moodboard</Link>
                        <a href="/docs/design-architecture.md" className="hover:underline">Design</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
