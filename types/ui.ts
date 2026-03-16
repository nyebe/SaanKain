import { SearchResult } from '@/types/search';

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
    item: SearchResult;
}

export interface ResultsListProps {
    results: SearchResult[];
}
