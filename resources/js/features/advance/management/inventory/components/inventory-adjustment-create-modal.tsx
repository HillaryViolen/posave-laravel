import { Button } from '@/components';
import { useForm } from '@inertiajs/react';
import { ChevronDown, X } from 'lucide-react';
import React from 'react';

interface InventoryItemOption {
    id: number;
    name: string;
    sku: string;
    price: number;
}

interface BranchOption {
    id: number;
    name: string;
}

interface InventoryAdjustmentCreateModalProps {
    inventoryItems: InventoryItemOption[];
    branches: BranchOption[];
    defaultBranchId: number | null;
    lockBranch: boolean;
    onClose: () => void;
}

export function InventoryAdjustmentCreateModal({
    inventoryItems,
    branches,
    defaultBranchId,
    lockBranch,
    onClose,
}: InventoryAdjustmentCreateModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        branch_id: defaultBranchId ? String(defaultBranchId) : '',
        date: new Date().toISOString().slice(0, 10),
        inventory_item_id: '',
        type: 'in',
        quantity: 1,
        note: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.adjustments.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const inputClass =
        'w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

    const lockedBranchName = branches.find((b) => b.id === defaultBranchId)?.name ?? '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">Buat Perubahan Stok</h3>
                    <button
                        type="button"
                        onClick={() => {
                            reset();
                            onClose();
                        }}
                        aria-label="button-x"
                    >
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Cabang</label>
                            {lockBranch ? (
                                // Branch manager: cabang terkunci, gak bisa diganti — sesuai keputusan
                                // "cuma boleh urus stok cabangnya sendiri".
                                <div className={`${inputClass} flex items-center bg-[var(--second-accent)] text-[var(--subheading)]`}>
                                    {lockedBranchName || '-'}
                                </div>
                            ) : (
                                <div className="relative">
                                    <select
                                        aria-label="input-cabang"
                                        value={data.branch_id}
                                        onChange={(e) => setData('branch_id', e.target.value)}
                                        className="border-input focus-visible:ring-ring w-full appearance-none rounded-md border bg-transparent py-2 pr-10 pl-3 text-sm focus-visible:ring-1 focus-visible:outline-none"
                                    >
                                        <option value="" disabled>
                                            Pilih cabang
                                        </option>
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                            )}
                            {errors.branch_id && <span className="text-xs text-red-500">{errors.branch_id}</span>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Tanggal</label>
                            <input
                                aria-label="input-date"
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                style={{ resize: 'none' }}
                                className={inputClass}
                            />
                            {errors.date && <span className="text-xs text-red-500">{errors.date}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Barang</label>
                        <div className="relative">
                            <select
                                aria-label="input-barang"
                                value={data.inventory_item_id}
                                onChange={(e) => setData('inventory_item_id', e.target.value)}
                                className="border-input focus-visible:ring-ring w-full appearance-none rounded-md border bg-transparent py-2 pr-10 pl-3 text-sm focus-visible:ring-1 focus-visible:outline-none"
                            >
                                <option value="" disabled>
                                    Pilih barang
                                </option>
                                {inventoryItems.map((i) => (
                                    <option key={i.id} value={i.id}>
                                        {i.name} ({i.sku})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                        {errors.inventory_item_id && <span className="text-xs text-red-500">{errors.inventory_item_id}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Jenis Perubahan</label>
                            <div className="relative">
                                <select
                                    aria-label="input-perubahan"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="border-input focus-visible:ring-ring w-full appearance-none rounded-md border bg-transparent py-2 pr-10 pl-3 text-sm focus-visible:ring-1 focus-visible:outline-none"
                                >
                                    <option value="in">Barang Masuk (+)</option>
                                    <option value="out">Barang Keluar (-)</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Jumlah (Qty)</label>
                            <input
                                aria-label="input-jumlah"
                                type="number"
                                min={1}
                                value={data.quantity}
                                onChange={(e) => setData('quantity', Number(e.target.value))}
                                style={{ resize: 'none', MozAppearance: 'textfield' }}
                                className={`${inputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                            />
                            {errors.quantity && <span className="text-xs text-red-500">{errors.quantity}</span>}
                        </div>
                    </div>

                    <div>
                        {/* "Catatan" sekarang wajib diisi (backend: required) — ubah label + validasi UI */}
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Catatan</label>
                        <input
                            type="text"
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            placeholder="Cth: Barang rusak, Retur, dll."
                            style={{ resize: 'none' }}
                            className={inputClass}
                        />
                        {errors.note && <span className="text-xs text-red-500">{errors.note}</span>}
                    </div>

                    <div className="mt-2 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-[var(--surface-header)] text-[var(--text-light)]">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
