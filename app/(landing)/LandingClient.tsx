"use client"

import Image from 'next/image';

import LocationToggle from '@/components/buttonGroup/LocationToggle';
import SearchForm from '@/components/forms/SearchForm';
import useGeoLocation from '@/hooks/useGeoLocation';

import useLandingPage from './useLandingPage';

export default function LandingClient() {
  const { message, setMessage, currentTip } = useLandingPage();
  const { useLocation, toggleLocation, coords, resolving, locationError, location } = useGeoLocation();

  return (
    <div className="flex-1 min-h-0 flex items-center justify-center p-6">
      <div className="mx-auto max-w-3xl w-full flex items-center justify-center">
        <div className="w-full flex flex-col">
          <div className="h-52 aspect-square mb-4 relative self-center">
            <Image src="/app-logo/512x512.png" alt="SaanKain" fill />
          </div>
          <div className="flex items-center gap-4 mb-6 self-center">
            <div className="text-sm text-muted-foreground">{currentTip}</div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <LocationToggle useLocation={useLocation} resolving={resolving} onToggle={toggleLocation} />

            {useLocation && (
              <div className="mt-2 w-full">
                <span className="tabular-nums text-xs text-muted-foreground max-w-full truncate block">
                  {(() => {
                    const parts = [
                      location?.barangay,
                      location?.town,
                      location?.cityDistrict,
                      location?.municipality,
                      location?.city,
                      location?.region,
                      location?.country,
                    ].filter(Boolean) as string[];
                    if (parts.length > 0) return parts.join(', ');
                    return coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : '';
                  })()}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchForm
                message={message}
                onChange={setMessage}
                onSubmit={() => { }}
                disabled={false}
                useLocation={useLocation}
                toggleLocation={toggleLocation}
                coords={coords}
                resolving={resolving}
                locationError={locationError}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
