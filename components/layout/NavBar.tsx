"use client"

import { useState } from 'react';

import Image from 'next/image';
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
    const navItems = [
        { href: '/results', label: 'Results' },
        { href: '/about', label: 'About' },
        { href: '/moodboard', label: 'Moodboard' },
    ]

    return (
        <nav className="w-full bg-white/5 border-b border-white/5">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-3">
                            <Image src="/app-logo/192x192.png" alt="SaanKain" width={36} height={36} className="rounded" />
                            <span className="text-lg font-semibold">SaanKain</span>
                        </Link>
                        <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
                            {navItems.map((n) => (
                                <Link key={n.href} href={n.href} className="hover:underline">{n.label}</Link>
                            ))}
                        </div>
                    </div>

                    <div className="sm:hidden">
                        <Sheet>
                            <SheetTrigger>
                                <p
                                    aria-label="Open menu"
                                    className="p-2"
                                >
                                    🥢
                                    Menu
                                </p>
                            </SheetTrigger>

                            <SheetContent side="right">
                                <SheetHeader>
                                    <div className="flex items-center justify-between w-full">
                                        <Link href="/" className="text-lg font-semibold flex items-center gap-2">
                                            <Image src="/app-logo/192x192.png" alt="SaanKain" width={36} height={36} className="rounded" />
                                            <span className="text-lg font-semibold">SaanKain</span>
                                        </Link>
                                        <SheetClose />
                                    </div>
                                </SheetHeader>

                                <div className="pl-4 flex flex-col gap-3">
                                    {navItems.map((n) => (
                                        <SheetClose key={n.href}>
                                            <Link href={n.href} className="block">{n.label}</Link>
                                        </SheetClose>
                                    ))}
                                </div>

                                <SheetFooter>
                                    <div className="flex items-center justify-between w-full">
                                        <ThemeToggle />
                                        <SheetClose>
                                            <Link href="/" className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm">Search</Link>
                                        </SheetClose>
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
