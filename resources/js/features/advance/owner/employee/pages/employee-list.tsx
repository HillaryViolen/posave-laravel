import React, { useState, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { DashboardSidebarLayout } from '@/layouts';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { ChevronDown, MoreVertical, Plus, Printer } from 'lucide-react';
import { EmployeeActionsMenu } from '../components/employee-actions-menu';
import { EmployeeDetailModal } from '../components/employee-detail-modal';
import { EmployeeEditModal } from '../components/employee-edit-modal';

export interface Employee {
    id: number;
    name: string;
    role: string;
    branch: string;
    active_date: string;
    slot_status: string;
}

interface EmployeeListProps {
    employees: {
        data: Employee[];
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    branches: string[];
    filters: {
        branch?: string;
    };
}

export default function EmployeeList({ employees, branches, filters }: EmployeeListProps) {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null);
    const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
    const [openBranchFilter, setOpenBranchFilter] = useState(false);
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    const editForm = useForm({
        name: '',
        role: '',
        branch: '',
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
            setMenuPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.right + window.scrollX - 144,
            });
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
            branch: employee.branch,
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

        editForm.put(route('dashboard.employees.update', editEmployee.id), {
            onSuccess: handleCloseEdit,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus karyawan ini?')) {
            router.delete(route('dashboard.employees.destroy', id));
        }
        closeMenu();
    };

    const handleFilterBranch = (branch: string) => {
        router.get(
            route('dashboard.employees.index'),
            branch === 'all' ? {} : { branch },
            { preserveState: true, preserveScroll: true, replace: true }
        );
        setOpenBranchFilter(false);
    };

    const activeMenuEmployee = employees.data.find((e) => e.id === openMenuId);

    return (
        <DashboardSidebarLayout title="Daftar Karyawan" description="kelola semua daftar karyawan anda">
            <Head title="Daftar Karyawan" />
            <div className="min-h-screen bg-[var(--page-bg)] p-6">

                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="relative flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            className="bg-[var(--second-accent)] text-[var(--subheading)]"
                            onClick={() => setOpenBranchFilter(!openBranchFilter)}
                        >
                            {filters.branch ?? 'Semua Cabang'}
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>

                        {openBranchFilter && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenBranchFilter(false)} />

                                <div className="absolute left-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-xl bg-[var(--neutral-white)] py-1 shadow-lg">
                                    <button
                                        onClick={() => handleFilterBranch('all')}
                                        className={`flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-badge)] ${
                                            !filters.branch ? 'font-semibold text-[var(--subheading)]' : 'text-[var(--grey-text)]'
                                        }`}
                                    >
                                        Semua Cabang
                                    </button>

                                    {branches.map((branch) => (
                                        <button
                                            key={branch}
                                            onClick={() => handleFilterBranch(branch)}
                                            className={`flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-badge)] ${
                                                filters.branch === branch ? 'font-semibold text-[var(--subheading)]' : 'text-[var(--grey-text)]'
                                            }`}
                                        >
                                            {branch}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-[var(--surface-badge)] px-4 py-2 text-sm font-medium text-[var(--subheading)]">
                            Karyawan : {employees.total}
                        </span>

                        <Link href={route('dashboard.employees.create')}>
                            <Button className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Karyawan
                            </Button>
                        </Link>

                        <Button variant="outline" className="bg-[var(--neutral-white)]">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                    <Table>
                        <TableHeader className="bg-[var(--surface-header)]">
                            <TableRow className="border-none hover:bg-[var(--surface-header)]">
                                <TableHead className="text-[var(--text-light)]">Nama Karyawan</TableHead>
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
                                    <TableCell colSpan={6} className="py-10 text-center text-[var(--grey-text)]">
                                        Belum ada karyawan, tambah karyawan terlebih dahulu
                                    </TableCell>
                                </TableRow>
                            ) : (
                                employees.data.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell className="font-medium text-[var(--subheading)]">{employee.name}</TableCell>
                                        <TableCell>
                                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
                                                {employee.role}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-[var(--grey-text)]">{employee.branch}</TableCell>
                                        <TableCell className="text-[var(--grey-text)]">{employee.active_date}</TableCell>
                                        <TableCell>
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                employee.slot_status === 'on_shift'
                                                    ? 'bg-green-100 text-green-600'
                                                    : employee.slot_status === 'off'
                                                    ? 'bg-yellow-100 text-yellow-600'
                                                    : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {employee.slot_status === 'on_shift'
                                                    ? 'Bertugas'
                                                    : employee.slot_status === 'off'
                                                    ? 'Libur'
                                                    : 'Tersedia'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="relative">
                                            <Button
                                                ref={(el) => { buttonRefs.current[employee.id] = el; }}
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleMenu(employee.id)}
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

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

            {detailEmployee && (
                <EmployeeDetailModal employee={detailEmployee} onClose={() => setDetailEmployee(null)} />
            )}

            {editEmployee && (
                <EmployeeEditModal form={editForm} onSubmit={handleSubmitEdit} onClose={handleCloseEdit} />
            )}
        </DashboardSidebarLayout>
    );
}