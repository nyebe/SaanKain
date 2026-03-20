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
    const [useLocation, setUseLocation] = useState<boolean>(() => {
        try {
            return localStorage.getItem('saan_useLocation') === 'true';
        } catch {
            return false;
        }
    });

    const [coords, setCoords] = useState<GeoCoords | null>(() => {
        try {
            const s = localStorage.getItem('saan_coords');
            if (!s) return null;
            const p = JSON.parse(s);
            if (p && typeof p.lat === 'number' && typeof p.lng === 'number') return { lat: p.lat, lng: p.lng };
        } catch {
            // ignore
        }
        return null;
    });

    const [location, setLocation] = useState<GeoLocation | null>(() => {
        try {
            const s = localStorage.getItem('saan_location');
            if (!s) return null;
            return JSON.parse(s);
        } catch {
            return null;
        }
    });
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
                    // ignore
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

                        const municipality = addr.town ?? addr.municipality ?? addr.village ?? addr.city_district ?? addr.county ?? null;
                        const city = addr.city ?? addr.town ?? addr.village ?? null;
                        const region = addr.state ?? addr.region ?? addr.county ?? null;
                        const country = addr.country ?? null;

                        const locObj: GeoLocation = {
                            coords: newCoords,
                            displayName,
                            address: addr,
                            municipality,
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
                } catch (err) {
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

    // Keep localStorage in sync if coords/useLocation change externally
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
