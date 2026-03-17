"use client"

import { useState } from 'react';

import Link from 'next/link';

import ThemeToggle from './ThemeToggle';

export default function NavBar() {
    const [open, setOpen] = useState(false)

    return (
        <nav className="w-full bg-white/5 border-b border-white/5">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-lg font-semibold">SaanKain 🍜</Link>
                        <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
                            <Link href="/results" className="hover:underline">Results</Link>
                            <Link href="/about" className="hover:underline">About</Link>
                            <Link href="/mood" className="hover:underline">Moodboard</Link>
                        </div>
                    </div>

                    <div className="sm:hidden">
                        <button
                            aria-label="Toggle menu"
                            onClick={() => setOpen(!open)}
                            className="p-2 rounded-md bg-white/3"
                        >
                            {open ? 'Close' : 'Menu'}
                        </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                        <ThemeToggle />
                        <Link href="/" className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm">Search</Link>
                    </div>
                </div>

                {open && (
                    <div className="sm:hidden py-2 flex flex-col gap-2">
                        <Link href="/results" className="block">Results</Link>
                        <Link href="/about" className="block">About</Link>
                        <Link href="/mood" className="block">Moodboard</Link>
                    </div>
                )}
            </div>
        </nav>
    )
}
