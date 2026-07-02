import { Input } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardSidebarLayout } from '@/layouts';
import { formatNumber, formatPct, formatRupiah } from '@/lib/format';
import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SalesFilterBar, type OutletOption, type SalesFilters } from '../../components/sales-filter-bar';
import { DeltaBadge } from '../../dashboard/components/delta-badge';
import { ExportMenu } from '../components/export-menu';
import { cur, num, pct, runExport, type Cell, type CompanyInfo, type ExportColumn, type ExportFormat, type ReportExport } from '../lib/export';

// Kop usaha untuk header PDF. Sementara statis; nanti bisa dari Company Profile.
const COMPANY: CompanyInfo = { name: 'Posave' };

interface Statement {
    grossSales: number;
    discounts: number;
    refunds: number;
    nettSales: number;
    gratuity: number;
    tax: number;
    rounding: number;
    totalCollected: number;
    cogs: number;
    grossProfit: number;
    margin: number;
}

interface ProductRow {
    name: string;
    category: string;
    qty: number;
    omzet: number;
    hpp: number;
    margin: number;
    marginPct: number;
}

interface CategoryRow {
    name: string;
    qty: number;
    omzet: number;
    hpp: number;
    margin: number;
    marginPct: number;
}

interface Props {
    filters: SalesFilters;
    outlets: OutletOption[];
    statement: { current: Statement; previous: Statement };
    productSales: ProductRow[];
    categorySales: CategoryRow[];
}

type TabKey = 'penjualan' | 'laba' | 'produk' | 'kategori';

const TABS: { key: TabKey; label: string }[] = [
    { key: 'penjualan', label: 'Laporan Penjualan' },
    { key: 'laba', label: 'Laba Kotor' },
    { key: 'produk', label: 'Penjualan Barang' },
    { key: 'kategori', label: 'Kategori Penjualan' },
];

interface Line {
    label: string;
    current: number;
    previous: number;
    deduction?: boolean;
    bold?: boolean;
    format?: 'currency' | 'percent';
}

function deltaPct(current: number, previous: number): number {
    if (!previous) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10;
}

const STATEMENT_COLUMNS: ExportColumn[] = [
    { header: 'Keterangan', align: 'left', width: 34 },
    { header: 'Periode Ini', align: 'right' },
    { header: 'Periode Lalu', align: 'right' },
    { header: 'Perubahan %', align: 'right' },
];

