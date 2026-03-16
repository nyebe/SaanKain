"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SearchFormProps {
  message: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function SearchForm({ message, onChange, onSubmit, disabled = false }: SearchFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-3"
    >
      <label className="block">
        <span className="text-sm font-medium">What are you looking for?</span>
        <Textarea
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
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
