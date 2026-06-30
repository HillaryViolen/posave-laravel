import { Button, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';

import { DashboardSidebarLayout } from '@/layouts';
import { Head } from '@inertiajs/react';

import { Apple, ChevronDown, ChevronLeft, ChevronRight, Home, MoreVertical, Package, Plus, Printer, Search, Store, Wheat } from 'lucide-react';

const categories = [
    {
        name: 'Sembako',
        totalItems: 10,
        icon: Store,
        iconClass: 'bg-[var(--income-icon-bg)] text-[var(--income-icon-text)]',
        badgeClass: 'bg-[var(--income-icon-bg)] text-[var(--income-icon-text)]',
    },
    {
        name: 'Minuman',
        totalItems: 10,
        icon: Apple,
        iconClass: 'bg-[var(--success-background)] text-[var(--success)]',
        badgeClass: 'bg-[var(--success-background)] text-[var(--success)]',
    },
    {
        name: 'Snack',
        totalItems: 10,
        icon: Package,
        iconClass: 'bg-[var(--warning-background)] text-[var(--warning)]',
        badgeClass: 'bg-[var(--warning-background)] text-[var(--warning)]',
    },
    {
        name: 'Kebutuhan Rumah Tangga',
        totalItems: 10,
        icon: Home,
        iconClass: 'bg-[var(--category-bg-color-3)] text-[var(--category-color-1)]',
        badgeClass: 'bg-[var(--category-bg-color-3)] text-[var(--category-color-1)]',
    },
    {
        name: 'Bahan Pokok',
        totalItems: 10,
        icon: Wheat,
        iconClass: 'bg-[var(--category-bg-color-1)] text-[var(--category-color-2)]',
        badgeClass: 'bg-[var(--category-bg-color-1)] text-[var(--category-color-2)]',
    },
];

export default function InventoryCategoryPage() {
    return (
        <DashboardSidebarLayout title="Kategori" description="Kelola daftar kategori untuk barang-barang anda">
            <Head title="Kategori Barang" />
            <div className="min-h-screen bg-[var(--page-bg)] p-6">
                {/* FILTER */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="relative w-full max-w-md flex-1">
                        <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)]" />

                        <Input placeholder="Search" className="bg-[var(--neutral-white)] pr-10" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button variant="outline" className="bg-[var(--neutral-white)]">
                            Semua Kategori
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>

                        <Button className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]">
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Kategori
                        </Button>

                        <Button variant="outline" className="bg-[var(--neutral-white)]">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                    <Table>
                        <TableHeader className="bg-[var(--surface-header)]">
                            <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                <TableHead className="text-[var(--text-light)]">Nama Kategori</TableHead>

                                <TableHead className="text-[var(--text-light)]">Barang Terdaftar</TableHead>

                                <TableHead className="w-[60px] text-right text-[var(--text-light)]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {categories.map((category, index) => {
                                const Icon = category.icon;

                                return (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${category.iconClass}`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>

                                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${category.badgeClass}`}>
                                                    {category.name}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="font-medium text-[var(--grey-text)]">{category.totalItems} Barang</TableCell>

                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* PAGINATION */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-[var(--grey-text)]">Menampilkan 1-5 dari 1 Halaman</p>

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
                        5 per halaman
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
