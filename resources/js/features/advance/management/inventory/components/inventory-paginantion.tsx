import React from 'react';
import { router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface InventoryPaginationProps {
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
    itemLabel: string;
    perPage: string;
    onPerPageChange: (value: string) => void;
    perPageOptions?: number[];
}

export function InventoryPagination({
    from,
    to,
    total,
    links,
    itemLabel,
    perPage,
    onPerPageChange,
    perPageOptions = [6, 12, 24],
}: InventoryPaginationProps) {
    return (
        <div className="mt-auto flex items-center justify-between pt-4">
            <span className="text-sm text-[var(--grey-text)]">
                Menampilkan {from ?? 0}-{to ?? 0} dari {total} {itemLabel}
            </span>

            <div className="flex items-center gap-1">
                {links.map((link, i) => (
                    <button
                        aria-label="button"
                        key={i}
                        disabled={!link.url}
                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                        className={`rounded-lg px-3 py-1.5 text-sm ${
                            link.active
                                ? 'bg-[var(--surface-header)] font-medium text-white'
                                : 'bg-[var(--neutral-white)] text-[var(--grey-text)] hover:bg-[var(--surface-badge)] disabled:cursor-not-allowed disabled:opacity-40'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>

            <div className="relative">
                <select
                    aria-label="input-page"
                    value={perPage}
                    onChange={(e) => onPerPageChange(e.target.value)}
                    className="h-9 appearance-none rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3 pr-9 text-sm"
                >
                    {perPageOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt} per halaman</option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)]" />
            </div>
        </div>
    );
}