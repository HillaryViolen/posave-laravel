import { Button, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { DashboardSidebarLayout } from '@/layouts';
import { Head } from '@inertiajs/react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, MoreVertical, Plus, Printer, Search } from 'lucide-react';
import React from 'react';

const transfers = [
    {
        date: 'Kamis, 12 Desember 2026',
        total: 2,
        items: [
            {
                time: '10:23',
                sender: 'Cabang 1',
                receiver: 'Cabang 2',
                number: '#KI-7817',
                items: 2,
                status: 'waiting',
            },
            {
                time: '10:23',
                sender: 'Cabang 1',
                receiver: 'Cabang 2',
                number: '#KI-7817',
                items: 2,
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
                sender: 'Cabang 1',
                receiver: 'Cabang 2',
                number: '#KI-7817',
                items: 2,
                status: 'waiting',
            },
            {
                time: '10:23',
                sender: 'Cabang 1',
                receiver: 'Cabang 2',
                number: '#KI-7817',
                items: 2,
                status: 'success',
            },
        ],
    },
];

export default function TransferPage() {
    return (
        <DashboardSidebarLayout title="Kiriman" description="Kelola pembelian barang dari pemasok anda">
            <Head title="Kirim Barang" />
            <div className="min-h-screen bg-[var(--page-bg)] p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button variant="outline" className="bg-[var(--neutral-white)]">
                            OUTLET 1
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-3 rounded-lg border bg-[var(--neutral-white)] px-4 py-2">
                            <ChevronLeft className="h-4 w-4 cursor-pointer text-[var(--grey-text-muted)]" />
                            <CalendarDays className="h-4 w-4 text-[var(--grey-text-muted)]" />
                            <span className="text-sm font-medium text-[var(--primary-700)]">12 December 2026</span>
                            <ChevronRight className="h-4 w-4 cursor-pointer text-[var(--grey-text-muted)]" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button className="bg-[var(--primary-800)] text-[var(--neutral-white)] hover:bg-[var(--primary-700)]">
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Kiriman
                        </Button>

                        <Button variant="outline" className="bg-[var(--neutral-white)]">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </div>
                </div>

                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text-muted)]" />
                        <Input placeholder="Search" className="bg-[var(--neutral-white)] pl-10" />
                    </div>

                    <Button variant="outline" className="bg-[var(--neutral-white)]">
                        Semua Status
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                    <Table>
                        <TableHeader className="bg-[var(--surface-header)]">
                            <TableRow className="border-none hover:bg-[var(--surface-header-hover)]">
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
                            {transfers.map((group, groupIndex) => (
                                <React.Fragment key={groupIndex}>
                                    <TableRow className="bg-[var(--second-accent)] hover:bg-[var(--second-accent)]">
                                        <TableCell colSpan={6}>
                                            <div className="flex items-center gap-2 font-medium text-[var(--primary-700)]">
                                                <CalendarDays className="h-4 w-4 text-[var(--grey-text-muted)]" />
                                                {group.date}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <span className="rounded-full bg-[var(--surface-badge)] px-3 py-1 text-xs font-medium whitespace-nowrap text-[var(--primary-700)]">
                                                {group.total} PO
                                            </span>
                                        </TableCell>
                                    </TableRow>

                                    {group.items.map((transfer, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-[var(--primary-700)]">{transfer.time}</span>
                                                    <span className="text-xs text-[var(--grey-text-muted)]">12 December 2026</span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="font-medium text-[var(--grey-text)]">{transfer.sender}</TableCell>

                                            <TableCell className="font-medium text-[var(--grey-text)]">{transfer.receiver}</TableCell>

                                            <TableCell className="font-semibold text-[var(--primary-700)]">{transfer.number}</TableCell>

                                            <TableCell className="font-medium text-[var(--grey-text)]">{transfer.items} barang</TableCell>

                                            <TableCell>
                                                {transfer.status === 'waiting' ? (
                                                    <span className="rounded-full bg-[var(--warning-background)] px-3 py-1 text-xs font-medium text-[var(--warning)]">
                                                        Waiting
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
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-[var(--grey-text-muted)]">Menampilkan 1-6 dari 120 Kiriman</p>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button className="h-8 w-8 bg-[var(--primary-800)] text-[var(--neutral-white)]">1</Button>
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
