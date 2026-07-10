import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { InventoryPurchaseOrderActionsMenu, InventoryPurchaseOrderCreateModal } from '@/features/advance/management/inventory/components';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, ChevronRight, MoreVertical, Plus, Printer, Search } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface Supplier {
    id: number;
    name: string;
}
interface BranchOption {
    id: number;
    name: string;
}
interface InventoryItemOption {
    id: number;
    name: string;
    sku: string;
    price: number;
}

interface PurchaseOrder {
    id: number;
    po_number: string;
    date: string;
    total_price: number;
    status: 'waiting_fulfilment' | 'success' | 'cancelled';
    items_count: number;
    branch: BranchOption;
    supplier: Supplier;
}

interface InventoryPurchaseOrderListProps {
    purchaseOrders: {
        data: PurchaseOrder[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number;
        to: number;
        total: number;
    };
    suppliers: Supplier[];
    inventoryItems: InventoryItemOption[];
    branches: BranchOption[];
    my_branch_id: number | null;
    is_branch_manager: boolean;
    filters: { branch_id?: string; date?: string; status?: string; search?: string; per_page?: string };
}

const statusLabel: Record<string, { text: string; className: string }> = {
    waiting_fulfilment: { text: 'Menunggu', className: 'bg-yellow-100 text-yellow-600' },
    success: { text: 'Selesai', className: 'bg-green-100 text-green-600' },
    cancelled: { text: 'Dibatalkan', className: 'bg-red-100 text-red-600' },
};

export default function InventoryPurchaseOrderList({
    purchaseOrders,
    suppliers,
    inventoryItems,
    branches,
    my_branch_id,
    is_branch_manager,
    filters,
}: InventoryPurchaseOrderListProps) {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    const currentDate = filters.date ?? new Date().toISOString().slice(0, 10);

    const applyFilters = (overrides: Record<string, string | undefined>) => {
        router.get(
            route('dashboard.inventory.purchase-orders.index'),
            { ...filters, ...overrides },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const shiftDate = (days: number) => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + days);
        applyFilters({ date: d.toISOString().slice(0, 10) });
    };

    const toggleMenu = (id: number) => {
        if (openMenuId === id) {
            setOpenMenuId(null);
            return;
        }
        const btn = buttonRefs.current[id];
        if (btn) {
            const rect = btn.getBoundingClientRect();
            setMenuPosition({ top: rect.bottom + window.scrollY + 4, left: rect.right + window.scrollX - 176 });
        }
        setOpenMenuId(id);
    };

    const closeMenu = () => setOpenMenuId(null);

    const handleUpdateStatus = (id: number, status: 'success' | 'cancelled') => {
        router.put(route('dashboard.inventory.purchase-orders.update', id), { status });
        closeMenu();
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus PO ini?')) {
            router.delete(route('dashboard.inventory.purchase-orders.destroy', id));
        }
        closeMenu();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: search || undefined });
    };

    const activeMenuPO = purchaseOrders.data.find((po) => po.id === openMenuId);
    const activeBranchName = branches.find((b) => String(b.id) === filters.branch_id)?.name;

    const formattedDate = new Date(currentDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <DashboardSidebarLayout title="Pembelian" description="Kelola pembelian barang dari pemasok anda">
            <Head title="Pembelian" />
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--page-bg)] p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {/* Filter cabang — cuma buat Owner, branch_manager udah pasti 1 cabang */}
                        {!is_branch_manager && (
                            <div className="relative">
                                <select
                                    aria-label="Filter cabang"
                                    value={filters.branch_id ?? ''}
                                    onChange={(e) => applyFilters({ branch_id: e.target.value || undefined })}
                                    className="h-10 appearance-none rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3 pr-9 text-sm"
                                >
                                    <option value="">Semua Cabang</option>
                                    {branches.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)]" />
                            </div>
                        )}

                        <div className="flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3 py-2">
                            <button aria-label="Hari sebelumnya" onClick={() => shiftDate(-1)}>
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-sm">{formattedDate}</span>
                            <button aria-label="Hari berikutnya" onClick={() => shiftDate(1)}>
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
                            Buat PO
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
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)]" />
                            <input
                                aria-label="Cari nomor PO"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nomor PO..."
                                className="focus:ring-ring h-10 rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] pr-4 pl-9 text-sm focus:ring-1 focus:outline-none"
                            />
                        </div>
                    </form>

                    <div className="relative">
                        <select
                            aria-label="Filter status"
                            value={filters.status ?? ''}
                            onChange={(e) => applyFilters({ status: e.target.value || undefined })}
                            className="h-10 appearance-none rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3 pr-9 text-sm"
                        >
                            <option value="">Semua Status</option>
                            <option value="waiting_fulfilment">Menunggu</option>
                            <option value="success">Selesai</option>
                            <option value="cancelled">Dibatalkan</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)]" />
                    </div>
                </div>

                <div className="max-h-full overflow-y-auto rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                    <Table>
                        <TableHeader className="bg-[var(--surface-header)]">
                            <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                <TableHead className="text-[var(--text-light)]">Tanggal PO</TableHead>
                                <TableHead className="text-[var(--text-light)]">Cabang</TableHead>
                                <TableHead className="text-[var(--text-light)]">Pemasok</TableHead>
                                <TableHead className="text-[var(--text-light)]">Nomor PO</TableHead>
                                <TableHead className="text-[var(--text-light)]">Total Harga</TableHead>
                                <TableHead className="text-[var(--text-light)]">Status</TableHead>
                                <TableHead className="w-[60px] text-[var(--text-light)]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {purchaseOrders.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-10 text-center text-[var(--grey-text)]">
                                        Belum ada PO, buat PO terlebih dahulu
                                    </TableCell>
                                </TableRow>
                            ) : (
                                purchaseOrders.data.map((po) => (
                                    <TableRow key={po.id}>
                                        <TableCell>
                                            <div className="font-medium">
                                                {new Date(po.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="text-xs text-[var(--grey-text)]">
                                                {new Date(po.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </TableCell>
                                        <TableCell>{po.branch.name}</TableCell>
                                        <TableCell>{po.supplier.name}</TableCell>
                                        <TableCell>#{po.po_number}</TableCell>
                                        <TableCell>Rp. {Number(po.total_price).toLocaleString('id-ID')}</TableCell>
                                        <TableCell>
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusLabel[po.status].className}`}>
                                                {statusLabel[po.status].text}
                                            </span>
                                        </TableCell>
                                        <TableCell className="relative">
                                            <Button
                                                ref={(el) => {
                                                    buttonRefs.current[po.id] = el;
                                                }}
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleMenu(po.id)}
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
                        Menampilkan {purchaseOrders.from ?? 0}-{purchaseOrders.to ?? 0} dari {purchaseOrders.total} Pembelian
                    </span>

                    <div className="flex items-center gap-1">
                        {purchaseOrders.links.map((link, i) => (
                            <button
                                aria-label="Navigasi halaman"
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
                            aria-label="Barang per halaman"
                            value={filters.per_page ?? '6'}
                            onChange={(e) => applyFilters({ per_page: e.target.value })}
                            className="h-9 appearance-none rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3 pr-9 text-sm"
                        >
                            <option value="6">6 per halaman</option>
                            <option value="12">12 per halaman</option>
                            <option value="24">24 per halaman</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)]" />
                    </div>
                </div>
            </div>

            {activeMenuPO && (
                <InventoryPurchaseOrderActionsMenu
                    purchaseOrder={activeMenuPO}
                    position={menuPosition}
                    onClose={closeMenu}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDelete}
                />
            )}

            {showCreateModal && (
                <InventoryPurchaseOrderCreateModal
                    suppliers={suppliers}
                    inventoryItems={inventoryItems}
                    branches={branches}
                    myBranchId={my_branch_id}
                    isBranchManager={is_branch_manager}
                    onClose={() => setShowCreateModal(false)}
                />
            )}
        </DashboardSidebarLayout>
    );
}
