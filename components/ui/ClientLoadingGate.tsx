"use client";

import React, {
    useEffect,
    useRef,
    useState,
} from 'react';

import { usePathname } from 'next/navigation';

import LoadingScreen from './LoadingScreen';

export default function ClientLoadingGate() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const firstRef = useRef(true);

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
        setLoading(true);
        const t = setTimeout(() => setLoading(false), 450);
        return () => clearTimeout(t);
    }, [pathname]);

    return <LoadingScreen visible={loading} theme="dark" />;
}
