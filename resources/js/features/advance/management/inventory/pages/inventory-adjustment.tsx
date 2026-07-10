import {
    Button,
    DateNavigator,
    FilterDropdown,
    Pagination,
    SearchInput,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components';
import { InventoryAdjustmentActionsMenu, InventoryAdjustmentCreateModal, type Adjustment } from '@/features/advance/management/inventory/components';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { ArrowUpDown, MoreVertical, Package, Plus, Printer, Store } from 'lucide-react';
import React, { useRef, useState } from 'react';

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
    branches: { id: number; name: string }[];
    is_branch_manager: boolean;
    filters: { date?: string; search?: string; branch_id?: string; status?: string };
}

export default function InventoryAdjustment({ adjustments, stats, inventoryItems, branches, is_branch_manager, filters }: InventoryAdjustmentProps) {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    const currentDate = filters.date ?? new Date().toISOString().slice(0, 10);

    const applyFilters = (overrides: Record<string, string | undefined>) => {
        router.get(
            route('dashboard.inventory.adjustments.index'),
            { ...filters, ...overrides },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: search || undefined });
    };

    const toggleMenu = (id: number) => {
        if (openMenuId === id) {
            setOpenMenuId(null);
            return;
        }
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
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(row);
        return acc;
    }, {});

    const activeMenuAdj = adjustments.data.find((a) => a.id === openMenuId);

    const statusOptions = [
        { value: 'in', label: 'Masuk' },
        { value: 'out', label: 'Keluar' },
    ];

    // Cabang buat prefill modal create: kalau branch_manager, langsung kunci ke cabangnya (branches[0]).
    // Kalau Owner lagi filter ke 1 cabang, prefill itu. Kalau "semua cabang", modal minta pilih manual.
    const defaultBranchId = is_branch_manager ? (branches[0]?.id ?? null) : filters.branch_id ? Number(filters.branch_id) : null;

    return (
        <DashboardSidebarLayout title="Perubahan" description="Catat semua perubahan stok barang anda (penyesuaian)">
            <Head title="Perubahan Stok" />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                {/* Toolbar */}
                <div className="flex flex-col gap-3 rounded-xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-4 shadow-sm">
                    {/* Baris 1: Cabang + Tanggal + Aksi */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                            {!is_branch_manager ? (
                                <FilterDropdown
                                    value={filters.branch_id}
                                    options={branches.map((b) => ({ value: String(b.id), label: b.name }))}
                                    allLabel="Semua Cabang"
                                    onChange={(v) => applyFilters({ branch_id: v })}
                                    icon={<Store className="h-4 w-4" />}
                                />
                            ) : (
                                <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--second-accent)] px-3 py-2 text-sm font-medium text-[var(--subheading)]">
                                    <Store className="h-4 w-4" />
                                    {branches[0]?.name ?? 'Cabang Anda'}
                                </div>
                            )}

                            <DateNavigator date={currentDate} onChange={(date) => applyFilters({ date })} variant="default" size="sm" />
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Branch manager TETAP boleh buat perubahan (itu bagian ngurus stok cabangnya) */}
                            <Button
                                onClick={() => setShowCreateModal(true)}
                                className="flex-1 bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)] sm:flex-none"
                            >
                                <Plus className="mr-2 h-4 w-4 shrink-0" />
                                <span className="whitespace-nowrap">Buat Perubahan</span>
                            </Button>
                            <Button variant="outline" className="bg-[var(--neutral-white)]">
                                <Printer className="mr-2 h-4 w-4 shrink-0" />
                                <span className="whitespace-nowrap">Cetak</span>
                            </Button>
                        </div>
                    </div>

                    {/* Baris 2: Search + Filter Status */}
                    <div className="flex items-center gap-3">
                        <SearchInput value={search} onChange={setSearch} onSubmit={handleSearch} placeholder="Cari barang..." />

                        <FilterDropdown
                            value={filters.status}
                            options={statusOptions}
                            allLabel="Semua"
                            onChange={(v) => applyFilters({ status: v })}
                            className="shrink-0"
                        />
                    </div>
                </div>

                {/* Summary Cards — 2 kolom di mobile, 4 kolom mulai sm */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
                    <div className="flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-3 shadow-sm sm:gap-4 sm:p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 sm:h-12 sm:w-12">
                            <ArrowUpDown className="h-5 w-5 text-slate-600 sm:h-6 sm:w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-lg font-bold text-[var(--subheading)] sm:text-2xl">{stats.total_changes}</p>
                            <p className="text-xs leading-tight font-medium text-[var(--subheading)] sm:text-sm">Perubahan</p>
                            <p className="hidden text-[10px] leading-tight text-[var(--grey-text)] sm:block sm:text-xs">Total Transaksi Perubahan</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-3 shadow-sm sm:gap-4 sm:p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 sm:h-12 sm:w-12">
                            <Package className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-lg font-bold text-[var(--subheading)] sm:text-2xl">{stats.items_changed}</p>
                            <p className="text-xs leading-tight font-medium text-[var(--subheading)] sm:text-sm">Item dirubah</p>
                            <p className="hidden text-[10px] leading-tight text-[var(--grey-text)] sm:block sm:text-xs">
                                Jumlah item yang disesuaikan
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-3 shadow-sm sm:gap-4 sm:p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600 sm:h-12 sm:w-12 sm:text-sm">
                            Rp
                        </div>
                        <div className="min-w-0">
                            <p className="text-lg font-bold text-[var(--subheading)] sm:text-2xl">
                                {Number(stats.total_income).toLocaleString('id-ID')}
                            </p>
                            <p className="text-xs leading-tight font-medium text-[var(--subheading)] sm:text-sm">Total Pemasukan</p>
                            <p className="hidden text-[10px] leading-tight text-[var(--grey-text)] sm:block sm:text-xs">Dari penyesuaian stok</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-3 shadow-sm sm:gap-4 sm:p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-500 sm:h-12 sm:w-12 sm:text-sm">
                            Rp
                        </div>
                        <div className="min-w-0">
                            <p className="text-lg font-bold text-[var(--subheading)] sm:text-2xl">
                                {Math.abs(Number(stats.total_expense)).toLocaleString('id-ID')}
                            </p>
                            <p className="text-xs leading-tight font-medium text-[var(--subheading)] sm:text-sm">Total Pengeluaran</p>
                            <p className="hidden text-[10px] leading-tight text-[var(--grey-text)] sm:block sm:text-xs">Dari penyesuaian stok</p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[820px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="whitespace-nowrap text-[var(--text-light)]">Tanggal Perubahan</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Catatan</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Barang</TableHead>
                                    <TableHead className="whitespace-nowrap text-[var(--text-light)]">Perubahan</TableHead>
                                    <TableHead className="whitespace-nowrap text-[var(--text-light)]">Pemasukan/Pengeluaran</TableHead>
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
                                                    <div className="flex items-center gap-2 text-sm font-medium whitespace-nowrap text-[var(--subheading)]">
                                                        {dateLabel}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right text-sm font-medium whitespace-nowrap text-[var(--subheading)]">
                                                    {rows.length} Perubahan
                                                </TableCell>
                                            </TableRow>

                                            {rows.map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell className="whitespace-nowrap">
                                                        <p className="font-bold text-[var(--subheading)]">
                                                            {new Date(row.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        <p className="text-xs text-[var(--grey-text)]">
                                                            {new Date(row.date).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell className="max-w-[180px] truncate text-[var(--subheading)]">
                                                        {row.note || '-'}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <p className="font-bold text-[var(--subheading)]">{row.item.name}</p>
                                                        <p className="text-xs text-[var(--grey-text)]">{row.item.sku}</p>
                                                    </TableCell>
                                                    <TableCell
                                                        className={`font-bold whitespace-nowrap ${row.qty_change > 0 ? 'text-green-600' : 'text-red-500'}`}
                                                    >
                                                        {row.qty_change > 0 ? `+${row.qty_change}` : row.qty_change}
                                                    </TableCell>
                                                    <TableCell
                                                        className={`font-bold whitespace-nowrap ${row.financial_change > 0 ? 'text-green-600' : 'text-red-500'}`}
                                                    >
                                                        {row.financial_change > 0 ? '+' : '-'} Rp.{' '}
                                                        {Math.abs(Number(row.financial_change)).toLocaleString('id-ID')}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            ref={(el) => {
                                                                buttonRefs.current[row.id] = el;
                                                            }}
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
                    </div>
                </div>

                <Pagination links={adjustments.links} />
            </div>

            {activeMenuAdj && (
                <InventoryAdjustmentActionsMenu adjustment={activeMenuAdj} position={menuPosition} onClose={closeMenu} onDelete={handleDelete} />
            )}

            {showCreateModal && (
                <InventoryAdjustmentCreateModal
                    inventoryItems={inventoryItems}
                    branches={branches}
                    defaultBranchId={defaultBranchId}
                    lockBranch={is_branch_manager}
                    onClose={() => setShowCreateModal(false)}
                />
            )}
        </DashboardSidebarLayout>
    );
}
