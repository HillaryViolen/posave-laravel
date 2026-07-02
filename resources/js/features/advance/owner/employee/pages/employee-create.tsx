import { Button, Input } from '@/components';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import React from 'react';

interface EmployeeCreateProps {
    roles: string[];
}

export default function EmployeeCreate({ roles }: EmployeeCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        role: '',
        branch: '',
        active_date: '',
        slot_status: 'available',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.employees.store'));
    };

    return (
        <DashboardSidebarLayout title="Tambah Karyawan" description="Masukkan data karyawan baru ke dalam sistem">
            <Head title="Tambah Karyawan" />

            <div className="min-h-screen bg-[var(--page-bg)] p-6">
                <div className="mb-5 flex items-center gap-4">
                    <Link href={route('dashboard.employees.index')}>
                        <Button variant="outline" size="icon" className="h-10 w-10 bg-[var(--neutral-white)]">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h2 className="text-xl font-bold text-[var(--subheading)]">Form Karyawan Baru</h2>
                </div>

                <div className="max-w-2xl rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] p-6 shadow-sm">
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Nama Karyawan</label>
                            <Input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Role</label>
                            <select
                                aria-label="role"
                                className="border-input focus-visible:ring-ring w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                            >
                                <option value="" disabled>
                                    Pilih Role
                                </option>
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                            {errors.role && <span className="text-sm text-red-500">{errors.role}</span>}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Cabang</label>
                            <Input type="text" value={data.branch} onChange={(e) => setData('branch', e.target.value)} />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Tanggal Aktif</label>
                            <Input type="date" value={data.active_date} onChange={(e) => setData('active_date', e.target.value)} />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Slot Status</label>
                            <select
                                aria-label="slot"
                                className="border-input focus-visible:ring-ring w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
                                value={data.slot_status}
                                onChange={(e) => setData('slot_status', e.target.value)}
                            >
                                <option value="available">Tersedia</option>
                                <option value="on_shift">Bertugas</option>
                                <option value="off">Libur</option>
                            </select>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Karyawan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardSidebarLayout>
    );
}
