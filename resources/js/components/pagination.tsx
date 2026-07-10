import { router } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

export function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) return null; // cuma prev/current/next = gak ada isinya buat dipilih

    return (
        <div className="mt-4 flex items-center justify-center gap-1">
            {links.map((link, i) => (
                <button
                    key={i}
                    aria-label={`Navigasi halaman ${link.label.replace(/<[^>]+>/g, '')}`}
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
    );
}
