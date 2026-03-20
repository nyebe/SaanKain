"use client";

import React, {
    useEffect,
    useRef,
    useState,
} from 'react';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';

import LoadingScreen from '../components/states/LoadingScreen';

export default function ClientLoadingGate() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const firstRef = useRef(true);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        // initial first-load show
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        // skip the very first pathname (initial mount handled above)
        if (firstRef.current) {
            firstRef.current = false;
            return;
        }

        // show on client navigations briefly
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        const t = setTimeout(() => setLoading(false), 450);
        return () => clearTimeout(t);
    }, [pathname]);

    // use next-themes resolvedTheme when available
    useEffect(() => {
        if (resolvedTheme)
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTheme(resolvedTheme === 'dark' ? 'dark' : 'light');
    }, [resolvedTheme]);

    return <LoadingScreen visible={loading} theme={theme} />;
}
