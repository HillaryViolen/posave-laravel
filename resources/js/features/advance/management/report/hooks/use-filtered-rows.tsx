import { useMemo } from 'react';

export type SortKey = 'omzet_desc' | 'omzet_asc' | 'margin_desc' | 'name_asc';

export function useFilteredRows<T extends { name: string; omzet: number; margin: number }>(rows: T[], query: string, sort: SortKey): T[] {
    return useMemo(() => {
        const filtered = rows.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));
        return [...filtered].sort((a, b) => {
            if (sort === 'name_asc') return a.name.localeCompare(b.name);
            if (sort === 'omzet_asc') return a.omzet - b.omzet;
            if (sort === 'margin_desc') return b.margin - a.margin;
            return b.omzet - a.omzet;
        });
    }, [rows, query, sort]);
}
