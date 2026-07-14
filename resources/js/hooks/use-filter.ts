import { router } from '@inertiajs/react';
import { useState } from 'react';

export function useFilters<T extends { search?: string }>(routeName: string, filters: T) {
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilters = (overrides: Partial<T>) => {
        router.get(route(routeName), { ...filters, ...overrides }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: search || undefined } as Partial<T>);
    };

    return { search, setSearch, applyFilters, handleSearch };
}