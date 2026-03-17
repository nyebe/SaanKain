"use client"

import {
  useEffect,
  useState,
} from 'react';

import { RestaurantResult } from '@/types/restaurant';

import { loadSearchResults } from './dataLanding';

export default function useLandingPage() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<RestaurantResult[]>([]);
  const tips: string[] = [
    'Tip: Mag-search gamit ang lugar — e.g., "sushi near makati"',
    'Fun fact: Ang adobo ay hindi pare-pareho sa buong Pilipinas!',
    'Tip: Add "cheap" or "expensive" para ma-filter ang presyo.',
    'Fun fact: May mga karinderya na bukas 24/7 sa ilang lugar.',
    'Tip: Gamitin ang "open now" para makita agad ang bukas na kainan.',
    'Fun fact: Halo-halo is a popular Filipino dessert for hot days.'
  ];

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
