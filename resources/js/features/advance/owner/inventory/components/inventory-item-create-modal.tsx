import React, { useState, useRef } from 'react';
import { X, Package, UploadCloud } from 'lucide-react';
import { Button } from '@/components';
import { useForm } from '@inertiajs/react';
import type { InventoryCategory } from './inventory-item-actions-menu';

interface InventoryItemCreateModalProps {
    categories: InventoryCategory[];
    onClose: () => void;
}

export function InventoryItemCreateModal({ categories, onClose }: InventoryItemCreateModalProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        category_id: string;
        image: File | null;
        min_stock: string;
        current_stock: string;
        price: string;
    }>({
        name: '',
        category_id: '',
        image: null,
        min_stock: '0',
        current_stock: '0',
        price: '0',
    });

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('image', file);
        if (file) setPreview(URL.createObjectURL(file));
        else setPreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.items.store'), {
            forceFormData: true,
            onSuccess: () => { reset(); setPreview(null); onClose(); },
        });
    };

    const handleClose = () => { reset(); setPreview(null); onClose(); };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--neutral-white)] shadow-xl">

                <div className="flex items-start justify-between p-6 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                            <Package className="h-7 w-7 text-gray-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--subheading)]">Buat Barang</h3>
                            <p className="text-sm text-[var(--grey-text)]">Tambah barang baru ke inventori anda</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="mt-1">
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <div className="border-t border-[var(--border-strong)]" />

                <form onSubmit={handleSubmit}>
                    <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto p-6">

                        {/* Nama Barang sekarang dibikin full-width agar tidak ada ruang kosong di sebelahnya */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Nama Barang</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan nama barang"
                                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Kategori</label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="" disabled>Pilih Kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <span className="text-xs text-red-500">{errors.category_id}</span>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Harga</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="0"
                                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                                {errors.price && <span className="text-xs text-red-500">{errors.price}</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Stok Awal</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.current_stock}
                                    onChange={(e) => setData('current_stock', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                                {errors.current_stock && <span className="text-xs text-red-500">{errors.current_stock}</span>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Stok Minimum</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.min_stock}
                                    onChange={(e) => setData('min_stock', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                                <p className="mt-1 text-xs text-[var(--grey-text)]">Jumlah minimum sebelum stok dianggap rendah</p>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                                Gambar <span className="font-normal text-[var(--grey-text)]">(Opsional)</span>
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-[var(--border-strong)] p-4 hover:bg-[var(--surface-badge)] transition-colors"
                            >
                                {preview ? (
                                    <img src={preview} alt="preview" className="h-12 w-12 rounded-lg object-cover" />
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                        <UploadCloud className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-[var(--subheading)]">
                                        {preview ? 'Ganti gambar' : 'Klik untuk upload gambar'}
                                    </p>
                                    <p className="text-xs text-[var(--grey-text)]">PNG, JPG atau WEBP. Maksimal 2MB</p>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                                className="hidden"
                            />
                            {errors.image && <span className="text-xs text-red-500">{errors.image}</span>}
                        </div>

                    </div>

                    <div className="border-t border-[var(--border-strong)] px-6 py-4 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={handleClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Barang'}
                        </Button>
                    </div>
                </form>

            </div>
        </div>
    );
}