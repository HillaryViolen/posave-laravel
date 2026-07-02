import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { DashboardSidebarLayout } from '@/layouts';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { ChevronDown, ChevronLeft, ChevronRight, MoreVertical, Plus, Printer, Search } from 'lucide-react';
import { InventoryTransferActionsMenu, type Transfer } from '../components/inventory-transfer-actions-menu';
import { InventoryTransferCreateModal } from '../components/inventory-transfer-create-modal';

interface InventoryItemOption { id: number; name: string; sku: string; }

interface InventoryTransferListProps {
    transfers: {
        data: Transfer[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number;
        to: number;
        total: number;
    };
    inventoryItems: InventoryItemOption[];
    filters: { branch?: string; date?: string; status?: string; search?: string; per_page?: string };
}

const statusLabel: Record<string, { text: string; className: string }> = {
    waiting: { text: 'Waiting', className: 'bg-yellow-100 text-yellow-600' },
    success: { text: 'Success', className: 'bg-green-100 text-green-600' },
    cancelled: { text: 'Cancelled', className: 'bg-red-100 text-red-600' },
};

export default function InventoryTransferList({ transfers, inventoryItems, filters }: InventoryTransferListProps) {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const [branch, setBranch] = useState(filters.branch ?? '');
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    const currentDate = filters.date ?? new Date().toISOString().slice(0, 10);

    const applyFilters = (overrides: Record<string, string | undefined>) => {
        router.get(
            route('dashboard.inventory.transfers.index'),
            { ...filters, ...overrides },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const shiftDate = (days: number) => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + days);
        applyFilters({ date: d.toISOString().slice(0, 10) });
    };

    const toggleMenu = (id: number) => {
        if (openMenuId === id) { setOpenMenuId(null); return; }
        const btn = buttonRefs.current[id];
        if (btn) {
            const rect = btn.getBoundingClientRect();
            setMenuPosition({ top: rect.bottom + window.scrollY + 4, left: rect.right + window.scrollX - 176 });
        }
        setOpenMenuId(id);
    };

    const closeMenu = () => setOpenMenuId(null);

    const handleUpdateStatus = (id: number, status: 'success' | 'cancelled') => {
        router.put(route('dashboard.inventory.transfers.update', id), { status });
        closeMenu();
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus kiriman ini?')) {
            router.delete(route('dashboard.inventory.transfers.destroy', id));
        }
        closeMenu();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: search || undefined });
    };

    const handleBranchFilter = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ branch: branch || undefined });
    };

    const activeMenuTransfer = transfers.data.find((t) => t.id === openMenuId);

    const formattedDate = new Date(currentDate).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
    });

    return (
        <DashboardSidebarLayout title="Kiriman" description="Kelola pengiriman barang antar toko anda">
            <Head title="Kiriman" />
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--page-bg)] p-6">

                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleBranchFilter}>
                            <input
                                type="text"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                onBlur={() => applyFilters({ branch: branch || undefined })}
                                placeholder="Filter toko"
                                className="h-10 rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3 text-sm"
                            />
                        </form>

                        <div className="flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3 py-2">
                            <button onClick={() => shiftDate(-1)}><ChevronLeft className="h-4 w-4" /></button>
                            <span className="text-sm">{formattedDate}</span>
                            <button onClick={() => shiftDate(1)}><ChevronRight className="h-4 w-4" /></button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button onClick={() => setShowCreateModal(true)} className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]">
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Kiriman
                        </Button>
                        <Button variant="outline" className="bg-[var(--neutral-white)]">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </div>
                </div>

                <div className="mb-4 flex items-center justify-between gap-4">
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

                    <div className="relative">
                        <select
                            value={filters.status ?? ''}
                            onChange={(e) => applyFilters({ status: e.target.value || undefined })}
                            className="h-10 appearance-none rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3 pr-9 text-sm"
                        >
                            <option value="">Semua Status</option>
                            <option value="waiting">Waiting</option>
                            <option value="success">Success</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)]" />
                    </div>
                </div>

                <div className="max-h-full overflow-y-auto rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                    <Table>
                        <TableHeader className="bg-[var(--surface-header)]">
                            <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                <TableHead className="text-[var(--text-light)]">Tanggal Kirim</TableHead>
                                <TableHead className="text-[var(--text-light)]">Pengirim</TableHead>
                                <TableHead className="text-[var(--text-light)]">Penerima</TableHead>
                                <TableHead className="text-[var(--text-light)]">Nomor Kiriman</TableHead>
                                <TableHead className="text-[var(--text-light)]">Barang</TableHead>
                                <TableHead className="text-[var(--text-light)]">Status</TableHead>
                                <TableHead className="w-[60px] text-[var(--text-light)]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {transfers.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-10 text-center text-[var(--grey-text)]">
                                        Belum ada kiriman, buat kiriman terlebih dahulu
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transfers.data.map((transfer) => (
                                    <TableRow key={transfer.id}>
                                        <TableCell>
                                            <div className="font-medium">{new Date(transfer.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div className="text-xs text-[var(--grey-text)]">
                                                {new Date(transfer.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </TableCell>
                                        <TableCell>{transfer.sender_branch}</TableCell>
                                        <TableCell>{transfer.receiver_branch}</TableCell>
                                        <TableCell>#{transfer.transfer_number}</TableCell>
                                        <TableCell>{transfer.items_count} barang</TableCell>
                                        <TableCell>
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusLabel[transfer.status].className}`}>
                                                {statusLabel[transfer.status].text}
                                            </span>
                                        </TableCell>
                                        <TableCell className="relative">
                                            <Button
                                                ref={(el) => { buttonRefs.current[transfer.id] = el; }}
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleMenu(transfer.id)}
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
                        Menampilkan {transfers.from ?? 0}-{transfers.to ?? 0} dari {transfers.total} Kiriman
                    </span>

                    <div className="flex items-center gap-1">
                        {transfers.links.map((link, i) => (
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
                            value={filters.per_page ?? '6'}
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

            {activeMenuTransfer && (
                <InventoryTransferActionsMenu
                    transfer={activeMenuTransfer}
                    position={menuPosition}
                    onClose={closeMenu}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDelete}
                />
            )}

            {showCreateModal && (
                <InventoryTransferCreateModal
                    inventoryItems={inventoryItems}
                    onClose={() => setShowCreateModal(false)}
                />
            )}
        </DashboardSidebarLayout>
    );
}