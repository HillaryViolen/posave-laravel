import {
    Button,
    DateNavigator,
    FilterDropdown,
    Pagination,
    SearchInput,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components';
import { InventoryTransferCreateModal, TransferRejectModal } from '@/features/advance/management/inventory/components';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, Check, Plus, Printer, X as XIcon } from 'lucide-react';
import React, { useState } from 'react';

interface BranchOption {
    id: number;
    name: string;
}
interface InventoryItemOption {
    id: number;
    name: string;
    sku: string;
}

interface Transfer {
    id: number;
    transfer_number: string;
    date: string;
    status: 'waiting' | 'success' | 'rejected';
    rejection_note: string | null;
    items_count: number;
    sender_branch: BranchOption;
    receiver_branch: BranchOption;
}

interface InventoryTransferListProps {
    transfers: {
        data: Transfer[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number;
        to: number;
        total: number;
    };
    inventoryItems: InventoryItemOption[];
    branches: BranchOption[];
    my_branch_id: number | null;
    incoming_pending_count: number;
    is_branch_manager: boolean;
    filters: { date?: string; status?: string; search?: string; per_page?: string; view?: string };
}

const statusLabel: Record<string, { text: string; className: string }> = {
    waiting: { text: 'Menunggu', className: 'bg-yellow-100 text-yellow-600' },
    success: { text: 'Diterima', className: 'bg-green-100 text-green-600' },
    rejected: { text: 'Ditolak', className: 'bg-red-100 text-red-600' },
};

const STATUS_OPTIONS = [
    { value: 'waiting', label: 'Menunggu' },
    { value: 'success', label: 'Diterima' },
    { value: 'rejected', label: 'Ditolak' },
];

export default function InventoryTransferList({
    transfers,
    inventoryItems,
    branches,
    my_branch_id,
    incoming_pending_count,
    is_branch_manager,
    filters,
}: InventoryTransferListProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [rejectTarget, setRejectTarget] = useState<Transfer | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');

    const currentDate = filters.date ?? new Date().toISOString().slice(0, 10);

    const applyFilters = (overrides: Record<string, string | undefined>) => {
        router.get(
            route('dashboard.inventory.transfers.index'),
            { ...filters, ...overrides },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: search || undefined });
    };

    const handleAccept = (transfer: Transfer) => {
        if (!confirm(`Terima kiriman ${transfer.transfer_number}? Stok akan langsung dipindahkan.`)) return;
        router.patch(route('dashboard.inventory.transfers.accept', transfer.id));
    };

    const handleCancel = (transfer: Transfer) => {
        if (!confirm(`Batalkan permintaan kiriman ${transfer.transfer_number}?`)) return;
        router.delete(route('dashboard.inventory.transfers.destroy', transfer.id));
    };

    const showingIncomingTab = filters.view === 'incoming';

