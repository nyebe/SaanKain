"use client"

import { useState } from 'react';

import SearchForm from '@/components/forms/SearchForm';

export default function LandingPage() {
  const [message, setMessage] = useState<string>('');

  return (
    <main className="p-6">
      <div className="mx-auto max-w-3xl">
        <SearchForm
          message={message}
          onChange={setMessage}
          onSubmit={() => { }}
          disabled={false}
        />
      </div>
    </main>
  );
}
