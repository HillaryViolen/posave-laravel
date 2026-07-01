import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { ExportFormat } from '../lib/export';

const ITEMS: { format: ExportFormat; label: string; icon: typeof Download }[] = [
    { format: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
    { format: 'pdf', label: 'PDF', icon: FileText },
    { format: 'csv', label: 'CSV', icon: Download },
];

export function ExportMenu({ onExport }: { onExport: (format: ExportFormat) => void | Promise<void> }) {
    const [busy, setBusy] = useState<ExportFormat | null>(null);

    const run = async (format: ExportFormat) => {
        try {
            setBusy(format);
            await onExport(format);
        } finally {
            setBusy(null);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    disabled={busy !== null}
                    className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--neutral-white)] px-3 text-sm font-medium text-[var(--subheading)] transition-colors hover:bg-[var(--second-accent)] disabled:opacity-60"
                >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Export
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[172px] border-[var(--border)] bg-[var(--neutral-white)] shadow-md">
                {ITEMS.map((item) => (
                    <DropdownMenuItem
                        key={item.format}
                        disabled={busy !== null}
                        onSelect={(e) => {
                            e.preventDefault();
                            void run(item.format);
                        }}
                        className="cursor-pointer gap-2 text-[var(--subheading)] focus:bg-[var(--second-accent)] focus:text-[var(--subheading)]"
                    >
                        <item.icon className="h-4 w-4 text-[var(--grey-text)]" />
                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
