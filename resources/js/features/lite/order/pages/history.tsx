import { HistoryDetailModal } from '@/features/lite/order/components';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { CalendarDays, ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { useRef, useState } from 'react';

type TransactionStatus = 'completed' | 'refunded' | 'void';
type CartItem = { name: string; price: number; qty: number };

type TransactionRow = {
    id: number;
    invoice: string;
    time: string;
    date: string;
    paymentMethod: string;
    total: number;
    status: TransactionStatus;
    items: CartItem[];
};

interface Props {
    transactions: TransactionRow[];
    filters: { date: string; payment_method: string };
}

const STATUS_LABEL: Record<TransactionStatus, string> = { completed: 'Selesai', refunded: 'Direfund', void: 'Dibatalkan' };
const STATUS_META: Record<TransactionStatus, { bg: string; text: string }> = {
    completed: { bg: 'var(--success-background)', text: 'var(--success)' },
    refunded: { bg: 'var(--warning-background)', text: 'var(--warning)' },
    void: { bg: 'var(--danger-background)', text: 'var(--danger)' },
};

const PAYMENT_CHIPS = [
    { value: 'all', label: 'Semua' },
    { value: 'cash', label: 'Tunai' },
    { value: 'qris', label: 'QRIS' },
    { value: 'debit', label: 'Debit' },
    { value: 'transfer', label: 'Transfer' },
];

export default function HistoryPage({ transactions, filters }: Props) {
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [selected, setSelected] = useState<TransactionRow | null>(null);

    const activeDate = new Date(filters.date + 'T00:00:00');
    const formattedDate = activeDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const goTo = (params: { date?: string; payment_method?: string }) => {
        router.get(
            route('lite.history.index'),
            { date: params.date ?? filters.date, payment_method: params.payment_method ?? filters.payment_method },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const prevDay = () => {
        const n = new Date(activeDate);
        n.setDate(n.getDate() - 1);
        goTo({ date: n.toISOString().split('T')[0] });
    };
    const nextDay = () => {
        const n = new Date(activeDate);
        n.setDate(n.getDate() + 1);
        goTo({ date: n.toISOString().split('T')[0] });
    };

    const totalHariIni = transactions.reduce((s, t) => s + t.total, 0);

    return (
        <DashboardSidebarLayout title="Riwayat Pesanan" description="Lihat semua penjualan yang sudah tercatat">
            <Head title="Riwayat Pesanan" />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-center gap-3 rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-3">
                    <button aria-label="Hari sebelumnya" onClick={prevDay} className="rounded-full p-2 hover:bg-[var(--second-accent)]">
                        <ChevronLeft className="h-5 w-5 text-[var(--subheading)]" />
                    </button>
                    <div
                        onClick={() => dateInputRef.current?.showPicker()}
                        className="flex cursor-pointer items-center gap-2 text-base font-bold text-[var(--subheading)]"
                    >
                        <CalendarDays className="h-5 w-5 text-[var(--grey-text)]" />
                        {formattedDate}
                        <input
                            aria-label="Pilih tanggal"
                            ref={dateInputRef}
                            type="date"
                            value={filters.date}
                            onChange={(e) => e.target.value && goTo({ date: e.target.value })}
                            className="pointer-events-none absolute h-0 w-0 opacity-0"
                        />
                    </div>
                    <button aria-label="Hari berikutnya" onClick={nextDay} className="rounded-full p-2 hover:bg-[var(--second-accent)]">
                        <ChevronRight className="h-5 w-5 text-[var(--subheading)]" />
                    </button>
                </div>

                {transactions.length > 0 && (
                    <div className="mb-4 flex items-center justify-between rounded-2xl border-2 border-[var(--surface-header)] bg-[var(--second-accent)] px-5 py-4">
                        <span className="text-base font-bold text-[var(--subheading)]">Total Hari Ini</span>
                        <span className="text-xl font-extrabold text-[var(--subheading)]">Rp {totalHariIni.toLocaleString('id-ID')}</span>
                    </div>
                )}

                <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                    {PAYMENT_CHIPS.map((chip) => (
                        <button
                            aria-label={`Filter metode ${chip.label}`}
                            key={chip.value}
                            onClick={() => goTo({ payment_method: chip.value })}
                            className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
                                filters.payment_method === chip.value
                                    ? 'border-[var(--surface-header)] bg-[var(--surface-header)] text-white'
                                    : 'border-[var(--border-strong)] text-[var(--grey-text)]'
                            }`}
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>

                {transactions.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--neutral-white)] py-16 text-center">
                        <ClipboardList className="mx-auto mb-3 h-10 w-10 text-[var(--grey-text)]" />
                        <p className="text-lg font-semibold text-[var(--subheading)]">Belum ada penjualan di tanggal ini</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {transactions.map((tx) => {
                            const meta = STATUS_META[tx.status];
                            return (
                                <button
                                    aria-label={`Lihat detail ${tx.invoice}`}
                                    key={tx.id}
                                    onClick={() => setSelected(tx)}
                                    className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-4 text-left shadow-sm transition hover:border-[var(--surface-header)]"
                                >
                                    <div>
                                        <p className="text-base font-bold text-[var(--subheading)]">{tx.invoice}</p>
                                        <p className="text-sm text-[var(--grey-text)]">
                                            {tx.time} · {tx.paymentMethod.toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-base font-extrabold text-[var(--subheading)]">
                                            Rp {tx.total.toLocaleString('id-ID')}
                                        </span>
                                        <span
                                            className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                                            style={{ backgroundColor: meta.bg, color: meta.text }}
                                        >
                                            {STATUS_LABEL[tx.status]}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {selected && <HistoryDetailModal transaction={selected} onClose={() => setSelected(null)} />}
        </DashboardSidebarLayout>
    );
}
