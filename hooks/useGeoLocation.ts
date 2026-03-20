"use client"

import {
  useCallback,
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
            async (position) => {
                const newCoords: GeoCoords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setCoords(newCoords);
                setUseLocation(true);

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

                        setLocation({
                            coords: newCoords,
                            displayName,
                            address: addr,
                            municipality,
                            city,
                            region,
                            country,
                        });
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

    return { useLocation, toggleLocation, coords, location, locationError, resolving };
}
