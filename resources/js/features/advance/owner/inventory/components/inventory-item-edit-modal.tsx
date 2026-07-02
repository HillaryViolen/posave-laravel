import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components';
import { useForm } from '@inertiajs/react';
import type { InventoryCategory, InventoryItem } from './inventory-item-actions-menu';

interface InventoryItemEditModalProps {
    item: InventoryItem;
    categories: InventoryCategory[];
    onClose: () => void;
}

export function InventoryItemEditModal({ item, categories, onClose }: InventoryItemEditModalProps) {
    const [preview, setPreview] = useState<string | null>(
        item.image ? `/storage/${item.image}` : null
    );

    const { data, setData, post, processing, errors, reset } = useForm<{
        _method: string;
        name: string;
        sku: string;
        category_id: string;
        image: File | null;
        min_stock: string;
        current_stock: string;
        price: string;
    }>({
        _method: 'PUT',
        name: item.name,
        sku: item.sku,
        category_id: String(item.category_id),
        image: null,
        min_stock: String(item.min_stock),
        current_stock: String(item.current_stock),
        price: String(item.price),
    });

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('image', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.items.update', item.id), {
            forceFormData: true,
            onSuccess: () => { reset(); onClose(); },
        });
    };

    const handleClose = () => { reset(); onClose(); };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            {/* Modal dipadatkan dengan p-5 */}
            <div className="w-full max-w-md rounded-2xl bg-[var(--neutral-white)] p-5 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">Ubah Barang</h3>
                    <button onClick={handleClose}>
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                {/* Hapus max-h dan overflow-y, gunakan gap-3 agar lebih rapat */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    
                    <div>
                        <label className="mb-1 block text-sm font-medium text-[var(--subheading)]">
                            Gambar <span className="text-[var(--grey-text)]">(opsional)</span>
                        </label>
                        {preview && (
                            <img src={preview} alt="preview" className="mb-2 h-16 w-16 rounded-lg object-cover" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm"
                        />
                        {errors.image && <span className="text-sm text-red-500">{errors.image}</span>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-[var(--subheading)]">Nama Barang</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                    </div>

                    {/* PERBAIKAN: SKU dan Kategori digabung jadi 1 baris */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[var(--subheading)]">SKU</label>
                            <input
                                type="text"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                            {errors.sku && <span className="text-xs text-red-500">{errors.sku}</span>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[var(--subheading)]">Kategori</label>
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="" disabled>Pilih Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category_id && <span className="text-xs text-red-500">{errors.category_id}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[var(--subheading)]">Stok Saat Ini</label>
                            <input
                                type="number"
                                min="0"
                                value={data.current_stock}
                                onChange={(e) => setData('current_stock', e.target.value)}
                                className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[var(--subheading)]">Stok Minimum</label>
                            <input
                                type="number"
                                min="0"
                                value={data.min_stock}
                                onChange={(e) => setData('min_stock', e.target.value)}
                                className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-[var(--subheading)]">Harga</label>
                        <input
                            type="number"
                            min="0"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>

                    <div className="mt-3 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={handleClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}