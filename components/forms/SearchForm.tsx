"use client"

import { ChangeEvent } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SearchFormProps } from '@/types/ui';

export default function SearchForm({ message, onChange, onSubmit, disabled = false }: SearchFormProps) {
  const router = useRouter();

  return (
    <form
      onSubmit={(formEvent) => {
        formEvent.preventDefault();
        if (onSubmit) onSubmit();
        const query = message ? `?message=${encodeURIComponent(message)}` : '';
        router.push(`/results${query}`);
      }}
      className="space-y-3"
    >
      <label className=" w-full flex flex-col">
        <span className="text-sm font-medium self-center">What are you looking for?</span>
        <Textarea
          value={message}
          onChange={(changeEvent: ChangeEvent<HTMLTextAreaElement>) => onChange(changeEvent.target.value)}
          placeholder="e.g. cheap sushi near makati open now"
          rows={3}
          maxLength={200}
          className="mt-2"
          aria-label="search message"
        />
      </label>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={disabled} className="px-4">
          Search
        </Button>
        <Button type="button" variant="ghost" onClick={() => onChange("")}>Clear</Button>
      </div>
    </form>
  );
}
