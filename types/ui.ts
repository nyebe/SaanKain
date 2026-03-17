import { RestaurantResult } from '@/types/restaurant';
import { SearchHistoryEntry } from '@/types/search';

export interface SearchFormProps {
    message: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
}

export interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
}

export interface ResultCardProps {
    item: RestaurantResult;
}

export interface ResultsListProps {
    results: RestaurantResult[];
}

export interface DocHeaderProps {
    title: string;
    description?: string;
    author?: string;
    lastModified?: string;
}

export interface ColorSwatch {
    name: string;
    hex: string;
    bgClass: string;
    textClass: string;
    description: string;
}

export type ViewMode = 'list' | 'gallery'

export interface ViewModeToggleProps {
    view: ViewMode
    onChange: (v: ViewMode) => void
    className?: string
}

export interface SearchHistorySheetProps {
    history: SearchHistoryEntry[];
    onSelect: (query: string) => void;
    onRemove: (query: string) => void;
    onClear: () => void;
}
