"use client"

import * as React from 'react';

import {
    ArrowDown,
    ArrowUp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NativeSelect } from '@/components/ui/native-select';
import { cn } from '@/lib/utils';
import {
    SortControlProps,
    SortField,
} from '@/types/ui';

export default function SortControl({ field, direction, onChange, className }: SortControlProps) {
    function handleFieldChange(e: React.ChangeEvent<HTMLSelectElement>) {
        onChange(e.target.value as SortField, direction);
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
