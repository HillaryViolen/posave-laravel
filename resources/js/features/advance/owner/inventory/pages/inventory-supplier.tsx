import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { DashboardSidebarLayout } from '@/layouts';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { ChevronDown, Mail, MapPin, MoreVertical, Phone, Plus, Printer, Search, Store } from 'lucide-react';
import { InventorySupplierActionsMenu, type Supplier } from '../components/inventory-supplier-actions-menu';
import { InventorySupplierCreateModal } from '../components/inventory-supplier-create-modal';
import { InventorySupplierEditModal } from '../components/inventory-supplier-edit-modal';

interface InventorySupplierListProps {
    suppliers?: {
        data: Supplier[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    categories?: string[];
    filters?: { search?: string; category?: string; per_page?: string };
}

export default function InventorySupplier({ 
    suppliers = { data: [], total: 0, from: 0, to: 0, links: [] }, 
    categories = [], 
    filters = {} 
}: InventorySupplierListProps) {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
    const [openCategoryFilter, setOpenCategoryFilter] = useState(false);
    const [search, setSearch] = useState(filters?.search ?? '');
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    const applyFilters = (overrides: Record<string, string | undefined>) => {
        router.get(
            route('dashboard.inventory.suppliers.index'),
            { ...filters, ...overrides },
            { preserveState: true, preserveScroll: true, replace: true }
        );
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

    const handleEdit = (supplier: Supplier) => { 
        setEditSupplier(supplier); 
        closeMenu(); 
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus pemasok ini?')) {
            router.delete(route('dashboard.inventory.suppliers.destroy', id));
        }
        closeMenu();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: search || undefined });
    };

    const handleFilterCategory = (category?: string) => {
        applyFilters({ category });
        setOpenCategoryFilter(false);
    };

    const activeMenuSupplier = suppliers?.data?.find((s) => s.id === openMenuId);

    return (
        <DashboardSidebarLayout title="Pemasok" description="Kelola daftar pemasok barang-barang anda">
            <Head title="Pemasok" />
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--page-bg)] p-6">

                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
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

                        <div className="relative">
                            <Button
                                variant="outline"
                                className="bg-[var(--neutral-white)] text-[var(--subheading)]"
                                onClick={() => setOpenCategoryFilter(!openCategoryFilter)}
                            >
                                {filters?.category ?? 'Semua Kategori'}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>

                            {openCategoryFilter && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setOpenCategoryFilter(false)} />
                                    <div className="absolute left-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-xl bg-[var(--neutral-white)] py-1 shadow-lg">
                                        <button
                                            onClick={() => handleFilterCategory(undefined)}
                                            className={`flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-badge)] ${!filters?.category ? 'font-semibold text-[var(--subheading)]' : 'text-[var(--grey-text)]'}`}
                                        >
                                            Semua Kategori
                                        </button>
                                        {categories?.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => handleFilterCategory(cat)}
                                                className={`flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-badge)] ${filters?.category === cat ? 'font-semibold text-[var(--subheading)]' : 'text-[var(--grey-text)]'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button onClick={() => setShowCreateModal(true)} className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]">
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Pemasok
                        </Button>
                        <Button variant="outline" className="bg-[var(--neutral-white)]">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </div>
                </div>

                <div className="max-h-full overflow-y-auto rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                    <Table>
                        <TableHeader className="bg-[var(--surface-header)]">
                            <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                <TableHead className="text-[var(--text-light)]">Nama Pemasok</TableHead>
                                <TableHead className="text-[var(--text-light)]">Alamat</TableHead>
                                <TableHead className="text-[var(--text-light)]">Nomor Telepon</TableHead>
                                <TableHead className="text-[var(--text-light)]">Email</TableHead>
                                <TableHead className="w-[60px] text-[var(--text-light)]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {suppliers?.data?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-10 text-center text-[var(--grey-text)]">
                                        {filters?.search || filters?.category
                                            ? 'Pemasok tidak ditemukan'
                                            : 'Belum ada pemasok, tambah pemasok terlebih dahulu'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                suppliers?.data?.map((supplier) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {supplier.logo ? (
                                                    <img
                                                        src={`/storage/${supplier.logo}`}
                                                        alt={supplier.name}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                                        <Store className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-[var(--subheading)]">{supplier.name}</div>
                                                    {supplier.category && (
                                                        <span className="mt-0.5 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                                                            {supplier.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-xs text-[var(--grey-text)]">
                                            <div className="flex items-start gap-1.5">
                                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                                <span className="line-clamp-2">{supplier.address ?? '-'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[var(--grey-text)]">
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="h-3.5 w-3.5" />
                                                {supplier.phone ?? '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[var(--grey-text)]">
                                            <div className="flex items-center gap-1.5">
                                                <Mail className="h-3.5 w-3.5" />
                                                {supplier.email ?? '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="relative">
                                            <Button
                                                ref={(el) => { buttonRefs.current[supplier.id] = el; }}
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleMenu(supplier.id)}
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

                <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="text-sm text-[var(--grey-text)]">
                        Menampilkan {suppliers?.from ?? 0}-{suppliers?.to ?? 0} dari {suppliers?.total ?? 0} Pemasok
                    </span>

                    <div className="flex items-center gap-1">
                        {suppliers?.links?.map((link, i) => (
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

                    <div className="relative">
                        <select
                            value={filters?.per_page ?? '6'}
                            onChange={(e) => applyFilters({ per_page: e.target.value })}
                            className="h-9 appearance-none rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3 pr-9 text-sm"
                        >
                            <option value="6">6 per halaman</option>
                            <option value="12">12 per halaman</option>
                            <option value="24">24 per halaman</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)]" />
                    </div>
                </div>
            </div>

            {activeMenuSupplier && (
                <InventorySupplierActionsMenu
                    supplier={activeMenuSupplier}
                    position={menuPosition}
                    onClose={closeMenu}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {showCreateModal && (
                <InventorySupplierCreateModal onClose={() => setShowCreateModal(false)} />
            )}

            {editSupplier && (
                <InventorySupplierEditModal supplier={editSupplier} onClose={() => setEditSupplier(null)} />
            )}
        </DashboardSidebarLayout>
    );
}