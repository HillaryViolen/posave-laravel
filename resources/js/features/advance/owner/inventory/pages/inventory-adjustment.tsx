import React from 'react';

import { Button, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';

import { DashboardSidebarLayout } from '@/layouts';

import { Head } from '@inertiajs/react';
import { ArrowUpDown, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, MoreVertical, Package, Plus, Printer, Search } from 'lucide-react';

const adjustmentSummary = [
    {
        title: 'Perubahan',
        value: 24,
        description: 'Total Transaksi Perubahan',
        icon: ArrowUpDown,
        iconClass: 'bg-[var(--second-accent)] text-[var(--grey-text)]',
    },
    {
        title: 'Item dirubah',
        value: 2,
        description: 'Jumlah item yang disesuaikan',
        icon: Package,
        iconClass: 'bg-[var(--success-background)] text-[var(--success)]',
    },
    {
        title: 'Total Pemasukan',
        value: 'Rp 2',
        description: 'Dari penyesuaian stok',
        icon: () => <span className="text-lg font-bold">Rp</span>,
        iconClass: 'bg-[var(--income-icon-bg)] text-[var(--income-icon-text)]',
    },
    {
        title: 'Total Pengeluaran',
        value: 'Rp 2',
        description: 'Dari penyesuaian stok',
        icon: () => <span className="text-lg font-bold">Rp</span>,
        iconClass: 'bg-[var(--danger-background)] text-[var(--danger)]',
    },
];

const adjustments = [
    {
        date: 'Kamis, 12 Desember 2026',
        total: 2,
        items: [
            {
                time: '10:23',
                note: 'blablabla',
                product: 'Susu Kental Manis',
                sku: 'SKM - 0871',
                quantity: '+12',
                amount: '+ Rp. 87.000',
                type: 'income',
            },
            {
                time: '10:23',
                note: 'blablabla',
                product: 'Susu Kental Manis',
                sku: 'SKM - 0871',
                quantity: '-12',
                amount: '- Rp. 17.000',
                type: 'expense',
            },
        ],
    },
];

export default function AdjustmentPage() {
    return (
        <DashboardSidebarLayout title="Perubahan" description="Catat semua perubahan stok barang anda (penyesuaian)">
            <Head title="Perubahan Barang" />
            <div className="min-h-screen bg-[var(--page-bg)] p-6">
                {/* FILTER */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button variant="outline" className="bg-[var(--second-accent)] text-[var(--subheading)]">
                            OUTLET 1
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-3 rounded-lg border bg-[var(--neutral-white)] px-4 py-2">
                            <ChevronLeft className="h-4 w-4 cursor-pointer text-[var(--grey-text)]" />

                            <CalendarDays className="h-4 w-4 text-[var(--grey-text)]" />

                            <span className="text-sm font-medium text-[var(--subheading)]">12 December 2026</span>

                            <ChevronRight className="h-4 w-4 cursor-pointer text-[var(--grey-text)]" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]">
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Perubahan
                        </Button>

                        <Button variant="outline" className="bg-[var(--neutral-white)]">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </div>
                </div>

                {/* SEARCH + FILTER */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)]" />

                        <Input placeholder="Search" className="bg-[var(--neutral-white)] pr-10" />
                    </div>

                    <Button variant="outline" className="bg-[var(--neutral-white)]">
                        Semua
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                {/* SUMMARY */}
                <div className="mb-5 grid overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] md:grid-cols-2 lg:grid-cols-4">
                    {adjustmentSummary.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3 border-r border-b border-[var(--border)] p-4 last:border-r-0 md:border-b-0"
                            >
                                <div className={`flex items-center justify-center rounded-full p-3 ${item.iconClass}`}>
                                    <Icon className="h-5 w-5" />
                                </div>

                                <div>
                                    <div className="flex items-end gap-2">
                                        <h3 className="text-xl font-bold text-[var(--subheading)]">{item.value}</h3>
                                    </div>

                                    <p className="text-sm font-medium text-[var(--subheading)]">{item.title}</p>

                                    <p className="text-xs text-[var(--grey-text)]">{item.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* TABLE */}
                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                    <Table>
                        <TableHeader className="bg-[var(--surface-header)]">
                            <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                <TableHead className="text-[var(--text-light)]">Tanggal Perubahan</TableHead>

                                <TableHead className="text-[var(--text-light)]">Catatan</TableHead>

                                <TableHead className="text-[var(--text-light)]">Barang</TableHead>

                                <TableHead className="text-[var(--text-light)]">Perubahan</TableHead>

                                <TableHead className="text-[var(--text-light)]">Pemasukan/Pengeluaran</TableHead>

                                <TableHead className="w-[60px] text-[var(--text-light)]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {adjustments.map((group, groupIndex) => (
                                <React.Fragment key={groupIndex}>
                                    {/* GROUP HEADER */}
                                    <TableRow className="bg-[var(--second-accent)] hover:bg-[var(--second-accent)]">
                                        <TableCell colSpan={5}>
                                            <div className="flex items-center gap-2 font-medium text-[var(--subheading)]">
                                                <CalendarDays className="h-4 w-4 text-[var(--grey-text)]" />

                                                {group.date}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <span className="rounded-full bg-[var(--surface-badge)] px-3 py-1 text-xs font-medium whitespace-nowrap text-[var(--subheading)]">
                                                {group.total} Perubahan
                                            </span>
                                        </TableCell>
                                    </TableRow>

                                    {/* ITEMS */}
                                    {group.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-[var(--subheading)]">{item.time}</span>

                                                    <span className="text-xs text-[var(--grey-text)]">12 December 2026</span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-[var(--grey-text)]">{item.note}</TableCell>

                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-[var(--subheading)]">{item.product}</span>

                                                    <span className="text-xs text-[var(--grey-text)]">{item.sku}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <span
                                                    className={`font-semibold ${item.type === 'income' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}
                                                >
                                                    {item.quantity}
                                                </span>
                                            </TableCell>

                                            <TableCell>
                                                <span
                                                    className={`font-semibold ${item.type === 'income' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}
                                                >
                                                    {item.amount}
                                                </span>
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

                {/* PAGINATION */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-[var(--grey-text)]">Menampilkan 1-6 dari 120 Perubahan</p>

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
