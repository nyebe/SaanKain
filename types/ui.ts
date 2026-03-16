import { RestaurantResult } from '@/types/restaurant';

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
