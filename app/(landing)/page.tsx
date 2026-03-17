"use client"

import { useState } from 'react';

import SearchForm from '@/components/forms/SearchForm';

export default function LandingPage() {
  const [message, setMessage] = useState<string>('');

  return (
    <div className="flex-1 min-h-0 flex items-center justify-center p-6">
      <main className="w-full">
        <div className="mx-auto max-w-3xl w-full flex items-center justify-center">
          <div className="w-full">
            <SearchForm
              message={message}
              onChange={setMessage}
              onSubmit={() => { }}
              disabled={false}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
