import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components';
import type { InertiaFormProps } from '@inertiajs/react';

interface EmployeeFormData {
    name: string;
    role: string;
    branch: string;
    active_date: string;
    slot_status: string;
    [key: string]: string;
}

interface EmployeeEditModalProps {
    form: InertiaFormProps<EmployeeFormData>;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export function EmployeeEditModal({ form, onSubmit, onClose }: EmployeeEditModalProps) {
    const { data, setData, processing, errors } = form;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">Ubah Data Karyawan</h3>
                    <button onClick={onClose}>
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Nama Karyawan</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Role</label>
                        <select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Cashier">Cashier</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Cabang</label>
                        <input
                            type="text"
                            value={data.branch}
                            onChange={(e) => setData('branch', e.target.value)}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Tanggal Aktif</label>
                        <input
                            type="date"
                            value={data.active_date}
                            onChange={(e) => setData('active_date', e.target.value)}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Slot Status</label>
                        <select
                            value={data.slot_status}
                            onChange={(e) => setData('slot_status', e.target.value)}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="free">Free</option>
                            <option value="premium">Premium</option>
                        </select>
                    </div>

                    <div className="mt-2 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}