import { Button } from '@/components';
import { X } from 'lucide-react';
import type { Employee } from '../pages/employee-list';

interface EmployeeDetailModalProps {
    employee: Employee;
    onClose: () => void;
}

export function EmployeeDetailModal({ employee, onClose }: EmployeeDetailModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">Detail Karyawan</h3>
                    <button onClick={onClose} aria-label="Tutup modal">
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)]">Nama Karyawan</span>
                        <span className="text-base font-semibold text-[var(--subheading)]">{employee.name}</span>
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)]">Email</span>
                        <span className="text-base text-[var(--subheading)]">{employee.user?.email ?? '-'}</span>
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)]">Role</span>
                        <span className="mt-1 inline-block w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
                            {employee.role}
                        </span>
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)]">Cabang</span>
                        <span className="text-base text-[var(--subheading)]">{employee.branch?.name ?? '-'}</span>
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)]">Tanggal Aktif</span>
                        <span className="text-base text-[var(--subheading)]">{employee.active_date}</span>
                    </div>

                    <div>
                        <span className="block text-sm font-medium text-[var(--grey-text)]">Slot Status</span>
                        <span
                            className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                employee.slot_status === 'on_shift'
                                    ? 'bg-green-100 text-green-600'
                                    : employee.slot_status === 'off'
                                      ? 'bg-yellow-100 text-yellow-600'
                                      : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                            {employee.slot_status === 'on_shift' ? 'Bertugas' : employee.slot_status === 'off' ? 'Libur' : 'Tersedia'}
                        </span>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Tutup
                    </Button>
                </div>
            </div>
        </div>
    );
}
