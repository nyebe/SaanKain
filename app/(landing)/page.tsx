"use client"

import React, { useState } from "react";
import SearchForm from "@/components/forms/SearchForm";
import ResultsList from "@/components/views/ResultsList";
import LoadingState from "@/components/states/LoadingState";
import ErrorState from "@/components/states/ErrorState";

interface SimulatedResult {
  id: string;
  name: string;
  cuisine: string;
  priceLevel: number;
  rating: number;
  distanceMeters?: number;
}

export default function LandingPage() {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<SimulatedResult[]>([]);

  function handleSubmit() {
    if (!message.trim()) {
      setErrorMessage("Please enter a search message.");
      return;
    }
    setErrorMessage(null);
    setLoading(true);
    setResults([]);

    // Simulate API latency and response
    setTimeout(() => {
      setLoading(false);
      // simple deterministic simulated results based on message hash
      const simulated: SimulatedResult[] = [
        {
          id: "res-1",
          name: `SaanKain — ${message.slice(0, 20)}`,
          cuisine: "Filipino",
          priceLevel: 2,
          rating: 4.4,
          distanceMeters: 850,
        },
        {
          id: "res-2",
          name: `Neighbourhood Eats`,
          cuisine: "Sushi",
          priceLevel: 1,
          rating: 4.1,
          distanceMeters: 1200,
        },
        {
          id: "res-3",
          name: `Budget Bites`,
          cuisine: "Fast Food",
          priceLevel: 1,
          rating: 3.9,
          distanceMeters: 400,
        },
      ];

      setResults(simulated);
    }, 800);
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold mb-4">SaanKain — Search</h1>

        <SearchForm
          message={message}
          onChange={setMessage}
          onSubmit={handleSubmit}
          disabled={loading}
        />

        <div className="mt-6">
          {loading && <LoadingState />}
          {errorMessage && <ErrorState message={errorMessage} onRetry={handleSubmit} />}
          {!loading && !errorMessage && <ResultsList results={results} />}
        </div>
      </div>
    </main>
  );
}
