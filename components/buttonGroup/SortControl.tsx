"use client"

import { ChangeEvent } from 'react';

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
    function handleFieldChange(e: ChangeEvent<HTMLSelectElement>) {
        onChange(e.target.value as SortField, direction);
    }

    function toggleDirection() {
        onChange(field, direction === 'asc' ? 'desc' : 'asc');
    }

    return (
        <div className={cn('inline-flex items-center gap-2', className)} data-slot="sort-control">
            <NativeSelect value={field} onChange={handleFieldChange} className="min-w-36">
                <option value="name" className='dark:bg-black dark:text-white'>Name</option>
                <option value="type" className='dark:bg-black dark:text-white'>Type</option>
                <option value="distance" className='dark:bg-black dark:text-white'>Distance</option>
            </NativeSelect>

            <Button size="icon" variant="ghost" onClick={toggleDirection} title={`Sort ${direction === 'asc' ? 'ascending' : 'descending'}`}>
                {direction === 'asc' ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
            </Button>
        </div>
    );
}
