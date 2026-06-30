import { Button, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';

import { DashboardSidebarLayout } from '@/layouts';
import { Head } from '@inertiajs/react';

import { ChevronDown, ChevronLeft, ChevronRight, Eye, MoreVertical, Plus, Printer, Search } from 'lucide-react';

const suppliers = [
    {
        name: 'PT. SUMBER JAYA ABADI',
        category: 'Supplier',
        address: 'Jl. Pakuan No.3, Sumur Batu, Kec. Babakan Madang...',
        phone: '+62 123456789101',
        email: 'mryusnanda@gmail.com',
        color: 'bg-[var(--income-icon-bg)] text-[var(--income-icon-text)]',
    },
    {
        name: 'PT. SUMBER JAYADI',
        category: 'Warehouse',
        address: 'Jl. Pakuan No.3, Sumur Batu, Kec. Babakan Madang...',
        phone: '+62 123456789101',
        email: 'mryusnanda@gmail.com',
        color: 'bg-[var(--success-background)] text-[var(--success)]',
    },
    {
        name: 'PT. SUMBER JAYADI',
        category: 'Store',
        address: 'Jl. Pakuan No.3, Sumur Batu, Kec. Babakan Madang...',
        phone: '+62 123456789101',
        email: 'mryusnanda@gmail.com',
        color: 'bg-[var(--warning-background)] text-[var(--warning)]',
    },
    {
        name: 'PT. SUMBER JAYADI',
        category: 'Distribution & Storage',
        address: 'Jl. Pakuan No.3, Sumur Batu, Kec. Babakan Madang...',
        phone: '+62 123456789101',
        email: 'mryusnanda@gmail.com',
        color: 'bg-[var(--category-bg-color-3)] text-[var(--category-color-1)]',
    },
    {
        name: 'PT. SUMBER JAYADI',
        category: 'Action Pack',
        address: 'Jl. Pakuan No.1, Sumur Batu, Kec. Babakan Madang...',
        phone: '+62 123456789101',
        email: 'mryusnanda@gmail.com',
        color: 'bg-[var(--category-bg-color-1)] text-[var(--category-color-2)]',
    },
];

export default function SupplierPage() {
    return (
        <DashboardSidebarLayout title="Pemasok" description="Kelola daftar pemasok barang-barang anda">
            <Head title="Pemasok Barang" />
            <div className="min-h-screen bg-[var(--page-bg)] p-6">
                {/* FILTER */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-1 items-center gap-3">
                        {/* SEARCH */}
                        <div className="relative w-full max-w-md">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--grey-text)]" />

                            <Input placeholder="Search" className="h-10 bg-[var(--neutral-white)] pl-10" />
                        </div>

                        {/* CATEGORY */}
                        <Button variant="outline" className="h-10 bg-[var(--neutral-white)]">
                            Semua Kategori
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* ADD */}
                        <Button className="h-10 bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]">
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Pemasok
                        </Button>

                        {/* PRINT */}
                        <Button variant="outline" className="h-10 bg-[var(--neutral-white)]">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--neutral-white)] shadow-sm">
                    <Table>
                        <TableHeader className="bg-[var(--surface-header)] hover:bg-[var(--surface-header)]">
                            <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                <TableHead className="text-[var(--text-light)]">Nama Pemasok</TableHead>

                                <TableHead className="text-[var(--text-light)]">Alamat</TableHead>

                                <TableHead className="text-[var(--text-light)]">Nomor Telepon</TableHead>

                                <TableHead className="text-[var(--text-light)]">Email</TableHead>

                                <TableHead className="w-[60px] text-[var(--text-light)]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {suppliers.map((supplier, index) => (
                                <TableRow key={index}>
                                    {/* NAME */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${supplier.color}`}>
                                                <Eye className="h-4 w-4" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-[var(--subheading)]">{supplier.name}</p>

                                                <div
                                                    className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${supplier.color}`}
                                                >
                                                    {supplier.category}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* ADDRESS */}
                                    <TableCell className="max-w-[220px] text-sm text-[var(--grey-text)]">{supplier.address}</TableCell>

                                    {/* PHONE */}
                                    <TableCell className="text-sm text-[var(--grey-text)]">{supplier.phone}</TableCell>

                                    {/* EMAIL */}
                                    <TableCell className="text-sm text-[var(--grey-text)]">{supplier.email}</TableCell>

                                    {/* ACTION */}
                                    <TableCell>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* PAGINATION */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-[var(--grey-text)]">Menampilkan 1-5 dari 120 barang</p>

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

                    <Button variant="outline" className="h-9 bg-[var(--neutral-white)]">
                        6 per halaman
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
