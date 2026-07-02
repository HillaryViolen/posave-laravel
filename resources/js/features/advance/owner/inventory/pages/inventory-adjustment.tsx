import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Search, Plus, Printer, ArrowUpDown, Package,
    MoreVertical, ChevronLeft, ChevronRight, Calendar, ChevronDown, Store
} from 'lucide-react';
import { DashboardSidebarLayout } from '@/layouts';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { InventoryAdjustmentCreateModal } from '../components/inventory-adjustment-create-modal';
import { InventoryAdjustmentActionsMenu, type Adjustment } from '../components/inventory-adjustment-actions-menu';

interface InventoryAdjustmentProps {
    adjustments: {
        data: Adjustment[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number;
        to: number;
        total: number;
    };
    stats: {
        total_changes: number;
        items_changed: number;
        total_income: number;
        total_expense: number;
    };
    inventoryItems: { id: number; name: string; sku: string; price: number }[];
    filters: { date?: string; search?: string; branch?: string; status?: string };
}

export default function InventoryAdjustment({ adjustments, stats, inventoryItems, filters }: InventoryAdjustmentProps) {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const [openStatusFilter, setOpenStatusFilter] = useState(false);
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    const currentDate = filters.date ?? new Date().toISOString().slice(0, 10);

    const applyFilters = (overrides: Record<string, string | undefined>) => {
        router.get(
            route('dashboard.inventory.adjustments.index'),
            { ...filters, ...overrides },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const shiftDate = (days: number) => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + days);
        applyFilters({ date: d.toISOString().slice(0, 10) });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: search || undefined });
    };

    const toggleMenu = (id: number) => {
        if (openMenuId === id) { setOpenMenuId(null); return; }
        const btn = buttonRefs.current[id];
        if (btn) {
            const rect = btn.getBoundingClientRect();
            setMenuPosition({ top: rect.bottom + window.scrollY + 4, left: rect.right + window.scrollX - 144 });
        }
        setOpenMenuId(id);
    };

    const closeMenu = () => setOpenMenuId(null);

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus riwayat ini? Stok barang akan dikembalikan.')) {
            router.delete(route('dashboard.inventory.adjustments.destroy', id));
        }
        closeMenu();
    };

    const groupedAdjustments = adjustments.data.reduce<Record<string, Adjustment[]>>((acc, row) => {
        const dateKey = new Date(row.date).toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(row);
        return acc;
    }, {});

    const activeMenuAdj = adjustments.data.find((a) => a.id === openMenuId);
    const formattedDate = new Date(currentDate).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const statusOptions = [
        { value: '', label: 'Semua' },
        { value: 'in', label: 'Masuk' },
        { value: 'out', label: 'Keluar' },
    ];

    const activeStatusLabel = statusOptions.find(s => s.value === (filters.status ?? ''))?.label ?? 'Semua';

    return (
        <DashboardSidebarLayout title="Perubahan" description="Catat semua perubahan stok barang anda (penyesuaian)">
            <Head title="Perubahan Stok" />

            <div className="flex flex-col gap-6 p-6">

                {/* Toolbar */}
                <div className="flex flex-col gap-3 rounded-xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-4 shadow-sm">

                    {/* Baris 1: Outlet + Tanggal + Aksi */}
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="flex items-center gap-2 bg-[var(--second-accent)] text-[var(--subheading)]">
                                <Store className="h-4 w-4" />
                                OUTLET 1
                                <ChevronDown className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center rounded-lg border border-[var(--border-strong)] bg-white px-2 py-1.5">
                                <button onClick={() => shiftDate(-1)} className="p-1 text-[var(--grey-text)] hover:text-[var(--subheading)]">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <div className="flex items-center gap-2 px-3 text-sm font-medium text-[var(--subheading)]">
                                    <Calendar className="h-4 w-4 text-[var(--grey-text)]" />
                                    {formattedDate}
                                </div>
                                <button onClick={() => shiftDate(1)} className="p-1 text-[var(--grey-text)] hover:text-[var(--subheading)]">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Perubahan
                            </Button>
                            <Button variant="outline" className="bg-[var(--neutral-white)]">
                                <Printer className="mr-2 h-4 w-4" />
                                Cetak
                            </Button>
                        </div>
                    </div>

                    {/* Baris 2: Search + Filter Status */}
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleSearch} className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)]" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search"
                                className="w-full rounded-lg border border-[var(--border-strong)] bg-white py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                        </form>

                        <div className="relative">
                            <Button
                                variant="outline"
                                className="bg-[var(--neutral-white)] text-[var(--subheading)]"
                                onClick={() => setOpenStatusFilter(!openStatusFilter)}
                            >
                                {activeStatusLabel}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>

                            {openStatusFilter && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setOpenStatusFilter(false)} />
                                    <div className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-xl bg-[var(--neutral-white)] py-1 shadow-lg">
                                        {statusOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => {
                                                    applyFilters({ status: opt.value || undefined });
                                                    setOpenStatusFilter(false);
                                                }}
                                                className={`flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-badge)] ${
                                                    (filters.status ?? '') === opt.value
                                                        ? 'font-semibold text-[var(--subheading)]'
                                                        : 'text-[var(--grey-text)]'
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-4 rounded-xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100">
                            <ArrowUpDown className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[var(--subheading)]">{stats.total_changes}</p>
                            <p className="text-sm font-medium text-[var(--subheading)]">Perubahan</p>
                            <p className="whitespace-nowrap text-xs text-[var(--grey-text)]">Total Transaksi Perubahan</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50">
                            <Package className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[var(--subheading)]">{stats.items_changed}</p>
                            <p className="text-sm font-medium text-[var(--subheading)]">Item dirubah</p>
                            <p className="whitespace-nowrap text-xs text-[var(--grey-text)]">Jumlah item yang disesuaikan</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                            Rp
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[var(--subheading)]">
                                {Number(stats.total_income).toLocaleString('id-ID')}
                            </p>
                            <p className="text-sm font-medium text-[var(--subheading)]">Total Pemasukan</p>
                            <p className="whitespace-nowrap text-xs text-[var(--grey-text)]">Dari penyesuaian stok</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-5 shadow-sm">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-500">
                            Rp
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[var(--subheading)]">
                                {Math.abs(Number(stats.total_expense)).toLocaleString('id-ID')}
                            </p>
                            <p className="text-sm font-medium text-[var(--subheading)]">Total Pengeluaran</p>
                            <p className="whitespace-nowrap text-xs text-[var(--grey-text)]">Dari penyesuaian stok</p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                    <Table>
                        <TableHeader className="bg-[var(--surface-header)]">
                            <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                <TableHead className="text-[var(--text-light)]">Tanggal Perubahan</TableHead>
                                <TableHead className="text-[var(--text-light)]">Catatan</TableHead>
                                <TableHead className="text-[var(--text-light)]">Barang</TableHead>
                                <TableHead className="text-[var(--text-light)]">Perubahan</TableHead>
                                <TableHead className="text-[var(--text-light)]">Pemasukan/Pengeluaran</TableHead>
                                <TableHead className="w-[60px] text-center text-[var(--text-light)]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {adjustments.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-12 text-center">
                                        <Package className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                                        <p className="font-medium text-[var(--subheading)]">Belum ada data perubahan</p>
                                        <p className="mb-4 text-sm text-[var(--grey-text)]">Klik tombol Buat Perubahan untuk mencatat stok</p>
                                        <Button onClick={() => setShowCreateModal(true)} variant="outline">
                                            + Buat Perubahan
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                Object.entries(groupedAdjustments).map(([dateLabel, rows]) => (
                                    <React.Fragment key={dateLabel}>
                                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                                            <TableCell colSpan={5}>
                                                <div className="flex items-center gap-2 text-sm font-medium text-[var(--subheading)]">
                                                    <Calendar className="h-4 w-4 text-[var(--grey-text)]" />
                                                    {dateLabel}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-sm font-medium text-[var(--subheading)]">
                                                {rows.length} Perubahan
                                            </TableCell>
                                        </TableRow>

                                        {rows.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell>
                                                    <p className="font-bold text-[var(--subheading)]">
                                                        {new Date(row.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <p className="text-xs text-[var(--grey-text)]">
                                                        {new Date(row.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="text-[var(--subheading)]">{row.note || '-'}</TableCell>
                                                <TableCell>
                                                    <p className="font-bold text-[var(--subheading)]">{row.item.name}</p>
                                                    <p className="text-xs text-[var(--grey-text)]">{row.item.sku}</p>
                                                </TableCell>
                                                <TableCell className={`font-bold ${row.qty_change > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {row.qty_change > 0 ? `+${row.qty_change}` : row.qty_change}
                                                </TableCell>
                                                <TableCell className={`font-bold ${row.financial_change > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {row.financial_change > 0 ? '+' : '-'} Rp. {Math.abs(Number(row.financial_change)).toLocaleString('id-ID')}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        ref={(el) => { buttonRefs.current[row.id] = el; }}
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => toggleMenu(row.id)}
                                                    >
                                                        <MoreVertical className="h-4 w-4 text-[var(--grey-text)]" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {adjustments.data.length > 0 && (
                        <div className="flex items-center justify-between border-t border-[var(--border-strong)] px-6 py-4">
                            <span className="text-sm text-[var(--grey-text)]">
                                Menampilkan {adjustments.from ?? 0}-{adjustments.to ?? 0} dari {adjustments.total} Perubahan
                            </span>
                            <div className="flex items-center gap-1">
                                {adjustments.links.map((link, i) => (
                                    <button
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
                        </div>
                    )}
                </div>

            </div>

            {activeMenuAdj && (
                <InventoryAdjustmentActionsMenu
                    adjustment={activeMenuAdj}
                    position={menuPosition}
                    onClose={closeMenu}
                    onDelete={handleDelete}
                />
            )}

            {showCreateModal && (
                <InventoryAdjustmentCreateModal
                    inventoryItems={inventoryItems}
                    onClose={() => setShowCreateModal(false)}
                />
            )}
        </DashboardSidebarLayout>
    );
}