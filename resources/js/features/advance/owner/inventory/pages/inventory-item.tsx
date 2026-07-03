import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { DashboardSidebarLayout } from '@/layouts';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { ChevronDown, MoreVertical, Plus, Printer, Search } from 'lucide-react';
import { InventoryItemActionsMenu, type InventoryCategory, type InventoryItem } from '../components/inventory-item-actions-menu';
import { InventoryItemDetailModal } from '../components/inventory-item-detail-modal';
import { InventoryItemCreateModal } from '../components/inventory-item-create-modal';
import { InventoryItemEditModal } from '../components/inventory-item-edit-modal';

interface InventoryItemListProps {
    items: {
        data: InventoryItem[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    categories: InventoryCategory[];
    filters: { search?: string; category_id?: string };
}

export default function InventoryItemList({ items, categories, filters }: InventoryItemListProps) {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);
    const [editItem, setEditItem] = useState<InventoryItem | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [openCategoryFilter, setOpenCategoryFilter] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    const toggleMenu = (id: number) => {
        if (openMenuId === id) { setOpenMenuId(null); return; }
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

    const handleShowDetail = (item: InventoryItem) => { setDetailItem(item); closeMenu(); };
    const handleShowEdit = (item: InventoryItem) => { setEditItem(item); closeMenu(); };

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
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleFilterCategory = (categoryId: string) => {
        router.get(
            route('dashboard.inventory.items.index'),
            categoryId === 'all' ? { search: filters.search } : { search: filters.search, category_id: categoryId },
            { preserveState: true, preserveScroll: true, replace: true }
        );
        setOpenCategoryFilter(false);
    };

    const activeMenuitem = items.data.find((i) => i.id === openMenuId);
    const activeCategoryName = categories.find((c) => String(c.id) === filters.category_id)?.name;

    const getStockStatus = (item: InventoryItem) => {
        if (item.current_stock === 0) return { label: 'Stok Habis', color: 'bg-red-100 text-red-600' };
        if (item.current_stock <= item.min_stock) return { label: 'Stok Rendah', color: 'bg-orange-100 text-orange-500' };
        return { label: 'Aman', color: 'bg-green-100 text-green-600' };
    };

    return (
        <DashboardSidebarLayout title="Daftar Barang" description="kelola semua barang dan stok inventori anda">
            <Head title="Daftar Barang" />
            <div className="min-h-screen bg-[var(--page-bg)] p-6">

                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)]" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search"
                                    className="h-10 rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                        </form>

                        {/* Filter Kategori */}
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
                                    <div className="absolute left-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-xl bg-[var(--neutral-white)] py-1 shadow-lg">
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
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Barang
                        </Button>
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
                                <TableHead className="text-[var(--text-light)]">Stok</TableHead>
                                <TableHead className="text-[var(--text-light)]">Harga</TableHead>
                                <TableHead className="text-[var(--text-light)]">Status</TableHead>
                                <TableHead className="w-[60px] text-[var(--text-light)]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {items.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-10 text-center text-[var(--grey-text)]">
                                        {filters.search || filters.category_id
                                            ? 'Barang tidak ditemukan'
                                            : 'Belum ada barang, tambah barang terlebih dahulu'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.data.map((item) => {
                                    const status = getStockStatus(item);
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
                                                {item.current_stock}
                                            </TableCell>
                                            <TableCell className="text-[var(--grey-text)]">
                                                Rp {Number(item.price).toLocaleString('id-ID')}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="text-xs text-[var(--grey-text)]">Min. {item.min_stock}</div>
                                                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="relative">
                                                <Button
                                                    ref={(el) => { buttonRefs.current[item.id] = el; }}
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleMenu(item.id)}
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
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

            {activeMenuitem && (
                <InventoryItemActionsMenu
                    item={activeMenuitem}
                    position={menuPosition}
                    onClose={closeMenu}
                    onView={handleShowDetail}
                    onEdit={handleShowEdit}
                    onDelete={handleDelete}
                />
            )}

            {detailItem && (
                <InventoryItemDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
            )}

            {showCreateModal && (
                <InventoryItemCreateModal categories={categories} onClose={() => setShowCreateModal(false)} />
            )}

            {editItem && (
                <InventoryItemEditModal item={editItem} categories={categories} onClose={() => setEditItem(null)} />
            )}
        </DashboardSidebarLayout>
    );
}