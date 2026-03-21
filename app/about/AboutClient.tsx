"use client";

import { useRef } from 'react';

import {
    motion,
    useInView,
} from 'framer-motion';
import {
    Github,
    Linkedin,
} from 'lucide-react';
import Image from 'next/image';

import HeroV2 from '@/components/hero/HeroV2';

import {
    fadeUp,
    features,
    parsedFields,
    popIn,
    practices,
    slideLeft,
    stack,
    timelineSteps,
} from './dataAbout';
import useAboutPage from './useAboutPage';

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.section ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
            {children}
        </motion.section>
    );
}

function ParserSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <AnimatedSection>
            <motion.h2 variants={fadeUp} className="text-2xl font-bold mb-2 text-center">
                Natural Language Parsing
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-sm text-muted-foreground mb-6 text-center">
                Casual text → structured parameters. Groq LLM with a rule-based fallback — always deterministic.
            </motion.p>

            <motion.div ref={ref} variants={popIn} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="dark:bg-gray-950 dark:text-white rounded-2xl overflow-hidden shadow-xl border border-white/10 md:mx-42">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="ml-3 text-xs dark:text-white/30 font-mono">parser output</span>
                </div>

                <div className="p-5 font-mono text-sm leading-relaxed">
                    <span className="dark:text-white/50">{'{'}</span>
                    <div className="ml-4 space-y-1">
                        {parsedFields.map((f, i) => (
                            <motion.div key={f.key} initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 + i * 0.1, duration: 0.35 }}>
                                <span className="dark:text-white/60">{f.key}</span>
                                <span className="dark:text-white/40">: </span>
                                <span className={f.color}>{f.value}</span>
                                <span className="dark:text-white/30">,</span>
                            </motion.div>
                        ))}
                    </div>
                    <span className="dark:text-white/50">{'}'}</span>
                </div>
            </motion.div>

            <motion.p variants={fadeUp} custom={4} className="mt-4 text-xs text-muted-foreground leading-relaxed text-center">
                Uses Groq LLM (llama-3.1-8b-instruct) when available; falls back to regex rules. Extracts cuisine, location, and open‑now status.
            </motion.p>
        </AnimatedSection>
    );
}

