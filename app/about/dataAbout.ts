import {
    BarChart2,
    Cpu,
    Filter,
    MapPin,
    MessageCircle,
    Search,
    Smartphone,
    Star,
} from 'lucide-react';

export const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.07 },
    }),
};

export const slideLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: (i = 0) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.45, delay: i * 0.1 },
    }),
};

export const popIn = {
    hidden: { opacity: 0, scale: 0.72 },
    visible: (i = 0) => ({
        opacity: 1,
        scale: 1,
        transition: { delay: i * 0.08, duration: 0.45 },
    }),
};

export const timelineSteps = [
    {
        icon: MessageCircle,
        emoji: '💬',
        label: 'You type it',
        desc: 'cheap sushi near makati open now',
        color: 'from-black to-white',
        bg: 'bg-black/5 dark:bg-black/950/30',
        border: 'border-black/10 dark:border-white/10',
    },
    {
        icon: Search,
        emoji: '🔍',
        label: 'LLM / Rule Parser',
        desc: 'Groq LLM (or rule-based fallback) extracts cuisine · location · openNow',
        color: 'from-black to-white',
        bg: 'bg-black/5 dark:bg-black/950/30',
        border: 'border-black/10 dark:border-white/10',
    },
    {
        icon: Cpu,
        emoji: '🧠',
        label: 'Location resolved',
        desc: 'Browser Geolocation + Nominatim reverse-geocode → lat/lng coordinates',
        color: 'from-black to-white',
        bg: 'bg-black/5 dark:bg-black/950/30',
        border: 'border-black/10 dark:border-white/10',
    },
    {
        icon: MapPin,
        emoji: '📍',
        label: 'Places fetched',
        desc: 'Foursquare Places API: query · near text or ll coordinates',
        color: 'from-black to-white',
        bg: 'bg-black/5 dark:bg-black/950/30',
        border: 'border-black/10 dark:border-white/10',
    },
    {
        icon: BarChart2,
        emoji: '🏆',
        label: 'Smart ranking',
        desc: 'Cuisine match scored · distance as tiebreaker',
        color: 'from-black to-white',
        bg: 'bg-black/5 dark:bg-black/950/30',
        border: 'border-black/10 dark:border-white/10',
    },
    {
        icon: Smartphone,
        emoji: '✨',
        label: 'Results appear',
        desc: 'Filter by category · Sort by name, type or distance · List or Gallery',
        color: 'from-black to-white',
        bg: 'bg-black/5 dark:bg-black/950/30',
        border: 'border-black/10 dark:border-white/10',
    },
];

export const parsedFields = [
    { key: 'cuisine', value: '"sushi"', color: 'text-yellow-500' },
    { key: 'location', value: '"makati"', color: 'text-sky-400' },
    { key: 'openNow', value: 'true', color: 'text-violet-400' },
];

export const features = [
    { icon: MessageCircle, label: 'Natural Language', desc: 'Type free-text queries — no forms or dropdowns needed.', emoji: '🗣️' },
    { icon: Cpu, label: 'LLM + Rule Parser', desc: 'Groq LLM with rule-based fallback extracts cuisine, location, and open status.', emoji: '🧠' },
    { icon: MapPin, label: 'Geolocation', desc: 'Browser Geolocation + Nominatim reverse-geocode powers "near me" searches.', emoji: '📍' },
    { icon: Search, label: 'Foursquare Places', desc: 'Live place data via Foursquare Places API — queried by text or coordinates.', emoji: '🗺️' },
    { icon: Filter, label: 'Filter, Sort & View', desc: 'Filter by category, sort by name/type/distance, switch list or gallery view.', emoji: '🎛️' },
    { icon: Star, label: 'Bookmarks & History', desc: 'Save favourite spots and revisit past searches anytime.', emoji: '🔖' },
];

export const stack = [
    { category: 'Framework', items: ['Next.js (Full Stack)', 'TypeScript', 'CSS'], emoji: '🏗️' },
    { category: 'UI', items: ['TailwindCSS', 'shadcn/ui', 'Framer Motion', 'Lucide React', 'Recharts', 'Sonner', 'Vaul', 'Embla Carousel'], emoji: '🎨' },
    { category: 'HTTP / AI', items: ['Axios', 'groq-sdk'], emoji: '⚙️' },
    { category: 'Integrations', items: ['Foursquare Places API', 'OpenStreetMap Nominatim'], emoji: '🔌' },
];

export const practices = [
    { emoji: '🔒', label: 'TypeScript Strict Mode', desc: 'strict: true in tsconfig — no any, full type safety across every module.' },
    { emoji: '🏗️', label: 'Layered Architecture', desc: 'lib/ → services/ → hooks/ → components/ — each layer has one responsibility.' },
    { emoji: '🛡️', label: 'API Input Validation', desc: 'Auth code, message length, and coordinate range validated before any logic runs.' },
    { emoji: '🧠', label: 'LLM Output Guarded by Zod', desc: 'Groq LLM response validated with a Zod schema; rule-based fallback always available.' },
    { emoji: '🧪', label: 'Unit Tests — Vitest', desc: 'Parser and validation modules covered with describe / it test suites under tests/.' },
    { emoji: '💾', label: 'Safe localStorage', desc: 'SSR guard + try/catch on all reads/writes. History capped at 50, bookmarks at 20.' },
    { emoji: '⚙️', label: 'Env-based Configuration', desc: 'All secrets and limits via environment variables — never hardcoded in library code.' },
    { emoji: '🌐', label: 'SEO Metadata', desc: 'Next.js metadata API: title, description, OpenGraph, and keywords defined in layout.' },
];
