"use client"

import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    GeoCoords,
    GeoLocation,
} from '@/types/search';

export default function useGeoLocation() {
    const [useLocation, setUseLocation] = useState<boolean>(false);

    const [coords, setCoords] = useState<GeoCoords | null>(null);

    const [location, setLocation] = useState<GeoLocation | null>(null);

    useEffect(() => {
        try {
            const storedUse = localStorage.getItem('saan_useLocation');
            if (storedUse === 'true') setUseLocation(true);

            const sCoords = localStorage.getItem('saan_coords');
            if (sCoords) {
                const p = JSON.parse(sCoords);
                if (p && typeof p.lat === 'number' && typeof p.lng === 'number') setCoords({ lat: p.lat, lng: p.lng });
            }

            const sLoc = localStorage.getItem('saan_location');
            if (sLoc) {
                try {
                    const parsed = JSON.parse(sLoc);
                    setLocation(parsed);
                } catch {
                }
            }
        } catch {
        }
    }, []);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [resolving, setResolving] = useState<boolean>(false);

    const toggleLocation = useCallback(() => {
        if (useLocation) {
            // Turn off — clear everything
            setUseLocation(false);
            setCoords(null);
            setLocation(null);
            setLocationError(null);
            try {
                localStorage.removeItem('saan_useLocation');
                localStorage.removeItem('saan_coords');
                localStorage.removeItem('saan_location');
            } catch {
                // ignore
            }
            return;
        }

        if (!navigator?.geolocation) {
            setLocationError('Hindi available ang geolocation sa device mo.');
            return;
        }

        setResolving(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const newCoords: GeoCoords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setCoords(newCoords);
                setUseLocation(true);
                try {
                    localStorage.setItem('saan_useLocation', 'true');
                    localStorage.setItem('saan_coords', JSON.stringify(newCoords));
                } catch {
                }

                try {
                    const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(newCoords.lat)}&lon=${encodeURIComponent(newCoords.lng)}&format=json`;
                    const res = await fetch(url, {
                        headers: {
                            'Accept': 'application/json',
                            'User-Agent': 'SaanKain/1.0 (+https://example.com)'
                        }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        const displayName = data?.display_name ?? '';
                        const addr = data?.address ?? {};

                        const municipality = addr.municipality ?? addr.town ?? addr.village ?? addr.county ?? null;
                        const barangay = addr.suburb ?? addr.neighbourhood ?? addr.hamlet ?? addr.village ?? addr.barangay ?? null;
                        const town = addr.town ?? null;
                        const cityDistrict = addr.city_district ?? null;
                        const city = addr.city ?? null;
                        const region = addr.state ?? addr.region ?? addr.county ?? null;
                        const country = addr.country ?? null;

                        const locObj: GeoLocation = {
                            coords: newCoords,
                            displayName,
                            address: addr,
                            municipality,
                            barangay,
                            town,
                            cityDistrict,
                            city,
                            region,
                            country,
                        };

                        setLocation(locObj);
                        try {
                            localStorage.setItem('saan_location', JSON.stringify(locObj));
                        } catch {
                            // ignore
                        }
                    } else {
                        setLocation(null);
                    }
                } catch {
                    setLocation(null);
                } finally {
                    setResolving(false);
                }
            },
            () => {
                setLocationError('Hindi ma-access ang location mo. Check your browser permissions.');
                setResolving(false);
            },
            { timeout: 8000 }
        );
    }, [useLocation]);

    useEffect(() => {
        try {
            if (useLocation) {
                if (coords) localStorage.setItem('saan_coords', JSON.stringify(coords));
                localStorage.setItem('saan_useLocation', 'true');
            }
        } catch {
            // ignore
        }
    }, [useLocation, coords]);

    return { useLocation, toggleLocation, coords, location, locationError, resolving };
}
