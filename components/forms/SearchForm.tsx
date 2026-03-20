"use client"

import {
  ChangeEvent,
  KeyboardEvent,
  useState,
} from 'react';

import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { SearchFormProps } from '@/types/ui';

export default function SearchForm({ message, onChange, onSubmit, disabled = false,
  useLocation, toggleLocation, coords, resolving, locationError,
}: SearchFormProps) {
  const router = useRouter();
  const [randomVariant, setRandomVariant] = useState<string>('all');

  const randomOptions: { key: string; label: string }[] = [
    { key: 'chill', label: 'Ikaw bahala basta chill' },
    { key: 'kanin', label: 'Ikaw bahala basta may kanin' },
    { key: 'meryenda', label: 'Ikaw bahala basta meryenda' },
    { key: 'drinks', label: 'Ikaw bahala basta drinks' },
  ];

  function makeRandomMessage(variant: string) {
    const topics = {
      all: [
        'pagkain',
        'kainan',
        'random food',
        'best local food',
      ],
      chill: ['burger', 'coffee shop', 'convenience store', 'cocktail bar', 'pizza'],
      kanin: ['rice meals', 'restaurant', 'shop', 'fast food', 'plate meals'],
      meryenda: ['snacks', 'merienda', 'bakery', 'pastries', 'dessert'],
      drinks: ['beverages', 'milk tea', 'fresh juice', 'coffee', 'drinks'],
    } as Record<string, string[]>;

    const pool = topics[variant] ?? topics.all;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const base = pick;
    if (coords) return `${base} near me`;
    return base;
  }

  function normalizeInput(input: string) {
    if (!input) return input;
    return input.replace(/\bbgc\b/gi, 'Bonifacio Global City');
  }

  const handleRandom = (variantKey?: string) => {
    const v = variantKey ?? randomVariant ?? 'all';
    if (!useLocation && toggleLocation) {
      try {
        toggleLocation();
      } catch {
        // ignore
      }
    }
    const msg = makeRandomMessage(v);
    if (onChange) onChange(msg);
    if (onSubmit) onSubmit();
    const query = msg ? `?message=${encodeURIComponent(msg)}` : '';
    router.push(`/results${query}`);
  };

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
          onChange={(changeEvent: ChangeEvent<HTMLTextAreaElement>) => onChange(normalizeInput(changeEvent.target.value))}
          onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (onSubmit) onSubmit();
              const query = message ? `?message=${encodeURIComponent(normalizeInput(message))}` : '';
              router.push(`/results${query}`);
            }
          }}
          placeholder="e.g. cheap sushi near makati open now"
          rows={3}
          maxLength={200}
          className="mt-2"
          aria-label="search message"
        />
      </label>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={disabled} className="px-4">
            Search
          </Button>

          {/* Clear button */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              onChange("");
              router.push('/results');
            }}
          >
            Clear
          </Button>
        </div>

        {/* Right aligned random split button */}
        <div className="ml-auto flex items-stretch">
          <Button
            type="button"
            onClick={() => handleRandom()}
            className="rounded-r-none px-4 "
          >
            Ikaw bahala
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <div
                className="px-2 dark:bg-white/90 dark:hover:bg-white/80 bg-black hover:bg-black py-2 rounded-l-none rounded-lg"
                aria-label="Random options"
              >
                <ChevronDown className="w-4 h-4 dark:text-black text-white" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={randomVariant}
                onValueChange={(v) => {
                  setRandomVariant(v);
                  handleRandom(v);
                }}
              >
                {randomOptions.map((opt) => (
                  <DropdownMenuRadioItem key={opt.key} value={opt.key} className="capitalize w-fit">
                    {opt.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </form>
  );
}
