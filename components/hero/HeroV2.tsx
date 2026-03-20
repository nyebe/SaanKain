import Image from 'next/image';
import Link from 'next/link';
import {
    AiFillGithub,
    AiFillLinkedin,
} from 'react-icons/ai';

import { Button } from '@/components/ui/button';

type HeroV2Props = {
    title?: string
    subtitle?: string
    logoSrc?: string
}

export default function HeroV2({
    title = 'SaanKain',
    subtitle = 'A playful, Filipino-inspired natural-language restaurant discovery prototype.',
    logoSrc = '/app-logo/512x512.png',
}: HeroV2Props) {
    return (
        <section className="pt-8">
            <div className="mx-auto max-w-6xl">
                <div className="relative overflow-visible">
                    <div className="relative z-10 flex flex-col items-center text-center gap-4 px-6 py-8">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl">
                            {title}
                        </h1>

                        <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-3xl">
                            {subtitle}
                        </p>

                        <div className="mt-8 flex flex-col items-center gap-6">
                            <div className="relative">
                                <Link href="/" className="inline-block">
                                    <Button>Try a demo search</Button>
                                </Link>
                                <div className="pointer-events-none absolute -inset-1 rounded-lg blur-xl opacity-30" />
                            </div>

                            <div className="relative">
                                <div className="absolute -translate-y-2/4 left-1/2 top-1/2 -z-10 -translate-x-1/2 pointer-events-none flex items-center justify-center">
                                    <div className="rounded-full bg-linear-to-r from-white/60 via-white/20 to-transparent opacity-40 blur-3xl w-56 h-56 md:w-72 md:h-72" />
                                </div>

                                <div className="w-40 h-40 relative overflow-hidden">
                                    <Image src={logoSrc} alt="logo" fill sizes="(max-width: 768px) 8rem, 12rem" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                            <Link href="https://github.com/nyebe" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-foreground">
                                <AiFillGithub /> nyebe
                            </Link>
                            <Link href="https://www.linkedin.com/in/ian-cedric-ramirez/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-foreground">
                                <AiFillLinkedin /> Ramirez
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}
