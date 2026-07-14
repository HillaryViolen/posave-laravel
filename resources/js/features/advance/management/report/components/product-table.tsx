import { Table, TableBody, TableCell, TableEmptyState, TableHead, TableHeader, TableRow } from '@/components';
import { useFilteredRows, type SortKey } from '@/features/advance/management/report/hooks';
import { cur, num, pct, runExport, type Cell, type CompanyInfo, type ReportExport } from '@/features/advance/management/report/lib';
import { formatNumber, formatPct, formatRupiah } from '@/lib/format';
import { useState } from 'react';
import { TableToolbar } from './table-toolbar';

export interface ProductRow {
    name: string;
    category: string;
    qty: number;
    omzet: number;
    hpp: number;
    margin: number;
    marginPct: number;
}

interface ProductTableProps {
    rows: ProductRow[];
    subtitle: string;
    periodSuffix: string;
    company: CompanyInfo;
}

export function ProductTable({ rows, subtitle, periodSuffix, company }: ProductTableProps) {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<SortKey>('omzet_desc');
    const data = useFilteredRows(rows, query, sort);

    const report: ReportExport = {
        title: 'Penjualan Barang',
        subtitle,
        company,
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
                <Table className="min-w-[680px]">
                    <TableHeader className="bg-[var(--surface-header)]">
                        <TableRow className="border-none hover:bg-[var(--surface-header)]">
                            <TableHead className="text-[var(--text-light)]">Nama Produk</TableHead>
                            <TableHead className="text-[var(--text-light)]">Kategori</TableHead>
                            <TableHead className="text-right text-[var(--text-light)]">Terjual</TableHead>
                            <TableHead className="text-right text-[var(--text-light)]">Penjualan</TableHead>
                            <TableHead className="text-right text-[var(--text-light)]">HPP</TableHead>
                            <TableHead className="text-right text-[var(--text-light)]">Margin</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableEmptyState colSpan={6} message="Belum ada produk terjual" />
                        ) : (
                            data.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell className="font-medium text-[var(--subheading)]">{row.name}</TableCell>
                                    <TableCell className="text-[var(--grey-text)]">{row.category}</TableCell>
                                    <TableCell className="text-right text-[var(--grey-text)]">{formatNumber(row.qty)}</TableCell>
                                    <TableCell className="text-right font-semibold text-[var(--subheading)]">{formatRupiah(row.omzet)}</TableCell>
                                    <TableCell className="text-right text-[var(--grey-text)]">{formatRupiah(row.hpp)}</TableCell>
                                    <TableCell className="text-right">
                                        <span className="font-semibold text-[var(--success)]">{formatRupiah(row.margin)}</span>
                                        <span className="ml-1 text-xs text-[var(--grey-text)]">({formatPct(row.marginPct)})</span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
