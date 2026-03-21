"use client"

import {
  useEffect,
  useState,
} from 'react';

import { RestaurantResult } from '@/types/restaurant';

import {
  loadSearchResults,
  tips,
} from './dataLanding';

export default function useLandingPage() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<RestaurantResult[]>([]);


  const [tipIndex, setTipIndex] = useState<number>(0);
  const currentTip = tips[tipIndex];

  useEffect(() => {
    const id = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 15000);

    return () => clearInterval(id);
  }, [tips.length]);

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

  return { message, setMessage, loading, errorMessage, results, handleSubmit, disabled: loading, currentTip };
}
