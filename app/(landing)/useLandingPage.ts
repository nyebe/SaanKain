import { useState } from 'react';

import { RestaurantResult } from '@/types/restaurant';

import { loadSearchResults } from './dataLanding';

export default function useLandingPage() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<RestaurantResult[]>([]);

  async function handleSubmit() {
    if (!message.trim()) {
      setErrorMessage('Please enter a search message.');
      return;
    }
    setErrorMessage(null);
    setLoading(true);
    setResults([]);

    try {
      const response = await loadSearchResults(message);
      if (response.success) {
        setResults(response.results);
      } else {
        setErrorMessage(response.error.message);
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return { message, setMessage, loading, errorMessage, results, handleSubmit, disabled: loading };
}
