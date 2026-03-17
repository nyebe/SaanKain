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
    'Fun fact: Halo-halo is a popular Filipino dessert for hot days.',

    'Tip: Pwede mong ilagay ang cuisine — e.g., "ramen near bgc".',
    'Fun fact: Sisig originally came from Pampanga.',
    'Tip: Combine filters — e.g., "cheap ramen near bgc open now".',
    'Fun fact: Filipino street food includes kwek-kwek, fishball, and isaw.',
    'Tip: Kung di sigurado sa lugar, try searching by city.',
    'Fun fact: Pancit symbolizes long life in Filipino celebrations.',

    'Tip: Try searching "best coffee near me" for cafe spots.',
    'Fun fact: The Philippines has over 7,000 islands with different cuisines.',
    'Tip: Use words like "near bgc", "near makati", or "near qc".',
    'Fun fact: Lechon is considered one of the best roasted pork dishes in the world.',
    'Tip: Searching cuisine like "samgyupsal", "ramen", or "burger" works well.',
    'Fun fact: Balut is a famous Filipino street delicacy.',

    'Tip: If results are few, try removing filters like price.',
    'Fun fact: Filipino breakfasts often include garlic rice (sinangag).',
    'Tip: Searching "open now" helps when looking for late night food.',
    'Fun fact: Jollibee is one of the most popular fast food chains in the Philippines.',
    'Tip: Combine cuisine + location for better results.',
    'Fun fact: Bicol cuisine is known for spicy dishes with coconut milk.'
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