export default function Report({ filters, outlets, statement, productSales, categorySales }: Props) {
    const [tab, setTab] = useState<TabKey>('penjualan');
    const { current, previous } = statement;

    const outletName = filters.outlet_id ? (outlets.find((o) => o.id === filters.outlet_id)?.name ?? 'Outlet') : 'Semua Outlet';
    const subtitle = `Periode ${filters.label} · ${outletName}`;
    const periodSuffix = `${filters.from}_sd_${filters.to}`;

    const salesLines: Line[] = [
        { label: 'Gross Sales', current: current.grossSales, previous: previous.grossSales },
        { label: 'Discounts', current: current.discounts, previous: previous.discounts, deduction: true },
        { label: 'Refunds', current: current.refunds, previous: previous.refunds, deduction: true },
        { label: 'Nett Sales', current: current.nettSales, previous: previous.nettSales, bold: true },
        { label: 'Gratuity', current: current.gratuity, previous: previous.gratuity },
        { label: 'Tax', current: current.tax, previous: previous.tax },
        { label: 'Rounding', current: current.rounding, previous: previous.rounding },
        { label: 'Total Collected', current: current.totalCollected, previous: previous.totalCollected, bold: true },
    ];

    const labaLines: Line[] = [
        { label: 'Gross Sales', current: current.grossSales, previous: previous.grossSales },
        { label: 'Discounts', current: current.discounts, previous: previous.discounts, deduction: true },
        { label: 'Refunds', current: current.refunds, previous: previous.refunds, deduction: true },
        { label: 'Nett Sales', current: current.nettSales, previous: previous.nettSales, bold: true },
        { label: 'Cost of Goods Sold (COGS)', current: current.cogs, previous: previous.cogs, deduction: true },
        { label: 'Laba Kotor', current: current.grossProfit, previous: previous.grossProfit, bold: true },
        { label: 'Margin', current: current.margin, previous: previous.margin, bold: true, format: 'percent' },
    ];

    const buildStatementExport = (lines: Line[], title: string, filenameBase: string): ReportExport => ({
        title,
        subtitle,
        company: COMPANY,
        columns: STATEMENT_COLUMNS,
        filenameBase: `${filenameBase}-${periodSuffix}`,
        boldRows: lines.flatMap((l, i) => (l.bold ? [i] : [])),
        rows: lines.map((l): Cell[] => [
            l.label,
            l.format === 'percent' ? pct(l.current) : cur(l.current),
            l.format === 'percent' ? pct(l.previous) : cur(l.previous),
            pct(deltaPct(l.current, l.previous)),
        ]),
    });

    return (
        <DashboardSidebarLayout title="Laporan" description="Lihat dan kelola ringkasan dari penjualan anda">
            <Head title="Laporan" />

            <div className="flex min-h-screen flex-col gap-6 bg-[var(--page-bg)] p-4 sm:p-6">
                <SalesFilterBar routeName="dashboard.reports.index" outlets={outlets} filters={filters} showPrint={false} />

                <p className="-mt-2 text-xs text-[var(--grey-text)]">
                    Periode <span className="font-medium text-[var(--subheading)]">{filters.label}</span> · dibandingkan periode sebelumnya.
                </p>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Sub-nav laporan */}
                    <nav className="flex flex-row flex-wrap gap-2 lg:col-span-3 lg:flex-col">
                        {TABS.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                                    tab === t.key
                                        ? 'bg-[var(--surface-header)] text-[var(--text-light)]'
                                        : 'bg-[var(--neutral-white)] text-[var(--grey-text)] hover:bg-[var(--second-accent)]'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </nav>

                    {/* Konten laporan */}
                    <div className="lg:col-span-9">
                        {tab === 'penjualan' && <StatementCard lines={salesLines} report={buildStatementExport(salesLines, 'Laporan Penjualan', 'laporan-penjualan')} />}
                        {tab === 'laba' && (
                            <StatementCard
                                lines={labaLines}
                                note="Laba Kotor adalah Nett Sales dikurangi Harga Pokok Penjualan (COGS). Pastikan semua produk memiliki COGS agar laba kotor akurat."
                                report={buildStatementExport(labaLines, 'Laba Kotor', 'laba-kotor')}
                            />
                        )}
                        {tab === 'produk' && <ProductTable rows={productSales} subtitle={subtitle} periodSuffix={periodSuffix} />}
                        {tab === 'kategori' && <CategoryTable rows={categorySales} subtitle={subtitle} periodSuffix={periodSuffix} />}
                    </div>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}

function lineValue(line: Line): string {
    if (line.format === 'percent') return formatPct(line.current);
    const formatted = formatRupiah(line.current);
    return line.deduction && line.current > 0 ? `− ${formatted}` : formatted;
}

function StatementCard({ lines, note, report }: { lines: Line[]; note?: string; report: ReportExport }) {
    return (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
                {note ? <p className="text-sm leading-relaxed text-[var(--grey-text)]">{note}</p> : <span />}
                <ExportMenu onExport={(f) => runExport(f, report)} />
            </div>

            {/* Header kolom */}
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-t-md bg-[var(--surface-header)] px-4 py-2.5 text-xs font-medium text-[var(--text-light)] sm:grid-cols-[1fr_140px_140px_90px]">
                <span>Keterangan</span>
                <span className="text-right">Periode Ini</span>
                <span className="hidden text-right sm:block">Periode Lalu</span>
                <span className="hidden text-right sm:block">Δ</span>
            </div>

            <dl className="divide-y divide-[var(--border)]">
                {lines.map((line) => (
                    <div key={line.label} className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3.5 sm:grid-cols-[1fr_140px_140px_90px]">
                        <dt className={`text-sm ${line.bold ? 'font-semibold text-[var(--subheading)]' : 'text-[var(--grey-text)]'}`}>{line.label}</dt>
                        <dd
                            className={`text-right text-sm ${line.bold ? 'font-bold text-[var(--subheading)]' : 'font-medium text-[var(--grey-text)]'} ${
                                line.deduction && line.current > 0 ? 'text-[var(--danger)]' : ''
                            }`}
                        >
                            {lineValue(line)}
                        </dd>
                        <dd className="hidden text-right text-sm text-[var(--grey-text)] sm:block">
                            {line.format === 'percent' ? formatPct(line.previous) : formatRupiah(line.previous)}
                        </dd>
                        <dd className="hidden justify-end sm:flex">
                            <DeltaBadge value={deltaPct(line.current, line.previous)} invert={line.deduction} compact />
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

type SortKey = 'omzet_desc' | 'omzet_asc' | 'margin_desc' | 'name_asc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: 'omzet_desc', label: 'Penjualan Tertinggi' },
    { value: 'omzet_asc', label: 'Penjualan Terendah' },
    { value: 'margin_desc', label: 'Margin Tertinggi' },
    { value: 'name_asc', label: 'Nama A–Z' },
];

function useFilteredRows<T extends { name: string; omzet: number; margin: number }>(rows: T[], query: string, sort: SortKey): T[] {
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

function TableToolbar({
    query,
    setQuery,
    sort,
    setSort,
    onExport,
}: {
    query: string;
    setQuery: (v: string) => void;
    sort: SortKey;
    setSort: (v: SortKey) => void;
    onExport: (format: ExportFormat) => void | Promise<void>;
}) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="relative max-w-xs flex-1">
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari…" className="h-10 border-[var(--border)] bg-[var(--neutral-white)] pr-10" />
                <Search className="absolute top-2.5 right-3 h-5 w-5 text-[var(--grey-text)]" />
            </div>
            <div className="flex items-center gap-3">
                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                    <SelectTrigger className="h-10 min-w-[170px] border-[var(--border)] bg-[var(--neutral-white)] text-[var(--subheading)]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {SORT_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                                {o.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <ExportMenu onExport={onExport} />
            </div>
        </div>
    );
}

function ProductTable({ rows, subtitle, periodSuffix }: { rows: ProductRow[]; subtitle: string; periodSuffix: string }) {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<SortKey>('omzet_desc');
    const data = useFilteredRows(rows, query, sort);

    const report: ReportExport = {
        title: 'Penjualan Barang',
        subtitle,
        company: COMPANY,
        columns: [
            { header: 'Nama Produk', align: 'left', width: 32 },
            { header: 'Kategori', align: 'left', width: 20 },
            { header: 'Terjual', align: 'right' },
            { header: 'Penjualan', align: 'right' },
            { header: 'HPP', align: 'right' },
            { header: 'Margin', align: 'right' },
            { header: 'Margin %', align: 'right' },
        ],
        filenameBase: `penjualan-barang-${periodSuffix}`,
        rows: data.map((r): Cell[] => [r.name, r.category, num(r.qty), cur(r.omzet), cur(r.hpp), cur(r.margin), pct(r.marginPct)]),
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] shadow-sm">
            <TableToolbar query={query} setQuery={setQuery} sort={sort} setSort={setSort} onExport={(f) => runExport(f, report)} />
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--surface-header)] text-[var(--text-light)]">
                        <tr>
                            <th className="px-6 py-3.5 font-medium">Nama Produk</th>
                            <th className="px-6 py-3.5 font-medium">Kategori</th>
                            <th className="px-6 py-3.5 text-right font-medium">Terjual</th>
                            <th className="px-6 py-3.5 text-right font-medium">Penjualan</th>
                            <th className="px-6 py-3.5 text-right font-medium">HPP</th>
                            <th className="px-6 py-3.5 text-right font-medium">Margin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-[var(--grey-text)]">
                                    Belum ada produk terjual
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.name} className="border-b border-[var(--border)] last:border-0">
                                    <td className="px-6 py-3.5 font-medium text-[var(--subheading)]">{row.name}</td>
                                    <td className="px-6 py-3.5 text-[var(--grey-text)]">{row.category}</td>
                                    <td className="px-6 py-3.5 text-right text-[var(--grey-text)]">{formatNumber(row.qty)}</td>
                                    <td className="px-6 py-3.5 text-right font-semibold text-[var(--subheading)]">{formatRupiah(row.omzet)}</td>
                                    <td className="px-6 py-3.5 text-right text-[var(--grey-text)]">{formatRupiah(row.hpp)}</td>
                                    <td className="px-6 py-3.5 text-right">
                                        <span className="font-semibold text-[var(--success)]">{formatRupiah(row.margin)}</span>
                                        <span className="ml-1 text-xs text-[var(--grey-text)]">({formatPct(row.marginPct)})</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function CategoryTable({ rows, subtitle, periodSuffix }: { rows: CategoryRow[]; subtitle: string; periodSuffix: string }) {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<SortKey>('omzet_desc');
    const data = useFilteredRows(rows, query, sort);

    const report: ReportExport = {
        title: 'Kategori Penjualan',
        subtitle,
        company: COMPANY,
        columns: [
            { header: 'Nama Kategori', align: 'left', width: 28 },
            { header: 'Terjual', align: 'right' },
            { header: 'Penjualan', align: 'right' },
            { header: 'HPP', align: 'right' },
            { header: 'Margin', align: 'right' },
            { header: 'Margin %', align: 'right' },
        ],
        filenameBase: `kategori-penjualan-${periodSuffix}`,
        rows: data.map((r): Cell[] => [r.name, num(r.qty), cur(r.omzet), cur(r.hpp), cur(r.margin), pct(r.marginPct)]),
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] shadow-sm">
            <TableToolbar query={query} setQuery={setQuery} sort={sort} setSort={setSort} onExport={(f) => runExport(f, report)} />
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--surface-header)] text-[var(--text-light)]">
                        <tr>
                            <th className="px-6 py-3.5 font-medium">Nama Kategori</th>
                            <th className="px-6 py-3.5 text-right font-medium">Terjual</th>
                            <th className="px-6 py-3.5 text-right font-medium">Penjualan</th>
                            <th className="px-6 py-3.5 text-right font-medium">HPP</th>
                            <th className="px-6 py-3.5 text-right font-medium">Margin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-[var(--grey-text)]">
                                    Belum ada kategori terjual
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.name} className="border-b border-[var(--border)] last:border-0">
                                    <td className="px-6 py-3.5 font-medium text-[var(--subheading)]">{row.name}</td>
                                    <td className="px-6 py-3.5 text-right text-[var(--grey-text)]">{formatNumber(row.qty)}</td>
                                    <td className="px-6 py-3.5 text-right font-semibold text-[var(--subheading)]">{formatRupiah(row.omzet)}</td>
                                    <td className="px-6 py-3.5 text-right text-[var(--grey-text)]">{formatRupiah(row.hpp)}</td>
                                    <td className="px-6 py-3.5 text-right">
                                        <span className="font-semibold text-[var(--success)]">{formatRupiah(row.margin)}</span>
                                        <span className="ml-1 text-xs text-[var(--grey-text)]">({formatPct(row.marginPct)})</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
