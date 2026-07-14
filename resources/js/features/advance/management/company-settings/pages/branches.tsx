import { CountBadge, CreateButton, PaginationBar, PrintButton, SearchInput } from '@/components';
import { useConfirmAction, useFilters } from '@/hooks';
import { DashboardSidebarLayout } from '@/layouts';
import { Head, useForm } from '@inertiajs/react';
import { MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

interface Branch {
    id: number;
    name: string;
    address: string | null;
    phone: string | null;
    is_main: boolean;
    status: 'open' | 'closed';
}

interface Props {
    branches: {
        data: Branch[];
        total: number;
        from: number;
        to: number;
        per_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        per_page?: string;
    };
}

type ModalMode = 'add' | 'edit' | null;

export default function BranchesPage({ branches, filters = {} }: Props) {
    const [modal, setModal] = useState<ModalMode>(null);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const { search, setSearch, applyFilters, handleSearch } = useFilters('settings.branches', filters);
    const { confirmAndRun } = useConfirmAction();

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        address: '',
        phone: '',
    });

    const openAdd = () => {
        reset();
        setEditingBranch(null);
        setModal('add');
    };

    const openEdit = (branch: Branch) => {
        setData({ name: branch.name, address: branch.address ?? '', phone: branch.phone ?? '' });
        setEditingBranch(branch);
        setModal('edit');
    };

    const closeModal = () => {
        setModal(null);
        setEditingBranch(null);
        reset();
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.branches.store'), { onSuccess: closeModal });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBranch) return;
        put(route('settings.branches.update', editingBranch.id), { onSuccess: closeModal });
    };

    const handleDelete = (branch: Branch) => {
        confirmAndRun(`Hapus cabang "${branch.name}"? Tindakan ini tidak bisa dibatalkan.`, () =>
            destroy(route('settings.branches.destroy', branch.id)),
        );
    };

    const inputClass =
        'w-full rounded-lg border border-[var(--border-strong)] bg-[var(--neutral-white)] px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring transition-all';

    return (
        <DashboardSidebarLayout title="Cabang" description="Kelola seluruh cabang anda">
            <Head title="Kelola Toko" />

            <div className="min-h-screen bg-[var(--page-bg)] p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <SearchInput value={search} onChange={setSearch} onSubmit={handleSearch} placeholder="Cari cabang..." />
                    </div>

                    <div className="flex items-center gap-3">
                        <CountBadge label="Cabang" count={branches.total} />
                        <CreateButton label="Buat Cabang" onClick={openAdd} />
                        <PrintButton label="Cetak" />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--neutral-white)] shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border-strong)] bg-[var(--surface-header)]">
                                <th className="px-6 py-3.5 text-left text-sm font-medium text-[var(--text-light)]">Nama Cabang</th>
                                <th className="px-6 py-3.5 text-left text-sm font-medium text-[var(--text-light)]">Alamat</th>
                                <th className="px-6 py-3.5 text-left text-sm font-medium text-[var(--text-light)]">Nomor Telepon</th>
                                <th className="px-6 py-3.5 text-left text-sm font-medium text-[var(--text-light)]">Status</th>
                                <th className="w-32 px-6 py-3.5 text-left text-sm font-medium text-[var(--text-light)]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-strong)]">
                            {branches.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-sm text-[var(--grey-text)]">
                                        {filters?.search
                                            ? `Cabang "${filters.search}" tidak ditemukan`
                                            : 'Belum ada cabang, buat cabang terlebih dahulu'}
                                    </td>
                                </tr>
                            ) : (
                                branches.data.map((branch) => (
                                    <tr key={branch.id} className="hover:bg-[var(--page-bg)]">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-[var(--grey-text)]">{branch.name}</span>
                                                {branch.is_main && (
                                                    <span className="rounded-full bg-[var(--surface-header)] px-2 py-0.5 text-xs text-[var(--text-light)]">
                                                        Utama
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-1.5 text-sm text-[var(--grey-text)]">
                                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--grey-text-muted)]" aria-hidden="true" />
                                                <span>{branch.address || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-[var(--grey-text)]">
                                                <Phone className="h-4 w-4 flex-shrink-0 text-[var(--grey-text-muted)]" aria-hidden="true" />
                                                <span>{branch.phone || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    branch.status === 'closed' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
                                                }`}
                                            >
                                                {branch.status === 'closed' ? 'Close' : 'Open'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    aria-label={`Edit cabang ${branch.name}`}
                                                    onClick={() => openEdit(branch)}
                                                    className="rounded-lg border border-[var(--border-strong)] px-3 py-1.5 text-xs font-medium text-[var(--grey-text)] transition-all hover:bg-[var(--second-accent)]"
                                                >
                                                    Edit
                                                </button>
                                                {!branch.is_main && (
                                                    <button
                                                        aria-label={`Hapus cabang ${branch.name}`}
                                                        onClick={() => handleDelete(branch)}
                                                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-50"
                                                    >
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <PaginationBar
                    from={branches.from ?? 0}
                    to={branches.to ?? 0}
                    total={branches.total}
                    itemLabel="Cabang"
                    links={branches.links}
                    perPage={filters?.per_page ?? '5'}
                    onPerPageChange={(v) => applyFilters({ per_page: v })}
                />
            </div>

            {modal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="w-full max-w-md rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-base font-medium text-[var(--grey-text)]">{modal === 'add' ? 'Buat Cabang' : 'Edit Cabang'}</h2>
                            <button
                                aria-label="Tutup modal"
                                onClick={closeModal}
                                className="text-[var(--grey-text-muted)] hover:text-[var(--grey-text)]"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={modal === 'add' ? submitAdd : submitEdit}>
                            <div className="mb-4">
                                <label htmlFor="branch-name" className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">
                                    Nama Cabang
                                </label>
                                <input
                                    id="branch-name"
                                    type="text"
                                    aria-label="Nama cabang"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="cth. Cabang Selatan"
                                    className={inputClass}
                                    style={{ borderColor: errors.name ? '#ef4444' : undefined }}
                                    autoFocus
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="branch-address" className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">
                                    Alamat
                                </label>
                                <input
                                    id="branch-address"
                                    type="text"
                                    aria-label="Alamat cabang"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Jl. Sudirman No. 10"
                                    className={inputClass}
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="branch-phone" className="mb-1.5 block text-sm font-medium text-[var(--grey-text)]">
                                    Nomor Telepon
                                </label>
                                <input
                                    id="branch-phone"
                                    type="text"
                                    aria-label="Nomor telepon cabang"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+62 812 3456 7890"
                                    className={inputClass}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    aria-label="Batal"
                                    onClick={closeModal}
                                    className="flex-1 rounded-lg border border-[var(--border-strong)] py-2.5 text-sm font-medium text-[var(--grey-text)] transition-all hover:bg-[var(--second-accent)]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    aria-label={modal === 'add' ? 'Buat cabang baru' : 'Simpan perubahan cabang'}
                                    disabled={processing}
                                    className="flex-1 rounded-lg bg-[var(--surface-header)] py-2.5 text-sm font-medium text-[var(--text-light)] transition-all hover:bg-[var(--surface-header-hover)] disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : modal === 'add' ? 'Buat Cabang' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardSidebarLayout>
    );
}
