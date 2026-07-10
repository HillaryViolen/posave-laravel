import { Button } from '@/components';
import type { InertiaFormProps } from '@inertiajs/react';
import { X } from 'lucide-react';
import React from 'react';

interface Branch {
    id: number;
    name: string;
}

interface EmployeeFormData {
    name: string;
    role: string;
    branch_id: string | number;
    active_date: string;
    slot_status: string;
    [key: string]: string | number;
}

interface EmployeeEditModalProps {
    form: InertiaFormProps<EmployeeFormData>;
    branches: Branch[];
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export function EmployeeEditModal({ form, branches, onSubmit, onClose }: EmployeeEditModalProps) {
    const { data, setData, processing, errors } = form;

    const selectClass =
        'border-input focus-visible:ring-ring w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">Ubah Data Karyawan</h3>
                    <button onClick={onClose} aria-label="Tutup modal">
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="edit-name" className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            Nama Karyawan
                        </label>
                        <input
                            id="edit-name"
                            aria-label="Nama karyawan"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={selectClass}
                        />
                        {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                    </div>

                    <div>
                        <label htmlFor="edit-role" className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            Role
                        </label>
                        <select
                            id="edit-role"
                            aria-label="Role karyawan"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className={selectClass}
                        >
                            <option value="branch_manager">Branch Manager</option>
                            <option value="cashier">Cashier</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="edit-branch" className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            Cabang
                        </label>
                        <select
                            id="edit-branch"
                            aria-label="Cabang karyawan"
                            value={data.branch_id}
                            onChange={(e) => setData('branch_id', e.target.value)}
                            className={selectClass}
                        >
                            <option value="" disabled>
                                Pilih Cabang
                            </option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                        {errors.branch_id && <span className="text-sm text-red-500">{errors.branch_id as string}</span>}
                    </div>

                    <div>
                        <label htmlFor="edit-date" className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            Tanggal Aktif
                        </label>
                        <input
                            id="edit-date"
                            aria-label="Tanggal aktif karyawan"
                            type="date"
                            value={data.active_date}
                            onChange={(e) => setData('active_date', e.target.value)}
                            className={selectClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-slot" className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                            Slot Status
                        </label>
                        <select
                            id="edit-slot"
                            aria-label="Slot status karyawan"
                            value={data.slot_status}
                            onChange={(e) => setData('slot_status', e.target.value)}
                            className={selectClass}
                        >
                            <option value="available">Tersedia</option>
                            <option value="on_shift">Bertugas</option>
                            <option value="off">Libur</option>
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
