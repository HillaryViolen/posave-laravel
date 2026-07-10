import {
    CategorySlice,
    DeltaBadge,
    HourPoint,
    PaymentBreakdown,
    TrendMetric,
    TrendPoint,
    type PaymentSlice,
} from '@/features/advance/management/dashboard/components';
import { DashboardSidebarLayout } from '@/layouts';
import { formatNumber, formatPct, formatRupiah } from '@/lib/format';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowUpRight,
    Boxes,
    Clock,
    CreditCard,
    FileText,
    Package,
    Percent,
    PiggyBank,
    Plus,
    Receipt,
    ReceiptText,
    TrendingUp,
    UserPlus,
    Wallet,
} from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { SalesFilterBar, type OutletOption, type SalesFilters } from '../../../../../components/sales-filter-bar';

// Chart berbasis recharts di-lazy-load: shell dashboard (KPI, tabel, dsb) tampil
// instan, recharts di-split ke chunk terpisah dan dimuat setelah paint pertama.
const SalesTrendChart = lazy(() => import('../components/sales-trend-chart').then((m) => ({ default: m.SalesTrendChart })));
const HourlySalesChart = lazy(() => import('../components/hourly-sales-chart').then((m) => ({ default: m.HourlySalesChart })));
const CategoryDonut = lazy(() => import('../components/category-donut').then((m) => ({ default: m.CategoryDonut })));

function ChartSkeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse rounded-lg bg-[var(--second-accent)] ${className ?? 'h-[240px]'}`} />;
}

interface Kpi {
    value: number;
    previous: number;
    deltaPct: number;
}

interface Kpis {
    totalSales: Kpi;
    totalTransactions: Kpi;
    productsSold: Kpi;
    averageSale: Kpi;
    grossProfit: Kpi;
    margin: Kpi;
}

interface TopProduct {
    name: string;
    qty: number;
    omzet: number;
}

interface RecentTransaction {
    invoice: string;
    total: number;
    status: string;
    payment: string;
    time: string;
}

interface Props {
    filters: SalesFilters;
    outlets: OutletOption[];
    kpis: Kpis;
    salesTrend: TrendPoint[];
    hourlySales: HourPoint[];
    paymentBreakdown: PaymentSlice[];
    categorySummary: CategorySlice[];
    topProducts: TopProduct[];
    recentTransactions: RecentTransaction[];
}

const QUICK_ACTIONS = [
    {
        label: 'Tambah Produk',
        icon: Plus,
        routeName: 'dashboard.inventory.items.create',
        color: 'var(--income-icon-text)',
        bg: 'var(--income-icon-bg)',
    },
    { label: 'Lihat Produk', icon: Package, routeName: 'dashboard.inventory.items.index', color: 'var(--success)', bg: 'var(--success-background)' },
    { label: 'Tambah Karyawan', icon: UserPlus, routeName: '', color: 'var(--category-color-1)', bg: 'var(--category-bg-color-3)' },
    { label: 'Laporan Penjualan', icon: ReceiptText, routeName: 'dashboard.reports.index', color: 'var(--warning)', bg: 'var(--warning-background)' },
    { label: 'Laporan Stok', icon: FileText, routeName: '', color: 'var(--income-icon-text)', bg: 'var(--income-icon-bg)' },
    { label: 'Cetak Struk', icon: Receipt, routeName: '', color: 'var(--danger)', bg: 'var(--danger-background)' },
];

function KpiCard({
    icon: Icon,
    label,
    value,
    suffix,
    color,
    bg,
    delta,
}: {
    icon: typeof Wallet;
    label: string;
    value: string;
    suffix?: string;
    color: string;
    bg: string;
    delta: number;
}) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: bg, color }}>
                    <Icon className="h-5 w-5" />
                </div>
                <DeltaBadge value={delta} compact />
            </div>
            <div className="min-w-0">
                <p className="truncate text-xs font-medium text-[var(--grey-text)]">{label}</p>
                <div className="flex items-baseline gap-1">
                    <h3 className="truncate text-xl font-bold text-[var(--subheading)]">{value}</h3>
                    {suffix && <span className="text-xs text-[var(--grey-text)]">{suffix}</span>}
                </div>
            </div>
        </div>
    );
}

function quickActionHref(routeName: string) {
    return routeName ? route(routeName) : '#';
}

export default function Dashboard({
    filters,
    outlets,
    kpis,
    salesTrend,
    hourlySales,
    paymentBreakdown,
    categorySummary,
    topProducts,
    recentTransactions,
}: Props) {
    const [metric, setMetric] = useState<TrendMetric>('omzet');

    // Tombol "Cetak" di dashboard mengarahkan ke halaman Laporan (bawa filter aktif).
    const goToReports = () => {
        const params: Record<string, string> = { range: filters.range };
        if (filters.outlet_id) params.outlet_id = String(filters.outlet_id);
        if (filters.range === 'custom') {
            params.from = filters.from;
            params.to = filters.to;
        }
        router.get(route('dashboard.reports.index'), params);
    };

    return (
        <DashboardSidebarLayout title="Dashboard" description="Kelola semua kebutuhan anda disini">
            <Head title="Dashboard" />

            <div className="flex min-h-screen flex-col gap-6 bg-[var(--page-bg)] p-4 sm:p-6">
                <SalesFilterBar routeName="dashboard.index" outlets={outlets} filters={filters} onPrint={goToReports} />

                <p className="-mt-2 text-xs text-[var(--grey-text)]">
                    Menampilkan data <span className="font-medium text-[var(--subheading)]">{filters.label}</span> · dibandingkan dengan periode
                    sebelumnya.
                </p>

                {/* KPI */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
                    <KpiCard
                        icon={Wallet}
                        label="Total Penjualan"
                        value={formatRupiah(kpis.totalSales.value)}
                        color="var(--success)"
                        bg="var(--success-background)"
                        delta={kpis.totalSales.deltaPct}
                    />
                    <KpiCard
                        icon={Receipt}
                        label="Total Transaksi"
                        value={formatNumber(kpis.totalTransactions.value)}
                        color="var(--income-icon-text)"
                        bg="var(--income-icon-bg)"
                        delta={kpis.totalTransactions.deltaPct}
                    />
                    <KpiCard
                        icon={Boxes}
                        label="Produk Terjual"
                        value={formatNumber(kpis.productsSold.value)}
                        suffix="Item"
                        color="var(--warning)"
                        bg="var(--warning-background)"
                        delta={kpis.productsSold.deltaPct}
                    />
                    <KpiCard
                        icon={TrendingUp}
                        label="Rata-rata / Transaksi"
                        value={formatRupiah(kpis.averageSale.value)}
                        color="var(--category-color-1)"
                        bg="var(--category-bg-color-3)"
                        delta={kpis.averageSale.deltaPct}
                    />
                    <KpiCard
                        icon={PiggyBank}
                        label="Laba Kotor"
                        value={formatRupiah(kpis.grossProfit.value)}
                        color="var(--success)"
                        bg="var(--success-background)"
                        delta={kpis.grossProfit.deltaPct}
                    />
                    <KpiCard
                        icon={Percent}
                        label="Margin"
                        value={formatPct(kpis.margin.value)}
                        color="var(--income-icon-text)"
                        bg="var(--income-icon-bg)"
                        delta={kpis.margin.deltaPct}
                    />
                </div>

                {/* Tren + kategori */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6 lg:col-span-8">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold text-[var(--subheading)]">Grafik Penjualan</h3>
                                    <DeltaBadge value={kpis.totalSales.deltaPct} compact />
                                </div>
                                <p className="mt-1 text-2xl font-bold text-[var(--subheading)]">
                                    {metric === 'omzet'
                                        ? formatRupiah(kpis.totalSales.value)
                                        : `${formatNumber(kpis.totalTransactions.value)} transaksi`}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <MetricToggle metric={metric} onChange={setMetric} />
                                <Link
                                    href={route('dashboard.reports.index')}
                                    className="flex items-center gap-1 text-xs font-medium text-[var(--secondary-700)] hover:underline"
                                >
                                    Lihat Laporan
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                        <Suspense fallback={<ChartSkeleton className="h-[260px]" />}>
                            <SalesTrendChart data={salesTrend} metric={metric} />
                        </Suspense>
                        <div className="mt-2 flex items-center gap-4 text-[11px] text-[var(--grey-text)]">
                            <span className="flex items-center gap-1.5">
                                <span className="h-2 w-4 rounded-full bg-[#377ba3]" /> Periode ini
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-0.5 w-4 rounded-full bg-[#cbd5e1]" /> Periode sebelumnya
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6 lg:col-span-4">
                        <h3 className="mb-4 text-sm font-semibold text-[var(--subheading)]">Ringkasan Kategori</h3>
                        <Suspense fallback={<ChartSkeleton className="h-[240px]" />}>
                            <CategoryDonut data={categorySummary} />
                        </Suspense>
                    </div>
                </div>

                {/* Jam ramai + metode pembayaran */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6 lg:col-span-8">
                        <div className="mb-4 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-[var(--grey-text)]" />
                            <h3 className="text-sm font-semibold text-[var(--subheading)]">Jam Ramai</h3>
                            <span className="text-xs text-[var(--grey-text)]">— penjualan per jam</span>
                        </div>
                        <Suspense fallback={<ChartSkeleton className="h-[220px]" />}>
                            <HourlySalesChart data={hourlySales} />
                        </Suspense>
                    </div>

                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6 lg:col-span-4">
                        <div className="mb-4 flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-[var(--grey-text)]" />
                            <h3 className="text-sm font-semibold text-[var(--subheading)]">Metode Pembayaran</h3>
                        </div>
                        <PaymentBreakdown data={paymentBreakdown} />
                    </div>
                </div>

                {/* Produk terlaris + transaksi terbaru + aksi cepat */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6 lg:col-span-4">
                        <h3 className="mb-4 text-sm font-semibold text-[var(--subheading)]">Produk Terlaris</h3>
                        {topProducts.length === 0 ? (
                            <p className="py-8 text-center text-sm text-[var(--grey-text)]">Belum ada data</p>
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {topProducts.map((product, i) => (
                                    <li key={product.name} className="flex items-center gap-3">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--second-accent)] text-xs font-semibold text-[var(--subheading)]">
                                            {i + 1}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-[var(--subheading)]">{product.name}</p>
                                            <p className="text-xs text-[var(--grey-text)]">{formatNumber(product.qty)} Terjual</p>
                                        </div>
                                        <span className="shrink-0 text-sm font-semibold text-[var(--subheading)]">{formatRupiah(product.omzet)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6 lg:col-span-4">
                        <h3 className="mb-4 text-sm font-semibold text-[var(--subheading)]">Transaksi Terbaru</h3>
                        {recentTransactions.length === 0 ? (
                            <p className="py-8 text-center text-sm text-[var(--grey-text)]">Belum ada transaksi</p>
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {recentTransactions.map((trx) => (
                                    <li key={trx.invoice} className="flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-[var(--subheading)]">{trx.invoice}</p>
                                            <p className="text-xs text-[var(--grey-text)]">{trx.time}</p>
                                        </div>
                                        <div className="flex shrink-0 flex-col items-end gap-1">
                                            <span className="text-sm font-semibold text-[var(--subheading)]">{formatRupiah(trx.total)}</span>
                                            <StatusBadge status={trx.status} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6 lg:col-span-4">
                        <h3 className="mb-4 text-sm font-semibold text-[var(--subheading)]">Aksi Cepat</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {QUICK_ACTIONS.map((action) => (
                                <Link
                                    key={action.label}
                                    href={quickActionHref(action.routeName)}
                                    className="flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] p-3 text-center transition-colors hover:bg-[var(--second-accent)]"
                                >
                                    <span
                                        className="flex h-10 w-10 items-center justify-center rounded-full"
                                        style={{ backgroundColor: action.bg, color: action.color }}
                                    >
                                        <action.icon className="h-5 w-5" />
                                    </span>
                                    <span className="text-[11px] leading-tight font-medium text-[var(--grey-text)]">{action.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}

function MetricToggle({ metric, onChange }: { metric: TrendMetric; onChange: (m: TrendMetric) => void }) {
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

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; color: string; bg: string }> = {
        completed: { label: 'Selesai', color: 'var(--success)', bg: 'var(--success-background)' },
        refunded: { label: 'Refund', color: 'var(--warning)', bg: 'var(--warning-background)' },
        void: { label: 'Batal', color: 'var(--danger)', bg: 'var(--danger-background)' },
    };
    const s = map[status] ?? map.completed;
    return (
        <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: s.bg, color: s.color }}>
            {s.label}
        </span>
    );
}