function FeaturesGrid() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <AnimatedSection>
            <motion.h2 variants={fadeUp} className="text-2xl font-bold mb-2">
                Features
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-sm text-muted-foreground mb-6">
                Everything packed into one playful prototype.
            </motion.p>

            <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {features.map((f, i) => (
                    <motion.div key={f.label} variants={popIn} custom={i} initial="hidden" animate={inView ? 'visible' : 'hidden'} whileHover={{ scale: 1.03, boxShadow: '0 0 24px 4px rgba(250,204,21,0.18)', transition: { duration: 0.22 } }} className="group relative p-5 rounded-2xl border border-border bg-card cursor-default overflow-hidden">
                        <motion.div className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-yellow-400 to-orange-400" initial={{ width: 0 }} whileHover={{ width: '100%' }} transition={{ duration: 0.3 }} />

                        <div className="flex flex-col items-start gap-3">
                            <motion.span className="text-2xl" whileHover={{ rotate: [0, -12, 12, -6, 0], scale: 1.25 }} transition={{ duration: 0.45 }}>{f.emoji}</motion.span>
                            <div>
                                <p className="font-semibold text-sm">{f.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </AnimatedSection>
    );
}

function TechStack() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <AnimatedSection>
            <motion.h2 variants={fadeUp} className="text-2xl font-bold mb-2">
                Technology Stack
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-sm text-muted-foreground mb-6">
                Chosen for speed, clarity, and interview-friendliness.
            </motion.p>



            <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stack.map((s, i) => (
                    <motion.div key={s.category} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1, duration: 0.45 }} whileHover={{ y: -4, boxShadow: '0 8px 32px -4px rgba(0,0,0,0.12)', transition: { duration: 0.22 } }} className="p-5 rounded-2xl border border-border bg-card">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">{s.emoji}</span>
                            <p className="font-semibold text-sm">{s.category}</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {s.items.map((item, j) => (
                                <motion.span key={item} initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: i * 0.1 + j * 0.06 + 0.2 }} className="px-2.5 py-0.5 rounded-full text-xs bg-muted text-muted-foreground border border-border font-mono">
                                    {item}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </AnimatedSection>
    );
}

function PracticesSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <AnimatedSection>

            <motion.h2 variants={fadeUp} className="text-2xl font-bold mb-2">
                Engineering Practices
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-sm text-muted-foreground mb-6">
                Patterns applied throughout the codebase.
            </motion.p>

            <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {practices.map((practice, i) => (
                    <motion.div key={practice.label} variants={popIn} custom={i} initial="hidden" animate={inView ? 'visible' : 'hidden'} whileHover={{ scale: 1.03, boxShadow: '0 0 24px 4px rgba(0,0,0,0.10)', transition: { duration: 0.22 } }} className="group relative p-5 rounded-2xl border border-border bg-card cursor-default overflow-hidden">
                        <motion.div className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-black to-black/40 dark:from-white dark:to-white/30" initial={{ width: 0 }} whileHover={{ width: '100%' }} transition={{ duration: 0.3 }} />
                        <div className="flex flex-col items-start gap-3">
                            <motion.span className="text-2xl" whileHover={{ rotate: [0, -12, 12, -6, 0], scale: 1.25 }} transition={{ duration: 0.45 }}>
                                {practice.emoji}
                            </motion.span>
                            <div>
                                <p className="font-semibold text-sm">{practice.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{practice.desc}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </AnimatedSection>
    );
}

function DeveloperCard() {
    return (
        <>
            <h3 className="text-2xl font-bold text-center mb-16">Meet the Developer:</h3>

            <section>
                <motion.div
                    initial="rest"
                    whileHover="hover"
                    className="mx-auto w-64 sm:w-72"
                >
                    <motion.div
                        variants={{
                            rest: { rotateX: 0, rotateY: 0, scale: 1 },
                            hover: { rotateX: 6, rotateY: -6, scale: 1.02 },
                        }}
                        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
                        className="relative rounded-2xl border border-border bg-card shadow-xl"
                    >
                        <div className="absolute inset-0 bg-linear-to-br opacity-6 pointer-events-none" />

                        <div className="flex flex-col items-center p-6">
                            <Image
                                src="https://media.licdn.com/dms/image/v2/D5603AQHIMQF9Bwq98Q/profile-displayphoto-crop_800_800/B56ZnM2l2QKEAM-/0/1760078487597?e=1775692800&v=beta&t=aT1rdy9WGiIesWvFqWkiSmXn-_HBHn_3It59o3EFTUM"
                                alt="Ian Cedric Ramirez"
                                width={144}
                                height={144}
                                className="w-36 h-36 rounded-full object-cover border-4 border-white/5 shadow-md -mt-12"
                            />

                            <h4 className="mt-3 text-lg font-semibold">Ian Cedric Ramirez</h4>
                            <p className="text-sm text-muted-foreground">Full Stack Engineer</p>

                            <div className="flex gap-2 mt-3">
                                <span className="px-2.5 py-0.5 rounded-full text-xs bg-muted text-muted-foreground border border-border font-mono">Full Stack Engineer</span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs bg-muted text-muted-foreground border border-border font-mono">3 years experience</span>
                            </div>

                            <p className="mt-3 text-sm text-center text-muted-foreground">Building playful, practical projects. When not coding, I explore mountains, beaches, and read books.</p>

                            <div className="flex items-center gap-4 mt-4">
                                <a href="https://www.linkedin.com/in/ian-cedric-ramirez" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-foreground hover:underline">
                                    <Linkedin className="w-5 h-5" />
                                    <span>LinkedIn</span>
                                </a>

                                <a href="https://github.com/ian-cedric-ramirez" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-foreground hover:underline">
                                    <Github className="w-5 h-5" />
                                    <span>GitHub</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>
        </>
    );
}

function AboutProject() {
    return (
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.15 }} className="mt-10 px-5 py-6 rounded-2xl border border-border bg-card">
            <h4 className="text-lg font-semibold">About SaanKain</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
                Ever asked yourself:{' '}
                <span className="font-semibold text-foreground">&quot;Saan ba tayo kakain?&quot;</span>{' '}
                SaanKain lets you type that exact question — or anything similar — in natural language. Example:{' '}
                <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-foreground">cheap sushi near makati open now</code>. The app interprets the message, searches places, ranks results, and presents them in a clean, mobile-first UI.
            </p>
        </motion.section>
    );
}

function HowItWorks() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <AnimatedSection>
            <motion.h2 variants={fadeUp} className="text-2xl font-bold mb-2 text-center">
                How It Works
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-sm text-muted-foreground mb-8  text-center">
                Six steps from question to delicious answer.
            </motion.p>

            <div className="flex justify-center mt-8s">
                <div ref={ref} className="relative w-lg">
                    {/* connector line */}
                    <motion.div
                        className="absolute left-1/2 top-10 bottom-10 w-0.5 bg-black hidden sm:block"
                        initial={{ scaleY: 0, originY: 0 }}
                        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 1.1, delay: 0.2 }}
                    />

                    <div className="flex flex-col gap-5 md:mx-10">
                        {timelineSteps.map((step, i) => (
                            i % 2 === 0 ? (
                                <motion.div
                                    key={step.label}
                                    variants={slideLeft}
                                    custom={i}
                                    initial="hidden"
                                    animate={inView ? 'visible' : 'hidden'}
                                    whileHover={{ x: 6, transition: { duration: 0.2 } }}
                                    className={`flex items-start gap-4 p-4 rounded-2xl border ${step.bg} ${step.border} cursor-default md:translate-x-[41.5%]`}
                                >
                                    {/* icon bubble */}
                                    <motion.div
                                        whileHover={{ rotate: [0, -10, 10, -6, 0], scale: 1.15 }}
                                        transition={{ duration: 0.5 }}
                                        className={`relative z-10 shrink-0 w-11 h-11 rounded-full bg-linear-to-br ${step.color} flex items-center justify-center shadow-md`}
                                    >
                                        <span className="text-lg">{step.emoji}</span>
                                    </motion.div>

                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm leading-tight">{step.label}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">{step.desc}</p>
                                    </div>

                                    {/* step number */}
                                    <span className="ml-auto shrink-0 text-xs font-bold text-muted-foreground/40 tabular-nums">
                                        0{i + 1}
                                    </span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={step.label}
                                    variants={slideLeft}
                                    custom={i}
                                    initial="hidden"
                                    animate={inView ? 'visible' : 'hidden'}
                                    whileHover={{ x: -6, transition: { duration: 0.2 } }}
                                    className={`flex flex-row-reverse md:flex-row items-start gap-4 p-4 rounded-2xl border ${step.bg} ${step.border} cursor-default md:translate-x-[-41.5%]`}
                                >
                                    {/* step number */}
                                    <span className="mr-auto shrink-0 text-xs font-bold text-muted-foreground/40 tabular-nums">
                                        0{i + 1}
                                    </span>

                                    <div className="min-w-0 text-left md:text-right">
                                        <p className="font-semibold text-sm leading-tight">{step.label}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">{step.desc}</p>
                                    </div>

                                    {/* icon bubble */}
                                    <motion.div
                                        whileHover={{ rotate: [0, -10, 10, -6, 0], scale: 1.15 }}
                                        transition={{ duration: 0.5 }}
                                        className={`relative z-10 shrink-0 w-11 h-11 rounded-full bg-linear-to-br ${step.color} flex items-center justify-center shadow-md`}
                                    >
                                        <span className="text-lg">{step.emoji}</span>
                                    </motion.div>


                                </motion.div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}

function SectionSeparator({ size = 'md' }: { size?: 'md' | 'lg' }) {
    const pad = size === 'lg' ? 'py-8' : 'py-6';
    return (
        <div className={pad}>
            <hr />
        </div>
    );
}

export default function AboutClient() {
    useAboutPage();

    return (
        <main className="p-6">
            <div className="mx-auto max-w-5xl">
                <HeroV2 />

                <AboutProject />

                <SectionSeparator />

                <HowItWorks />

                <SectionSeparator />

                <ParserSection />

                <SectionSeparator />

                <FeaturesGrid />

                <SectionSeparator />

                <TechStack />

                <SectionSeparator />

                <PracticesSection />

                <SectionSeparator size="lg" />

                <DeveloperCard />



            </div>
        </main>
    );
}
