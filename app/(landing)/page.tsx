"use client"

import SearchForm from '@/components/forms/SearchForm';
import ErrorState from '@/components/states/ErrorState';
import LoadingState from '@/components/states/LoadingState';
import ResultsList from '@/components/views/ResultsList';

import useLandingPage from './useLandingPage';

export default function LandingPage() {
  const { message, setMessage, loading, errorMessage, results, handleSubmit } = useLandingPage();

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
