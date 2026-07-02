import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/components';
import { useForm } from '@inertiajs/react';

interface InventoryItemOption { id: number; name: string; sku: string; price: number; }

interface InventoryAdjustmentCreateModalProps {
    inventoryItems: InventoryItemOption[];
    onClose: () => void;
}

export function InventoryAdjustmentCreateModal({ inventoryItems, onClose }: InventoryAdjustmentCreateModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        branch: '',
        date: new Date().toISOString().slice(0, 10),
        inventory_item_id: '',
        type: 'in',
        quantity: 1,
        note: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.adjustments.store'), {
            onSuccess: () => { reset(); onClose(); },
        });
    };

    const inputClass = "w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">Buat Perubahan Stok</h3>
                    <button type="button" onClick={() => { reset(); onClose(); }}>
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Cabang</label>
                            <input
                                type="text"
                                value={data.branch}
                                onChange={(e) => setData('branch', e.target.value)}
                                placeholder="Nama cabang"
                                style={{ resize: 'none' }}
                                className={inputClass}
                            />
                            {errors.branch && <span className="text-xs text-red-500">{errors.branch}</span>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Tanggal</label>
                            <input
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
                                value={data.inventory_item_id}
                                onChange={(e) => setData('inventory_item_id', e.target.value)}
                                className="w-full appearance-none rounded-md border border-input bg-transparent py-2 pl-3 pr-10 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="" disabled>Pilih barang</option>
                                {inventoryItems.map((i) => (
                                    <option key={i.id} value={i.id}>{i.name} ({i.sku})</option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                        {errors.inventory_item_id && <span className="text-xs text-red-500">{errors.inventory_item_id}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Jenis Perubahan</label>
                            <div className="relative">
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full appearance-none rounded-md border border-input bg-transparent py-2 pl-3 pr-10 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="in">Barang Masuk (+)</option>
                                    <option value="out">Barang Keluar (-)</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Jumlah (Qty)</label>
                            <input
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
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Catatan (Opsional)</label>
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
                        <Button type="button" variant="outline" onClick={() => { reset(); onClose(); }}>Batal</Button>
                        <Button type="submit" disabled={processing} className="bg-[var(--surface-header)] text-[var(--text-light)]">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}