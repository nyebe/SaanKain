"use client"

import * as React from 'react'
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { NativeSelect } from '@/components/ui/native-select';
import { SortControlProps } from '@/types/ui';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function SortControl({ field, direction, onChange, className }: SortControlProps) {
    function handleFieldChange(e: React.ChangeEvent<HTMLSelectElement>) {
        onChange(e.target.value as any, direction);
    }

    function toggleDirection() {
        onChange(field, direction === 'asc' ? 'desc' : 'asc');
    }

    return (
        <div className={cn('inline-flex items-center gap-2', className)} data-slot="sort-control">
            <NativeSelect value={field} onChange={handleFieldChange} className="min-w-[9rem]">
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="distance">Distance</option>
            </NativeSelect>

            <Button size="icon" variant="ghost" onClick={toggleDirection} title={`Sort ${direction === 'asc' ? 'ascending' : 'descending'}`}>
                {direction === 'asc' ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
            </Button>
        </div>
    );
}
