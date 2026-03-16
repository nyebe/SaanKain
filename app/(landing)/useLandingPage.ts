import * as React from 'react';

import { SearchResult } from '@/types/search';

import { getSimulatedResults } from './dataLanding';

export default function useLandingPage() {
  const [message, setMessage] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<SearchResult[]>([]);

  function handleSubmit() {
    if (!message.trim()) {
      setErrorMessage('Please enter a search message.');
      return;
    }
    setErrorMessage(null);
    setLoading(true);
    setResults([]);

    // Simulate API latency and response (data moved to dataLanding)
    setTimeout(() => {
      setLoading(false);
      const simulated = getSimulatedResults(message);

      setResults(simulated);
    }, 800);
  }

  return { message, setMessage, loading, errorMessage, results, handleSubmit, disabled: loading };
}
