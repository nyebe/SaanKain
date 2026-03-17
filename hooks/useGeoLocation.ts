"use client"

import {
    useCallback,
    useState,
} from 'react';

import { GeoCoords } from '@/types/search';

export default function useGeoLocation() {
    const [useLocation, setUseLocation] = useState<boolean>(false);
    const [coords, setCoords] = useState<GeoCoords | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [resolving, setResolving] = useState<boolean>(false);

    const toggleLocation = useCallback(() => {
        if (useLocation) {
            // Turn off — clear everything
            setUseLocation(false);
            setCoords(null);
            setLocationError(null);
            return;
        }

        if (!navigator?.geolocation) {
            setLocationError('Hindi available ang geolocation sa device mo.');
            return;
        }

        setResolving(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setUseLocation(true);
                setResolving(false);
            },
            () => {
                setLocationError('Hindi ma-access ang location mo. Check your browser permissions.');
                setResolving(false);
            },
            { timeout: 8000 }
        );
    }, [useLocation]);

    return { useLocation, toggleLocation, coords, locationError, resolving };
}
