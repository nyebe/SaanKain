"use client"

import { useState } from 'react';

import Link from 'next/link';

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTrigger,
} from '@/components/ui/sheet';
import ThemeToggle from '@/components/ui/ThemeToggle';

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
                            <Link href="/moodboard" className="hover:underline">Moodboard</Link>
                        </div>
                    </div>

                    <div className="sm:hidden">
                        <Sheet>
                            <SheetTrigger>
                                <p
                                    aria-label="Open menu"
                                    className="p-2 rounded-md bg-white/3"
                                >
                                    Menu
                                </p>
                            </SheetTrigger>

                            <SheetContent side="bottom">
                                <SheetHeader>
                                    <div className="flex items-center justify-between w-full">
                                        <Link href="/" className="text-lg font-semibold">SaanKain 🍜</Link>
                                        <SheetClose>
                                            <button className="p-2">Close</button>
                                        </SheetClose>
                                    </div>
                                </SheetHeader>

                                <div className="py-4 flex flex-col gap-3">
                                    <Link href="/results" className="block">Results</Link>
                                    <Link href="/about" className="block">About</Link>
                                    <Link href="/moodboard" className="block">Moodboard</Link>
                                </div>

                                <SheetFooter>
                                    <div className="flex items-center justify-between w-full">
                                        <ThemeToggle />
                                        <Link href="/" className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm">Search</Link>
                                    </div>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                        <ThemeToggle />
                        <Link href="/" className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm">Search</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
