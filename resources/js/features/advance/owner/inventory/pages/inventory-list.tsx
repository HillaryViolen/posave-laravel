import { Input } from '@/components';
import { Button } from '@/components/ui';
import { DashboardSidebarLayout } from '@/layouts';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertTriangle, Calendar, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Package, Plus, Printer, Search, XCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [];

export default function DaftarBarang() {
    return (
        <DashboardSidebarLayout title="Daftar Barang" description="Kelola semua kebutuhan anda disini">
            <Head title="Daftar Barang" />
            <div className="flex min-h-screen flex-col gap-6 bg-[var(--page-bg)] p-6">
                <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-10 border-transparent bg-[var(--second-accent)] px-4 text-[var(--subheading)]">
                            OUTLET 1
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                        <div className="flex h-10 items-center overflow-hidden rounded-md border border-[var(--border)] bg-[var(--neutral-white)] shadow-sm">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-full rounded-none border-r border-[var(--border)] px-2 hover:bg-[var(--second-accent)]"
                            >
                                <ChevronLeft className="h-4 w-4 text-[var(--grey-text)]" />
                            </Button>
                            <div className="flex items-center px-4 text-sm font-medium text-[var(--subheading)]">
                                <Calendar className="mr-2 h-4 w-4 text-[var(--grey-text)]" />
                                12 December 2026
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-full rounded-none border-l border-[var(--border)] px-2 hover:bg-[var(--second-accent)]"
                            >
                                <ChevronRight className="h-4 w-4 text-[var(--grey-text)]" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button className="h-10 bg-[var(--surface-header)] text-[var(--text-light)] hover:bg-[var(--surface-header-hover)]">
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Barang
                        </Button>
                        <Button variant="outline" className="h-10 border-[var(--border)] bg-[var(--neutral-white)] text-[var(--subheading)]">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="relative max-w-md flex-1">
                        <Input type="text" placeholder="Search" className="h-10 border-[var(--border)] bg-[var(--neutral-white)] pr-10" />
                        <Search className="absolute top-2.5 right-3 h-5 w-5 text-[var(--grey-text)]" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="h-10 min-w-[140px] justify-between border-[var(--border)] bg-[var(--neutral-white)] text-[var(--subheading)]"
                        >
                            Semua Stok
                            <ChevronDown className="ml-2 h-4 w-4 text-[var(--grey-text)]" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-10 min-w-[160px] justify-between border-[var(--border)] bg-[var(--neutral-white)] text-[var(--subheading)]"
                        >
                            Semua Kategori
                            <ChevronDown className="ml-2 h-4 w-4 text-[var(--grey-text)]" />
                        </Button>
                    </div>
                </div>

                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--second-accent)] text-[var(--grey-text)]">
                            <Package className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[var(--grey-text)]">Total Item</p>
                            <div className="flex items-baseline gap-1">
                                <h3 className="text-2xl font-bold text-[var(--subheading)]">120</h3>
                                <span className="text-xs text-[var(--grey-text)]">Item</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success-background)] text-[var(--success)]">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[var(--grey-text)]">Stok Tersedia</p>
                            <div className="flex items-baseline gap-1">
                                <h3 className="text-2xl font-bold text-[var(--subheading)]">120</h3>
                                <span className="text-xs text-[var(--grey-text)]">Item</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--warning-background)] text-[var(--warning)]">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[var(--grey-text)]">Stok Rendah</p>
                            <div className="flex items-baseline gap-1">
                                <h3 className="text-2xl font-bold text-[var(--subheading)]">120</h3>
                                <span className="text-xs text-[var(--grey-text)]">Item</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--neutral-white)] p-4 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--danger-background)] text-[var(--danger)]">
                            <XCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[var(--grey-text)]">Stok Habis</p>
                            <div className="flex items-baseline gap-1">
                                <h3 className="text-2xl font-bold text-[var(--subheading)]">120</h3>
                                <span className="text-xs text-[var(--grey-text)]">Item</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 rounded-xl bg-[var(--neutral-white)] shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[var(--surface-header)] text-[var(--text-light)]">
                                <tr>
                                    <th className="rounded-tl-xl px-6 py-4 font-medium">Nama Barang</th>
                                    <th className="px-6 py-4 font-medium">Kategori</th>
                                    <th className="px-6 py-4 font-medium">Stok awal</th>
                                    <th className="px-6 py-4 font-medium">Terjual</th>
                                    <th className="px-6 py-4 font-medium">Perubahan</th>
                                    <th className="px-6 py-4 font-medium">Stok Akhir</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="rounded-tr-xl px-6 py-4 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="rounded-b-xl border-x border-b border-[var(--border)] px-6 py-12 text-center text-[var(--grey-text)]"
                                    >
                                        Belum ada barang, tambah barang terlebih dahulu
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
