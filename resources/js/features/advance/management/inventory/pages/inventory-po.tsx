import {
    Button,
    DateNavigator,
    FilterDropdown,
    Pagination,
    PerPageSelect,
    SearchInput,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components';
import { InventoryPurchaseOrderActionsMenu, InventoryPurchaseOrderCreateModal } from '@/features/advance/management/inventory/components';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { MoreVertical, Plus, Printer } from 'lucide-react';
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

const STATUS_OPTIONS = [
    { value: 'waiting_fulfilment', label: 'Menunggu' },
    { value: 'success', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' },
];

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

    return (
        <DashboardSidebarLayout title="Pembelian" description="Kelola pembelian barang dari pemasok anda">
            <Head title="Pembelian" />
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {!is_branch_manager && (
                            <FilterDropdown
                                value={filters.branch_id}
                                options={branches.map((b) => ({ value: String(b.id), label: b.name }))}
                                allLabel="Semua Cabang"
                                onChange={(v) => applyFilters({ branch_id: v })}
                            />
                        )}

                        <DateNavigator date={currentDate} onChange={(date) => applyFilters({ date })} variant="default" size="sm" />
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

                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <SearchInput value={search} onChange={setSearch} onSubmit={handleSearch} placeholder="Cari nomor PO..." />

                    <FilterDropdown
                        value={filters.status}
                        options={STATUS_OPTIONS}
                        allLabel="Semua Status"
                        onChange={(v) => applyFilters({ status: v })}
                    />
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[760px]">
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
                                                <div className="font-medium whitespace-nowrap">
                                                    {new Date(po.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="text-xs whitespace-nowrap text-[var(--grey-text)]">
                                                    {new Date(po.date).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </div>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">{po.branch.name}</TableCell>
                                            <TableCell className="whitespace-nowrap">{po.supplier.name}</TableCell>
                                            <TableCell className="whitespace-nowrap">#{po.po_number}</TableCell>
                                            <TableCell className="whitespace-nowrap">Rp. {Number(po.total_price).toLocaleString('id-ID')}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${statusLabel[po.status].className}`}
                                                >
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
                </div>

                <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <span className="text-sm text-[var(--grey-text)]">
                        Menampilkan {purchaseOrders.from ?? 0}-{purchaseOrders.to ?? 0} dari {purchaseOrders.total} Pembelian
                    </span>

                    <div className="flex items-center gap-3">
                        <Pagination links={purchaseOrders.links} />
                        <PerPageSelect value={filters.per_page ?? '6'} onChange={(v) => applyFilters({ per_page: v })} />
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
