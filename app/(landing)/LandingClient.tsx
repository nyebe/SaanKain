"use client"

import Image from 'next/image';

import SearchForm from '@/components/forms/SearchForm';

import useLandingPage from './useLandingPage';

export default function LandingClient() {
  const { message, setMessage, currentTip } = useLandingPage();

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

          <SearchForm
            message={message}
            onChange={setMessage}
            onSubmit={() => { }}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
}
