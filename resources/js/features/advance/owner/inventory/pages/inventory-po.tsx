import { Button, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';

import { DashboardSidebarLayout } from '@/layouts';
import { Head } from '@inertiajs/react';

import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, MoreVertical, Plus, Printer, Search } from 'lucide-react';

const purchaseOrders = [
    {
        date: 'Kamis, 12 Desember 2026',
        total: 2,
        items: [
            {
                time: '10:23',
                branch: 'Cabang 1',
                supplier: 'PT. SUMBER JAYHADI',
                number: '#PO-7817',
                total: 'Rp. 1.000.000',
                status: 'waiting',
            },
            {
                time: '10:23',
                branch: 'Cabang 1',
                supplier: 'PT. SUMBER JAYHADI',
                number: '#PO-7817',
                total: 'Rp. 1.000.000',
                status: 'success',
            },
        ],
    },
    {
        date: 'Kamis, 12 Desember 2026',
        total: 2,
        items: [
            {
                time: '10:23',
                branch: 'Cabang 1',
                supplier: 'PT. SUMBER JAYHADI',
                number: '#PO-7817',
                total: 'Rp. 1.000.000',
                status: 'waiting',
            },
            {
                time: '10:23',
                branch: 'Cabang 1',
                supplier: 'PT. SUMBER JAYHADI',
                number: '#PO-7817',
                total: 'Rp. 1.000.000',
                status: 'success',
            },
        ],
    },
];

export default function PurchaseOrderPage() {
    return (
        <DashboardSidebarLayout title="Pembelian" description="Kelola pembelian barang dari pemasok anda">
            <Head title="Pembelian Barang" />
            <div className="min-h-screen bg-[var(--page-bg)] p-6">
                {/* FILTER */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* OUTLET */}
                        <Button variant="outline" className="bg-[var(--neutral-white)]">
                            OUTLET 1
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>

                        {/* DATE */}
                        <div className="flex items-center gap-2 rounded-lg border bg-[var(--neutral-white)] px-3 py-2">
                            <ChevronLeft className="h-4 w-4 cursor-pointer text-[var(--grey-text)]" />

                            <CalendarDays className="h-4 w-4 text-[var(--grey-text)]" />

                            <span className="text-sm font-medium text-[var(--subheading)]">12 December 2026</span>

                            <ChevronRight className="h-4 w-4 cursor-pointer text-[var(--grey-text)]" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]">
                            <Plus className="mr-2 h-4 w-4" />
                            Buat PO
                        </Button>

                        <Button variant="outline" className="bg-[var(--neutral-white)]">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </div>
                </div>

                {/* SEARCH + STATUS */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)]" />

                        <Input placeholder="Search" className="bg-[var(--neutral-white)] pl-10" />
                    </div>

                    <Button variant="outline" className="bg-[var(--neutral-white)]">
                        Semua Status
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                {/* TABLE */}
                <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] shadow-sm">
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
                            {purchaseOrders.map((group, index) => (
                                <>
                                    <TableRow key={`header-${index}`} className="bg-[var(--second-accent)] hover:bg-[var(--second-accent)]">
                                        <TableCell colSpan={6}>
                                            <div className="flex items-center gap-2 font-semibold text-[var(--subheading)]">
                                                <CalendarDays className="h-4 w-4 text-[var(--grey-text)]" />

                                                {group.date}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <span className="rounded-full bg-[var(--surface-badge)] px-3 py-1 text-xs font-medium whitespace-nowrap text-[var(--subheading)]">
                                                {group.total} Pembelian
                                            </span>
                                        </TableCell>
                                    </TableRow>

                                    {group.items.map((item, itemIndex) => (
                                        <TableRow key={`${index}-${itemIndex}`}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-[var(--subheading)]">{item.time}</span>

                                                    <span className="text-xs text-[var(--grey-text)]">12 December 2026</span>
                                                </div>
                                            </TableCell>

                                            <TableCell>{item.branch}</TableCell>

                                            <TableCell className="font-medium">{item.supplier}</TableCell>

                                            <TableCell className="font-medium text-[var(--grey-text)]">{item.number}</TableCell>

                                            <TableCell>{item.total}</TableCell>

                                            <TableCell>
                                                {item.status === 'waiting' ? (
                                                    <span className="rounded-full bg-[var(--warning-background)] px-3 py-1 text-xs font-medium text-[var(--warning)]">
                                                        Waiting Fulfillment
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-[var(--success-background)] px-3 py-1 text-xs font-medium text-[var(--success)]">
                                                        Success
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* PAGINATION */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-[var(--grey-text)]">Menampilkan 1-6 dari 120 Pembelian</p>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <Button className="h-8 w-8 bg-[var(--surface-header)]">1</Button>

                        <Button variant="outline" className="h-8 w-8">
                            2
                        </Button>

                        <Button variant="outline" className="h-8 w-8">
                            3
                        </Button>

                        <Button variant="outline" className="h-8 px-3">
                            ...
                        </Button>

                        <Button variant="outline" className="h-8 px-3">
                            20
                        </Button>

                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button variant="outline" className="bg-[var(--neutral-white)]">
                        6 per halaman
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
