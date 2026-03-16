"use client"

import { Button } from '@/components/ui/button';
import { ErrorStateProps } from '@/types/ui';

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="border rounded-md p-4 bg-red-50">
      <div className="text-sm text-red-800">{message}</div>
      {onRetry && (
        <div className="mt-3">
          <Button onClick={onRetry} variant="outline">Retry</Button>
        </div>
      )}
    </div>
  );
}
