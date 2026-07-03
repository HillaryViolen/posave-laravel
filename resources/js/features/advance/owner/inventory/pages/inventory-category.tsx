import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { DashboardSidebarLayout } from '@/layouts';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { MoreVertical, Plus, Printer, Search } from 'lucide-react';
import { InventoryCategoryActionsMenu, type InventoryCategory } from '../components/inventory-category-actions-menu';
import { InventoryCategoryCreateModal } from '../components/inventory-category-create-modal';
import { InventoryCategoryEditModal } from '../components/inventory-category-edit-modal';

interface InventoryCategoryListProps {
    categories: {
        data: InventoryCategory[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string };
}

export default function InventoryCategoryList({ categories, filters }: InventoryCategoryListProps) {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editCategory, setEditCategory] = useState<InventoryCategory | null>(null);
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

    const handleEdit = (category: InventoryCategory) => {
        setEditCategory(category);
        closeMenu();
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus kategori ini? Barang yang terhubung tidak akan terhapus.')) {
            router.delete(route('dashboard.inventory.categories.destroy', id));
        }
        closeMenu();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('dashboard.inventory.categories.index'),
            search ? { search } : {},
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const activeMenuCategory = categories.data.find((c) => c.id === openMenuId);

    return (
        <DashboardSidebarLayout title="Kategori" description="Kelola daftar kategori untuk barang-barang anda">
            <Head title="Kategori" />
            <div className="min-h-screen bg-[var(--page-bg)] p-6">

                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
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

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Kategori
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
                                <TableHead className="text-[var(--text-light)]">Nama Kategori</TableHead>
                                <TableHead className="text-[var(--text-light)]">Barang Terdaftar</TableHead>
                                <TableHead className="w-[60px] text-[var(--text-light)]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {categories.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="py-10 text-center text-[var(--grey-text)]">
                                        {filters.search
                                            ? `Kategori "${filters.search}" tidak ditemukan`
                                            : 'Belum ada kategori, buat kategori terlebih dahulu'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.data.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>
                                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
                                                {category.name}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-[var(--grey-text)]">
                                            {category.items_count} Barang
                                        </TableCell>
                                        <TableCell className="relative">
                                            <Button
                                                ref={(el) => { buttonRefs.current[category.id] = el; }}
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleMenu(category.id)}
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {categories.links.length > 3 && (
                    <div className="mt-4 flex items-center justify-center gap-1">
                        {categories.links.map((link, i) => (
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

            {activeMenuCategory && (
                <InventoryCategoryActionsMenu
                    category={activeMenuCategory}
                    position={menuPosition}
                    onClose={closeMenu}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {showCreateModal && (
                <InventoryCategoryCreateModal onClose={() => setShowCreateModal(false)} />
            )}

            {editCategory && (
                <InventoryCategoryEditModal category={editCategory} onClose={() => setEditCategory(null)} />
            )}
        </DashboardSidebarLayout>
    );
}