    return (
        <DashboardSidebarLayout title="Kiriman" description="Kelola pengiriman barang antar cabang anda">
            <Head title="Kiriman" />
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--page-bg)] p-4 sm:p-6">
                {/* Notifikasi: ada kiriman masuk yang perlu keputusan saya */}
                {incoming_pending_count > 0 && !showingIncomingTab && (
                    <button
                        onClick={() => applyFilters({ view: 'incoming', status: undefined })}
                        className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-3 text-left transition hover:bg-amber-100"
                    >
                        <span className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            {incoming_pending_count} kiriman menunggu konfirmasi kamu
                        </span>
                        <span className="text-xs font-medium whitespace-nowrap text-amber-700 underline">Lihat</span>
                    </button>
                )}

                {showingIncomingTab && (
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--second-accent)] px-4 py-2.5">
                        <span className="text-sm font-medium text-[var(--subheading)]">Menampilkan: Perlu Konfirmasi Saya</span>
                        <button
                            onClick={() => applyFilters({ view: undefined })}
                            className="text-xs font-medium whitespace-nowrap text-[var(--secondary-700)] hover:underline"
                        >
                            Lihat Semua
                        </button>
                    </div>
                )}

                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <DateNavigator date={currentDate} onChange={(date) => applyFilters({ date })} variant="default" size="sm" />

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Kiriman
                        </Button>
                        <Button variant="outline" className="bg-[var(--neutral-white)]">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </div>
                </div>

                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <SearchInput value={search} onChange={setSearch} onSubmit={handleSearch} placeholder="Cari nomor kiriman..." />

                    <FilterDropdown
                        value={filters.status}
                        options={STATUS_OPTIONS}
                        allLabel="Semua Status"
                        onChange={(v) => applyFilters({ status: v })}
                    />
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[860px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-[var(--text-light)]">Tanggal</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Pengirim</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Penerima</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Nomor Kiriman</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Barang</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Status</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {transfers.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-10 text-center text-[var(--grey-text)]">
                                            Belum ada kiriman
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transfers.data.map((transfer) => {
                                        const iAmReceiverWaiting = transfer.receiver_branch.id === my_branch_id && transfer.status === 'waiting';
                                        const iAmSenderWaiting = transfer.sender_branch.id === my_branch_id && transfer.status === 'waiting';

                                        return (
                                            <TableRow key={transfer.id} className={iAmReceiverWaiting ? 'bg-amber-50/50' : ''}>
                                                <TableCell>
                                                    <div className="text-xs whitespace-nowrap text-[var(--grey-text)]">
                                                        {new Date(transfer.date).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">{transfer.sender_branch.name}</TableCell>
                                                <TableCell className="whitespace-nowrap">{transfer.receiver_branch.name}</TableCell>
                                                <TableCell className="whitespace-nowrap">#{transfer.transfer_number}</TableCell>
                                                <TableCell className="whitespace-nowrap">{transfer.items_count} barang</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${statusLabel[transfer.status].className}`}
                                                    >
                                                        {statusLabel[transfer.status].text}
                                                    </span>
                                                    {transfer.status === 'rejected' && transfer.rejection_note && (
                                                        <p
                                                            className="mt-1 max-w-[180px] truncate text-xs text-[var(--grey-text)]"
                                                            title={transfer.rejection_note}
                                                        >
                                                            "{transfer.rejection_note}"
                                                        </p>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {iAmReceiverWaiting && (
                                                        <div className="flex gap-1.5">
                                                            <button
                                                                aria-label={`Terima kiriman ${transfer.transfer_number}`}
                                                                onClick={() => handleAccept(transfer)}
                                                                className="flex shrink-0 items-center gap-1 rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-white hover:bg-green-700"
                                                            >
                                                                <Check className="h-3.5 w-3.5" /> Terima
                                                            </button>
                                                            <button
                                                                aria-label={`Tolak kiriman ${transfer.transfer_number}`}
                                                                onClick={() => setRejectTarget(transfer)}
                                                                className="flex shrink-0 items-center gap-1 rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-red-600 hover:bg-red-200"
                                                            >
                                                                <XIcon className="h-3.5 w-3.5" /> Tolak
                                                            </button>
                                                        </div>
                                                    )}
                                                    {iAmSenderWaiting && (
                                                        <button
                                                            aria-label={`Batalkan kiriman ${transfer.transfer_number}`}
                                                            onClick={() => handleCancel(transfer)}
                                                            className="rounded-lg border border-[var(--border-strong)] px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-[var(--grey-text)] hover:bg-[var(--second-accent)]"
                                                        >
                                                            Batalkan
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

                <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <span className="text-sm text-[var(--grey-text)]">
                        Menampilkan {transfers.from ?? 0}-{transfers.to ?? 0} dari {transfers.total} Kiriman
                    </span>
                    <Pagination links={transfers.links} />
                </div>
            </div>

            {showCreateModal && (
                <InventoryTransferCreateModal
                    inventoryItems={inventoryItems}
                    branches={branches}
                    myBranchId={my_branch_id}
                    isBranchManager={is_branch_manager}
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            {rejectTarget && (
                <TransferRejectModal
                    transferId={rejectTarget.id}
                    transferNumber={rejectTarget.transfer_number}
                    onClose={() => setRejectTarget(null)}
                />
            )}
        </DashboardSidebarLayout>
    );
}
