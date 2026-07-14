import {
    Button,
    FilterDropdown,
    PaginationBar,
    SearchInput,
    Table,
    TableBody,
    TableCell,
    TableEmptyState,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components';
import {
    InventoryItemActionsMenu,
    InventoryItemCreateModal,
    InventoryItemDetailModal,
    InventoryItemEditModal,
    type InventoryCategory,
    type InventoryItem,
} from '@/features/advance/management/inventory/components';
import { useConfirmAction, useDropdownMenu, useFilters } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Minus, MoreVertical, Plus, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { resolveBranchId } from '../lib';

interface InventoryItemListProps {
    items: {
        data: InventoryItem[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    categories: InventoryCategory[];
    branches: { id: number; name: string }[];
    filters: { search?: string; category_id?: string; branch_id?: string; per_page?: string };
    is_branch_manager: boolean;
    can_manage_catalog: boolean;
}

export default function InventoryItemList({ items, categories, branches, filters, is_branch_manager, can_manage_catalog }: InventoryItemListProps) {
    const { openId: openMenuId, position: menuPosition, buttonRefs, toggleMenu, closeMenu } = useDropdownMenu();
    const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);
    const [editItem, setEditItem] = useState<InventoryItem | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { search, setSearch, applyFilters, handleSearch } = useFilters('dashboard.inventory.items.index', filters);
    const [itemRows, setItemRows] = useState<InventoryItem[]>(items.data);
    const [pendingStockId, setPendingStockId] = useState<number | null>(null);
    const { confirmAndDelete } = useConfirmAction();

    useEffect(() => {
        setItemRows(items.data);
    }, [items.data]);

    const handleShowDetail = (item: InventoryItem) => {
        setDetailItem(item);
        closeMenu();
    };
    const handleShowEdit = (item: InventoryItem) => {
        setEditItem(item);
        closeMenu();
    };

    const handleDelete = (id: number) => {
        confirmAndDelete('Yakin ingin menghapus barang ini?', route('dashboard.inventory.items.destroy', id));
        closeMenu();
    };

    const activeMenuitem = itemRows.find((i) => i.id === openMenuId);
    const activeBranchName = branches.find((b) => String(b.id) === filters.branch_id)?.name;
    const selectedBranchId = resolveBranchId({ isBranchManager: is_branch_manager, branches, filterBranchId: filters.branch_id });
    const getStockStatus = (item: InventoryItem) => {
        if (item.current_stock === 0) return { label: 'Stok Habis', color: 'bg-red-100 text-red-600' };
        if (item.current_stock <= item.min_stock) return { label: 'Stok Rendah', color: 'bg-orange-100 text-orange-500' };
        return { label: 'Aman', color: 'bg-green-100 text-green-600' };
    };

    const handleStockAdjust = async (item: InventoryItem, delta: number) => {
        if (!selectedBranchId) return;
        if (item.current_stock + delta < 0) return;

        setPendingStockId(item.id);
        try {
            const res = await axios.patch(route('dashboard.inventory.items.stock', item.id), {
                delta,
                branch_id: selectedBranchId,
            });
            setItemRows((prev) => prev.map((i) => (i.id === item.id ? { ...i, current_stock: res.data.current_stock } : i)));
        } catch {
            alert('Gagal mengubah stok, coba lagi.');
        } finally {
            setPendingStockId(null);
        }
    };

    return (
        <DashboardSidebarLayout title="Daftar Barang" description="kelola semua barang dan stok inventori anda">
            <Head title="Daftar Barang" />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <SearchInput value={search} onChange={setSearch} onSubmit={handleSearch} placeholder="Cari nama barang..." />

                        <FilterDropdown
                            value={filters.category_id}
                            options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
                            allLabel="Semua Kategori"
                            onChange={(v) => applyFilters({ category_id: v })}
                        />

                        {/* Filter Cabang — cuma buat Owner, branch_manager udah pasti 1 cabang */}
                        {!is_branch_manager && (
                            <FilterDropdown
                                value={filters.branch_id}
                                options={branches.map((b) => ({ value: String(b.id), label: b.name }))}
                                allLabel="Semua Cabang"
                                onChange={(v) => applyFilters({ branch_id: v })}
                            />
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {can_manage_catalog && (
                            <Button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Barang
                            </Button>
                        )}
                        <Button variant="outline" className="bg-[var(--neutral-white)]">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[840px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-[var(--text-light)]">Nama Barang</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Kategori</TableHead>
                                    <TableHead className="text-[var(--text-light)]">
                                        Stok {activeBranchName ? `(${activeBranchName})` : is_branch_manager ? '' : '(Semua Cabang)'}
                                    </TableHead>
                                    <TableHead className="text-[var(--text-light)]">Harga</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Status</TableHead>
                                    <TableHead className="w-[60px] text-[var(--text-light)]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {itemRows.length === 0 ? (
                                    <TableEmptyState
                                        colSpan={6}
                                        message={
                                            filters.search || filters.category_id
                                                ? 'Barang tidak ditemukan'
                                                : 'Belum ada barang, tambah barang terlebih dahulu'
                                        }
                                    />
                                ) : (
                                    itemRows.map((item) => {
                                        const status = getStockStatus(item);
                                        const canAdjustStock = !!selectedBranchId;
                                        const isPending = pendingStockId === item.id;

                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {item.image ? (
                                                            <img
                                                                src={`/storage/${item.image}`}
                                                                alt={item.name}
                                                                className="h-10 w-10 shrink-0 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100" />
                                                        )}
                                                        <div className="min-w-0">
                                                            <div className="truncate font-medium text-[var(--subheading)]">{item.name}</div>
                                                            <div className="text-xs text-[var(--grey-text)]">SKU: {item.sku}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium whitespace-nowrap text-orange-600">
                                                        {item.category.name}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-[var(--grey-text)]">
                                                    {canAdjustStock ? (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                aria-label={`Kurangi stok ${item.name}`}
                                                                disabled={isPending || item.current_stock === 0}
                                                                onClick={() => handleStockAdjust(item, -1)}
                                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] hover:bg-[var(--second-accent)] disabled:opacity-30"
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </button>
                                                            <span className="w-6 shrink-0 text-center font-semibold text-[var(--subheading)]">
                                                                {item.current_stock}
                                                            </span>
                                                            <button
                                                                aria-label={`Tambah stok ${item.name}`}
                                                                disabled={isPending}
                                                                onClick={() => handleStockAdjust(item, 1)}
                                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] hover:bg-[var(--second-accent)] disabled:opacity-30"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span title="Pilih cabang dulu untuk atur stok">{item.current_stock}</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap text-[var(--grey-text)]">
                                                    Rp {Number(item.price).toLocaleString('id-ID')}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="text-xs text-[var(--grey-text)]">Min. {item.min_stock}</div>
                                                        <span
                                                            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${status.color}`}
                                                        >
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="relative">
                                                    {can_manage_catalog ? (
                                                        <Button
                                                            ref={(el) => {
                                                                buttonRefs.current[item.id] = el;
                                                            }}
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => toggleMenu(item.id)}
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    ) : (
                                                        <button
                                                            aria-label={`Lihat detail ${item.name}`}
                                                            onClick={() => handleShowDetail(item)}
                                                            className="text-xs font-medium whitespace-nowrap text-[var(--secondary-700)] hover:underline"
                                                        >
                                                            Lihat
                                                        </button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <PaginationBar
                    from={items.from ?? 0}
                    to={items.to ?? 0}
                    total={items.total}
                    itemLabel="Barang"
                    links={items.links}
                    perPage={filters.per_page ?? '5'}
                    onPerPageChange={(v) => applyFilters({ per_page: v })}
                />
            </div>

            {can_manage_catalog && activeMenuitem && (
                <InventoryItemActionsMenu
                    item={activeMenuitem}
                    position={menuPosition}
                    onClose={closeMenu}
                    onView={handleShowDetail}
                    onEdit={handleShowEdit}
                    onDelete={handleDelete}
                />
            )}

            {detailItem && <InventoryItemDetailModal item={detailItem} onClose={() => setDetailItem(null)} />}

            {can_manage_catalog && showCreateModal && (
                <InventoryItemCreateModal categories={categories} branches={branches} onClose={() => setShowCreateModal(false)} />
            )}

            {can_manage_catalog && editItem && (
                <InventoryItemEditModal
                    item={editItem}
                    categories={categories}
                    branches={branches}
                    selectedBranchId={selectedBranchId}
                    onClose={() => setEditItem(null)}
                />
            )}
        </DashboardSidebarLayout>
    );
}
