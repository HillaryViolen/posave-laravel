import { Button, FilterDropdown, Pagination, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { EmployeeActionsMenu, EmployeeDetailModal, EmployeeEditModal } from '@/features/advance/management/employee/components';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { MoreVertical, Plus, Printer } from 'lucide-react';
import React, { useRef, useState } from 'react';

export interface Employee {
    id: number;
    name: string;
    role: string;
    branch_id: number | null;
    branch: { id: number; name: string } | null;
    active_date: string;
    slot_status: string;
    user?: { id: number; email: string };
}

interface Branch {
    id: number;
    name: string;
}

interface EmployeeListProps {
    employees: {
        data: Employee[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    branches: Branch[];
    filters: {
        branch?: string;
    };
    is_branch_manager: boolean;
}

export default function EmployeeList({ employees, branches, filters, is_branch_manager }: EmployeeListProps) {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null);
    const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    const editForm = useForm({
        name: '',
        role: '',
        branch_id: '' as string | number,
        active_date: '',
        slot_status: '',
    });

    const toggleMenu = (id: number) => {
        if (openMenuId === id) {
            setOpenMenuId(null);
            return;
        }
        const btn = buttonRefs.current[id];
        if (btn) {
            const rect = btn.getBoundingClientRect();
            setMenuPosition({ top: rect.bottom + window.scrollY + 4, left: rect.right + window.scrollX - 144 });
        }
        setOpenMenuId(id);
    };

    const closeMenu = () => setOpenMenuId(null);

    const handleShowDetail = (employee: Employee) => {
        setDetailEmployee(employee);
        closeMenu();
    };

    const handleShowEdit = (employee: Employee) => {
        setEditEmployee(employee);
        editForm.setData({
            name: employee.name,
            role: employee.role,
            branch_id: employee.branch_id ?? '',
            active_date: employee.active_date,
            slot_status: employee.slot_status,
        });
        closeMenu();
    };

    const handleCloseEdit = () => {
        setEditEmployee(null);
        editForm.reset();
    };

    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editEmployee) return;
        editForm.put(route('dashboard.employees.update', editEmployee.id), { onSuccess: handleCloseEdit });
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus karyawan ini? Akun login karyawan juga akan terhapus.')) {
            router.delete(route('dashboard.employees.destroy', id));
        }
        closeMenu();
    };

    const handleFilterBranch = (branchId: string | undefined) => {
        router.get(route('dashboard.employees.index'), branchId ? { branch: branchId } : {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const activeMenuEmployee = employees.data.find((e) => e.id === openMenuId);

    const canManage = (employee: Employee) => !is_branch_manager || employee.role === 'cashier';

    return (
        <DashboardSidebarLayout title="Daftar Karyawan" description="Kelola semua daftar karyawan anda">
            <Head title="Daftar Karyawan" />
            <div className="min-h-screen bg-[var(--page-bg)] p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    {!is_branch_manager ? (
                        <FilterDropdown
                            value={filters.branch}
                            options={branches.map((b) => ({ value: String(b.id), label: b.name }))}
                            allLabel="Semua Cabang"
                            onChange={handleFilterBranch}
                        />
                    ) : (
                        <span className="text-sm font-medium text-[var(--grey-text)]">
                            Cabang: <span className="text-[var(--subheading)]">{employees.data[0]?.branch?.name ?? '-'}</span>
                        </span>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-lg bg-[var(--surface-badge)] px-4 py-2 text-sm font-medium text-[var(--subheading)]">
                            Karyawan : {employees.total}
                        </span>
                        {!is_branch_manager && (
                            <Link href={route('dashboard.employees.create')}>
                                <Button className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Karyawan
                                </Button>
                            </Link>
                        )}
                        <Button variant="outline" className="bg-[var(--neutral-white)]">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[900px]">
                            <TableHeader className="bg-[var(--surface-header)]">
                                <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                    <TableHead className="text-[var(--text-light)]">Nama Karyawan</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Email</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Role</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Cabang</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Tanggal Aktif</TableHead>
                                    <TableHead className="text-[var(--text-light)]">Slot Status</TableHead>
                                    <TableHead className="w-[60px] text-[var(--text-light)]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {employees.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-10 text-center text-[var(--grey-text)]">
                                            Belum ada karyawan, tambah karyawan terlebih dahulu
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    employees.data.map((employee) => (
                                        <TableRow key={employee.id}>
                                            <TableCell className="font-medium text-[var(--subheading)]">{employee.name}</TableCell>
                                            <TableCell className="text-[var(--grey-text)]">{employee.user?.email ?? '-'}</TableCell>
                                            <TableCell>
                                                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
                                                    {employee.role}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-[var(--grey-text)]">{employee.branch?.name ?? '-'}</TableCell>
                                            <TableCell className="text-[var(--grey-text)]">{employee.active_date}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        employee.slot_status === 'on_shift'
                                                            ? 'bg-green-100 text-green-600'
                                                            : employee.slot_status === 'off'
                                                              ? 'bg-yellow-100 text-yellow-600'
                                                              : 'bg-gray-100 text-gray-500'
                                                    }`}
                                                >
                                                    {employee.slot_status === 'on_shift'
                                                        ? 'Bertugas'
                                                        : employee.slot_status === 'off'
                                                          ? 'Libur'
                                                          : 'Tersedia'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="relative">
                                                {canManage(employee) ? (
                                                    <Button
                                                        ref={(el) => {
                                                            buttonRefs.current[employee.id] = el;
                                                        }}
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => toggleMenu(employee.id)}
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <button
                                                        aria-label={`Lihat detail ${employee.name}`}
                                                        onClick={() => handleShowDetail(employee)}
                                                        className="text-xs font-medium text-[var(--secondary-700)] hover:underline"
                                                    >
                                                        Lihat
                                                    </button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <Pagination links={employees.links} />
            </div>

            {activeMenuEmployee && (
                <EmployeeActionsMenu
                    employee={activeMenuEmployee}
                    position={menuPosition}
                    onClose={closeMenu}
                    onView={handleShowDetail}
                    onEdit={handleShowEdit}
                    onDelete={handleDelete}
                />
            )}

            {detailEmployee && <EmployeeDetailModal employee={detailEmployee} onClose={() => setDetailEmployee(null)} />}
            {editEmployee && <EmployeeEditModal form={editForm} branches={branches} onSubmit={handleSubmitEdit} onClose={handleCloseEdit} />}
        </DashboardSidebarLayout>
    );
}
