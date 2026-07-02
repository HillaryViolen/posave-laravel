import React, { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { DashboardSidebarLayout } from '@/layouts';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { MoreVertical, Plus, Printer, Search } from 'lucide-react';
import { EmployeeAccessActionsMenu, type EmployeeAccess } from '../components/employee-access-actions-menu';
import { EmployeeAccessCreateModal } from '../components/employee-access-create-modal';
import { EmployeeAccessEditModal } from '../components/employee-access-edit-modal';

interface EmployeeAccessListProps {
    accesses: {
        data: EmployeeAccess[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
    };
}

export default function EmployeeAccessList({ accesses, filters }: EmployeeAccessListProps) {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editAccess, setEditAccess] = useState<EmployeeAccess | null>(null);
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

    const handleEdit = (access: EmployeeAccess) => {
        setEditAccess(access);
        closeMenu();
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus kategori ini? Role karyawan yang terhubung tidak akan terhapus.')) {
            router.delete(route('dashboard.employees.access.destroy', id));
        }
        closeMenu();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('dashboard.employees.access.index'),
            search ? { search } : {},
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const activeMenuAccess = accesses.data.find((a) => a.id === openMenuId);

    return (
        <DashboardSidebarLayout title="Akses Karyawan" description="Kelola daftar Akses karyawan anda">
            <Head title="Akses Karyawan" />
            <div className="min-h-screen bg-[var(--page-bg)] p-6">

                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
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
                    </div>

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
                                <TableHead className="text-[var(--text-light)]">Karyawan Terdaftar</TableHead>
                                <TableHead className="w-[60px] text-[var(--text-light)]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {accesses.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="py-10 text-center text-[var(--grey-text)]">
                                        {filters.search
                                            ? `Kategori "${filters.search}" tidak ditemukan`
                                            : 'Belum ada kategori, buat kategori terlebih dahulu'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                accesses.data.map((access) => (
                                    <TableRow key={access.id}>
                                        <TableCell>
                                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
                                                {access.name}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-[var(--grey-text)]">
                                            {access.employees_count} karyawan
                                        </TableCell>
                                        <TableCell className="relative">
                                            <Button
                                                ref={(el) => { buttonRefs.current[access.id] = el; }}
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleMenu(access.id)}
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

                {/* Pagination */}
                {accesses.links.length > 3 && (
                    <div className="mt-4 flex items-center justify-center gap-1">
                        {accesses.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`rounded-lg px-3 py-1.5 text-sm ${
                                    link.active
                                        ? 'bg-[var(--surface-header)] text-white font-medium'
                                        : 'bg-[var(--neutral-white)] text-[var(--grey-text)] hover:bg-[var(--surface-badge)] disabled:opacity-40 disabled:cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

            </div>

            {activeMenuAccess && (
                <EmployeeAccessActionsMenu
                    access={activeMenuAccess}
                    position={menuPosition}
                    onClose={closeMenu}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {showCreateModal && (
                <EmployeeAccessCreateModal onClose={() => setShowCreateModal(false)} />
            )}

            {editAccess && (
                <EmployeeAccessEditModal access={editAccess} onClose={() => setEditAccess(null)} />
            )}
        </DashboardSidebarLayout>
    );
}