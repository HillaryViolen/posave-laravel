import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import {
    InventoryItemActionsMenu,
    InventoryItemCreateModal,
    InventoryItemDetailModal,
    InventoryItemEditModal,
    type InventoryCategory,
    type InventoryItem,
} from '@/features/advance/management/inventory/components';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { ChevronDown, Minus, MoreVertical, Plus, Printer, Search } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

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
    filters: { search?: string; category_id?: string; branch_id?: string };
    is_branch_manager: boolean;
    can_manage_catalog: boolean;
}

export default function InventoryItemList({ items, categories, branches, filters, is_branch_manager, can_manage_catalog }: InventoryItemListProps) {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);
    const [editItem, setEditItem] = useState<InventoryItem | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [openCategoryFilter, setOpenCategoryFilter] = useState(false);
    const [openBranchFilter, setOpenBranchFilter] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    // Salinan lokal, biar stepper stok bisa update angka langsung tanpa reload halaman.
    const [itemRows, setItemRows] = useState<InventoryItem[]>(items.data);
    const [pendingStockId, setPendingStockId] = useState<number | null>(null);

    useEffect(() => {
        setItemRows(items.data);
    }, [items.data]);

    const toggleMenu = (id: number) => {
        if (openMenuId === id) {
            setOpenMenuId(null);
            return;
        }
        const btn = buttonRefs.current[id];
        if (btn) {
            const rect = btn.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.right + window.scrollX - 144,
            });
        }
        setOpenMenuId(id);
    };

    const closeMenu = () => setOpenMenuId(null);

    const handleShowDetail = (item: InventoryItem) => {
        setDetailItem(item);
        closeMenu();
    };
    const handleShowEdit = (item: InventoryItem) => {
        setEditItem(item);
        closeMenu();
    };

    const handleFilterBranch = (branchId: string) => {
        router.get(
            route('dashboard.inventory.items.index'),
            branchId === 'all'
                ? { search: filters.search, category_id: filters.category_id }
                : { search: filters.search, category_id: filters.category_id, branch_id: branchId },
            { preserveState: true, preserveScroll: true, replace: true },
        );
        setOpenBranchFilter(false);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus barang ini?')) {
            router.delete(route('dashboard.inventory.items.destroy', id));
        }
        closeMenu();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('dashboard.inventory.items.index'),
            { ...filters, search: search || undefined },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleFilterCategory = (categoryId: string) => {
        router.get(
            route('dashboard.inventory.items.index'),
            categoryId === 'all' ? { search: filters.search } : { search: filters.search, category_id: categoryId },
            { preserveState: true, preserveScroll: true, replace: true },
        );
        setOpenCategoryFilter(false);
    };

    const activeMenuitem = itemRows.find((i) => i.id === openMenuId);
    const activeCategoryName = categories.find((c) => String(c.id) === filters.category_id)?.name;
    const activeBranchName = branches.find((b) => String(b.id) === filters.branch_id)?.name;
    const selectedBranchId = filters.branch_id ? Number(filters.branch_id) : is_branch_manager ? (branches[0]?.id ?? null) : null;

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
            <div className="min-h-screen bg-[var(--page-bg)] p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)]" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search"
                                    className="focus:ring-ring h-10 rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] pr-4 pl-9 text-sm focus:ring-1 focus:outline-none"
                                />
                            </div>
                        </form>

                        {/* Filter Kategori — tetap ada buat kedua role */}
                        <div className="relative">
                            <Button
                                variant="outline"
                                className="bg-[var(--second-accent)] text-[var(--subheading)]"
                                onClick={() => setOpenCategoryFilter(!openCategoryFilter)}
                            >
                                {activeCategoryName ?? 'Semua Kategori'}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>

                            {openCategoryFilter && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setOpenCategoryFilter(false)} />
                                    <div className="absolute top-full left-0 z-50 mt-1 w-48 overflow-hidden rounded-xl bg-[var(--neutral-white)] py-1 shadow-lg">
                                        <button
                                            onClick={() => handleFilterCategory('all')}
                                            className={`flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-badge)] ${!filters.category_id ? 'font-semibold text-[var(--subheading)]' : 'text-[var(--grey-text)]'}`}
                                        >
                                            Semua Kategori
                                        </button>
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleFilterCategory(String(cat.id))}
                                                className={`flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-badge)] ${filters.category_id === String(cat.id) ? 'font-semibold text-[var(--subheading)]' : 'text-[var(--grey-text)]'}`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Filter Cabang — cuma buat Owner, branch_manager udah pasti 1 cabang */}
                        {!is_branch_manager && (
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    className="bg-[var(--second-accent)] text-[var(--subheading)]"
                                    onClick={() => setOpenBranchFilter(!openBranchFilter)}
                                >
                                    {activeBranchName ?? 'Semua Cabang'}
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>

                                {openBranchFilter && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setOpenBranchFilter(false)} />
                                        <div className="absolute top-full left-0 z-50 mt-1 w-48 overflow-hidden rounded-xl bg-[var(--neutral-white)] py-1 shadow-lg">
                                            <button
                                                onClick={() => handleFilterBranch('all')}
                                                className={`flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-badge)] ${!filters.branch_id ? 'font-semibold text-[var(--subheading)]' : 'text-[var(--grey-text)]'}`}
                                            >
                                                Semua Cabang
                                            </button>
                                            {branches.map((b) => (
                                                <button
                                                    key={b.id}
                                                    onClick={() => handleFilterBranch(String(b.id))}
                                                    className={`flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-badge)] ${filters.branch_id === String(b.id) ? 'font-semibold text-[var(--subheading)]' : 'text-[var(--grey-text)]'}`}
                                                >
                                                    {b.name}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Buat Barang — cuma Owner, katalog itu keputusan level company */}
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
                    <Table>
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
                                <TableRow>
                                    <TableCell colSpan={6} className="py-10 text-center text-[var(--grey-text)]">
                                        {filters.search || filters.category_id
                                            ? 'Barang tidak ditemukan'
                                            : 'Belum ada barang, tambah barang terlebih dahulu'}
                                    </TableCell>
                                </TableRow>
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
                                                            className="h-10 w-10 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-lg bg-gray-100" />
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-[var(--subheading)]">{item.name}</div>
                                                        <div className="text-xs text-[var(--grey-text)]">SKU: {item.sku}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
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
                                                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-strong)] hover:bg-[var(--second-accent)] disabled:opacity-30"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="w-6 text-center font-semibold text-[var(--subheading)]">
                                                            {item.current_stock}
                                                        </span>
                                                        <button
                                                            aria-label={`Tambah stok ${item.name}`}
                                                            disabled={isPending}
                                                            onClick={() => handleStockAdjust(item, 1)}
                                                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-strong)] hover:bg-[var(--second-accent)] disabled:opacity-30"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span title="Pilih cabang dulu untuk atur stok">{item.current_stock}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-[var(--grey-text)]">Rp {Number(item.price).toLocaleString('id-ID')}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="text-xs text-[var(--grey-text)]">Min. {item.min_stock}</div>
                                                    <span
                                                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}
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
                                                        className="text-xs font-medium text-[var(--secondary-700)] hover:underline"
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

                {items.links.length > 3 && (
                    <div className="mt-4 flex items-center justify-center gap-1">
                        {items.links.map((link, i) => (
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
                )}
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
