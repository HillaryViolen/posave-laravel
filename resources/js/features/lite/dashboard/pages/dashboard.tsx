import { DashboardSidebarLayout } from '@/layouts';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, ArrowUpRight, Package, Receipt, TrendingUp } from 'lucide-react';

interface TopItem {
    name: string;
    qty: number;
    omzet: number;
}
interface RecentTx {
    invoice: string;
    total: number;
    payment: string;
    time: string;
}

interface Props {
    filters: { range: string; label: string };
    kpis: { totalSales: number; totalTransactions: number; productsSold: number };
    stockSummary: { out_of_stock: number; low_stock: number };
    topItems: TopItem[];
    recentTransactions: RecentTx[];
}

const RANGE_CHIPS = [
    { value: 'today', label: 'Hari Ini' },
    { value: '7d', label: 'Minggu Ini' },
    { value: '30d', label: 'Bulan Ini' },
];

export default function LiteDashboard({ filters, kpis, stockSummary, topItems, recentTransactions }: Props) {
    const changeRange = (range: string) => {
        router.get(route('dashboard.index'), { range }, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <DashboardSidebarLayout title="Beranda" description="Ringkasan usaha kamu">
            <Head title="Dashboard" />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
                    {RANGE_CHIPS.map((chip) => (
                        <button
                            aria-label={`Tampilkan data ${chip.label}`}
                            key={chip.value}
                            onClick={() => changeRange(chip.value)}
                            className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
                                filters.range === chip.value
                                    ? 'border-[var(--surface-header)] bg-[var(--surface-header)] text-white'
                                    : 'border-[var(--border-strong)] text-[var(--grey-text)]'
                            }`}
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>

                {/* KPI besar, plain, gak ada persentase perubahan yang bikin bingung */}
                <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success-background)]">
                            <TrendingUp className="h-5 w-5 text-[var(--success)]" />
                        </div>
                        <p className="text-sm text-[var(--grey-text)]">Total Penjualan</p>
                        <p className="text-2xl font-extrabold text-[var(--subheading)]">Rp {kpis.totalSales.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--income-icon-bg)]">
                            <Receipt className="h-5 w-5 text-[var(--income-icon-text)]" />
                        </div>
                        <p className="text-sm text-[var(--grey-text)]">Jumlah Transaksi</p>
                        <p className="text-2xl font-extrabold text-[var(--subheading)]">{kpis.totalTransactions}</p>
                    </div>
                    <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--warning-background)]">
                            <Package className="h-5 w-5 text-[var(--warning)]" />
                        </div>
                        <p className="text-sm text-[var(--grey-text)]">Barang Terjual</p>
                        <p className="text-2xl font-extrabold text-[var(--subheading)]">{kpis.productsSold}</p>
                    </div>
                </div>

                {/* Alert stok — sama polanya kayak di Daftar Barang, klik langsung ke sana */}
                {(stockSummary.out_of_stock > 0 || stockSummary.low_stock > 0) && (
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                        {stockSummary.out_of_stock > 0 && (
                            <Link
                                href={route('lite.inventory.items.index', { stock_status: 'out' })}
                                className="flex flex-1 items-center justify-between rounded-2xl border-2 border-[var(--danger)] bg-[var(--danger-background)] px-5 py-4"
                            >
                                <span className="flex items-center gap-2 text-base font-bold text-[var(--danger)]">
                                    <AlertTriangle className="h-5 w-5" />
                                    {stockSummary.out_of_stock} Barang Habis
                                </span>
                                <ArrowUpRight className="h-5 w-5 text-[var(--danger)]" />
                            </Link>
                        )}
                        {stockSummary.low_stock > 0 && (
                            <Link
                                href={route('lite.inventory.items.index', { stock_status: 'low' })}
                                className="flex flex-1 items-center justify-between rounded-2xl border-2 border-[var(--warning)] bg-[var(--warning-background)] px-5 py-4"
                            >
                                <span className="flex items-center gap-2 text-base font-bold text-[var(--warning)]">
                                    <AlertTriangle className="h-5 w-5" />
                                    {stockSummary.low_stock} Barang Mau Habis
                                </span>
                                <ArrowUpRight className="h-5 w-5 text-[var(--warning)]" />
                            </Link>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm">
                        <h3 className="mb-4 text-base font-bold text-[var(--subheading)]">Barang Terlaris</h3>
                        {topItems.length === 0 ? (
                            <p className="py-6 text-center text-sm text-[var(--grey-text)]">Belum ada penjualan</p>
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {topItems.map((item, i) => (
                                    <li key={item.name} className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--second-accent)] text-sm font-bold text-[var(--subheading)]">
                                            {i + 1}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-[var(--subheading)]">{item.name}</p>
                                            <p className="text-xs text-[var(--grey-text)]">{item.qty} terjual</p>
                                        </div>
                                        <span className="shrink-0 text-sm font-bold text-[var(--subheading)]">
                                            Rp {item.omzet.toLocaleString('id-ID')}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-base font-bold text-[var(--subheading)]">Transaksi Terbaru</h3>
                            <Link href={route('lite.history.index')} className="text-sm font-semibold text-[var(--surface-header)] hover:underline">
                                Lihat Semua
                            </Link>
                        </div>
                        {recentTransactions.length === 0 ? (
                            <p className="py-6 text-center text-sm text-[var(--grey-text)]">Belum ada transaksi</p>
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {recentTransactions.map((tx) => (
                                    <li key={tx.invoice} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--subheading)]">{tx.invoice}</p>
                                            <p className="text-xs text-[var(--grey-text)]">{tx.time}</p>
                                        </div>
                                        <span className="text-sm font-bold text-[var(--subheading)]">Rp {tx.total.toLocaleString('id-ID')}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
