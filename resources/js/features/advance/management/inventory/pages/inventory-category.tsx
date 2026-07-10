import { Button, Pagination, SearchInput, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import {
    InventoryCategoryActionsMenu,
    InventoryCategoryCreateModal,
    InventoryCategoryEditModal,
    type InventoryCategory,
} from '@/features/advance/management/inventory/components';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { MoreVertical, Plus, Printer } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface InventoryCategoryListProps {
    categories: {
        data: InventoryCategory[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string };
    can_manage_catalog: boolean;
}

export default function InventoryCategoryList({ categories, filters, can_manage_catalog }: InventoryCategoryListProps) {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editCategory, setEditCategory] = useState<InventoryCategory | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

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
        router.get(route('dashboard.inventory.categories.index'), search ? { search } : {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const activeMenuCategory = categories.data.find((c) => c.id === openMenuId);

    return (
        <DashboardSidebarLayout title="Kategori" description="Kelola daftar kategori untuk barang-barang anda">
            <Head title="Kategori" />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <SearchInput value={search} onChange={setSearch} onSubmit={handleSearch} placeholder="Cari kategori..." />

                    <div className="flex flex-wrap items-center gap-3">
                        {can_manage_catalog && (
                            <Button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Kategori
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
                        <Table className="min-w-[420px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-[var(--text-light)]">Nama Kategori</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Barang Terdaftar</TableHead>
                                    {can_manage_catalog && <TableHead className="w-[60px] text-[var(--text-light)]">Aksi</TableHead>}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {categories.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={can_manage_catalog ? 3 : 2} className="py-10 text-center text-[var(--grey-text)]">
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
                                            <TableCell className="text-[var(--grey-text)]">{category.items_count} Barang</TableCell>
                                            {can_manage_catalog && (
                                                <TableCell className="relative">
                                                    <Button
                                                        ref={(el) => {
                                                            buttonRefs.current[category.id] = el;
                                                        }}
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => toggleMenu(category.id)}
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <Pagination links={categories.links} />
            </div>

            {can_manage_catalog && activeMenuCategory && (
                <InventoryCategoryActionsMenu
                    category={activeMenuCategory}
                    position={menuPosition}
                    onClose={closeMenu}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {can_manage_catalog && showCreateModal && <InventoryCategoryCreateModal onClose={() => setShowCreateModal(false)} />}

            {can_manage_catalog && editCategory && <InventoryCategoryEditModal category={editCategory} onClose={() => setEditCategory(null)} />}
        </DashboardSidebarLayout>
    );
}
