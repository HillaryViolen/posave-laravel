import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { EmployeeActionsMenu, EmployeeDetailModal, EmployeeEditModal } from '@/features/advance/management/employee/components';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ChevronDown, MoreVertical, Plus, Printer } from 'lucide-react';
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
    const [openBranchFilter, setOpenBranchFilter] = useState(false);
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

    const handleFilterBranch = (branchId: string) => {
        router.get(route('dashboard.employees.index'), branchId === 'all' ? {} : { branch: branchId }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
        setOpenBranchFilter(false);
    };

    const activeMenuEmployee = employees.data.find((e) => e.id === openMenuId);
    const activeBranchName = branches.find((b) => String(b.id) === filters.branch)?.name;

    // Branch manager cuma boleh Edit/Hapus karyawan yang role-nya cashier —
    // bukan branch_manager lain (kalaupun kebetulan ada di data yang sama).
    const canManage = (employee: Employee) => !is_branch_manager || employee.role === 'cashier';

    return (
        <DashboardSidebarLayout title="Daftar Karyawan" description="Kelola semua daftar karyawan anda">
            <Head title="Daftar Karyawan" />
            <div className="min-h-screen bg-[var(--page-bg)] p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    {/* Filter Cabang — cuma buat Owner, branch_manager udah pasti 1 cabang */}
                    {!is_branch_manager ? (
                        <div className="relative flex flex-wrap items-center gap-3">
                            <Button
                                variant="outline"
                                className="bg-[var(--second-accent)] text-[var(--subheading)]"
                                onClick={() => setOpenBranchFilter(!openBranchFilter)}
                            >
                                {activeBranchName ?? 'Semua Cabang'}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>

                            {openBranchFilter && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setOpenBranchFilter(false)} />
                                    <div className="absolute top-full left-0 z-50 mt-1 w-48 overflow-hidden rounded-xl bg-[var(--neutral-white)] py-1 shadow-lg">
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
                                                key={branch.id}
                                                onClick={() => handleFilterBranch(String(branch.id))}
                                                className={`flex w-full items-center px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-badge)] ${
                                                    filters.branch === String(branch.id)
                                                        ? 'font-semibold text-[var(--subheading)]'
                                                        : 'text-[var(--grey-text)]'
                                                }`}
                                            >
                                                {branch.name}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <span className="text-sm font-medium text-[var(--grey-text)]">
                            Cabang: <span className="text-[var(--subheading)]">{employees.data[0]?.branch?.name ?? '-'}</span>
                        </span>
                    )}

                    <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-[var(--surface-badge)] px-4 py-2 text-sm font-medium text-[var(--subheading)]">
                            Karyawan : {employees.total}
                        </span>
                        <Link href={route('dashboard.employees.create')}>
                            {!is_branch_manager && (
                                <Link href={route('dashboard.employees.create')}>
                                    <Button className="bg-[var(--surface-header)] hover:bg-[var(--surface-header-hover)]">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Karyawan
                                    </Button>
                                </Link>
                            )}
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

                {employees.links.length > 3 && (
                    <div className="mt-4 flex items-center justify-center gap-1">
                        {employees.links.map((link, i) => (
                            <button
                                aria-label="button"
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`rounded-lg px-3 py-1.5 text-sm ${
                                    link.active
                                        ? 'bg-[var(--surface-header)] font-medium text-white'
                                        : 'bg-[var(--neutral-white)] text-[var(--grey-text)] hover:bg-[var(--surface-badge)] disabled:cursor-not-allowed disabled:opacity-40'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
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
