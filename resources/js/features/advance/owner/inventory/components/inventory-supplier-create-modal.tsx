import React, { useState, useRef } from 'react';
import { X, Store, UploadCloud } from 'lucide-react';
import { Button } from '@/components';
import { useForm } from '@inertiajs/react';

interface InventorySupplierCreateModalProps {
    onClose: () => void;
}

export function InventorySupplierCreateModal({ onClose }: InventorySupplierCreateModalProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        category: string;
        address: string;
        phone: string;
        email: string;
        logo: File | null;
    }>({
        name: '',
        category: '',
        address: '',
        phone: '',
        email: '',
        logo: null,
    });

    const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);
        if (file) setPreview(URL.createObjectURL(file));
        else setPreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.suppliers.store'), {
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
                            <Store className="h-7 w-7 text-gray-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--subheading)]">Buat Pemasok</h3>
                            <p className="text-sm text-[var(--grey-text)]">Tambah pemasok baru ke daftar anda</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="mt-1">
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <div className="border-t border-[var(--border-strong)]" />

                <form onSubmit={handleSubmit}>
                    <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto p-6">

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Nama Pemasok</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: PT. Sumber Jahyadi"
                                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                                {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Kategori</label>
                                <input
                                    type="text"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    placeholder="Contoh: Sembako, Minuman..."
                                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                                {errors.category && <span className="text-xs text-red-500">{errors.category}</span>}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Alamat</label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Alamat lengkap pemasok"
                                rows={2}
                                className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                            {errors.address && <span className="text-xs text-red-500">{errors.address}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Nomor Telepon</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+62..."
                                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                                {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@contoh.com"
                                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                                {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">
                                Logo <span className="font-normal text-[var(--grey-text)]">(Opsional)</span>
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-[var(--border-strong)] p-4 transition-colors hover:bg-[var(--surface-badge)]"
                            >
                                {preview ? (
                                    <img src={preview} alt="preview" className="h-12 w-12 rounded-full object-cover" />
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                        <UploadCloud className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-[var(--subheading)]">
                                        {preview ? 'Ganti logo' : 'Klik untuk upload logo'}
                                    </p>
                                    <p className="text-xs text-[var(--grey-text)]">PNG, JPG atau WEBP. Maksimal 2MB</p>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleLogo}
                                className="hidden"
                            />
                            {errors.logo && <span className="text-xs text-red-500">{errors.logo}</span>}
                        </div>

                    </div>

                    <div className="flex justify-end gap-2 border-t border-[var(--border-strong)] px-6 py-4">
                        <Button type="button" variant="outline" onClick={handleClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Pemasok'}
                        </Button>
                    </div>
                </form>

            </div>
        </div>
    );
}