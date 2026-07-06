import type { TrendMetric } from './sales-trend-chart';

/** Pengalih metrik grafik penjualan: omzet ↔ jumlah transaksi. */
export function MetricToggle({ metric, onChange }: { metric: TrendMetric; onChange: (m: TrendMetric) => void }) {
    const options: { value: TrendMetric; label: string }[] = [
        { value: 'omzet', label: 'Penjualan' },
        { value: 'transaksi', label: 'Transaksi' },
    ];
    return (
        <div className="flex h-9 items-center rounded-md border border-[var(--border)] bg-[var(--neutral-white)] p-1">
            {options.map((o) => (
                <button
                    key={o.value}
                    onClick={() => onChange(o.value)}
                    className={`h-full rounded px-3 text-xs font-medium transition-colors ${
                        metric === o.value
                            ? 'bg-[var(--surface-header)] text-[var(--text-light)]'
                            : 'text-[var(--grey-text)] hover:bg-[var(--second-accent)]'
                    }`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}
