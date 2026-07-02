import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components';
import { useForm } from '@inertiajs/react';

interface InventoryItemOption { id: number; name: string; sku: string; }

interface InventoryTransferCreateModalProps {
    inventoryItems: InventoryItemOption[];
    onClose: () => void;
}

export function InventoryTransferCreateModal({ inventoryItems, onClose }: InventoryTransferCreateModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        sender_branch: '',
        receiver_branch: '',
        date: new Date().toISOString().slice(0, 10),
        items: [{ inventory_item_id: '', quantity: 1 }] as { inventory_item_id: string; quantity: number }[],
    });

    const addItem = () => {
        setData('items', [...data.items, { inventory_item_id: '', quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: 'inventory_item_id' | 'quantity', value: string | number) => {
        const items = [...data.items];
        items[index] = { ...items[index], [field]: value };
        setData('items', items);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.transfers.store'), {
            onSuccess: () => { reset(); onClose(); },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">Buat Kiriman Baru</h3>
                    <button onClick={() => { reset(); onClose(); }}>
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Toko Pengirim</label>
                            <input
                                type="text"
                                value={data.sender_branch}
                                onChange={(e) => setData('sender_branch', e.target.value)}
                                placeholder="Nama toko pengirim"
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                            />
                            {errors.sender_branch && <span className="text-sm text-red-500">{errors.sender_branch}</span>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Toko Penerima</label>
                            <input
                                type="text"
                                value={data.receiver_branch}
                                onChange={(e) => setData('receiver_branch', e.target.value)}
                                placeholder="Nama toko penerima"
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                            />
                            {errors.receiver_branch && <span className="text-sm text-red-500">{errors.receiver_branch}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Tanggal Kirim</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-sm font-medium text-[var(--subheading)]">Barang</label>
                            <button type="button" onClick={addItem} className="flex items-center gap-1 text-sm text-orange-500">
                                <Plus className="h-4 w-4" /> Tambah Barang
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            {data.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <select
                                        value={item.inventory_item_id}
                                        onChange={(e) => updateItem(index, 'inventory_item_id', e.target.value)}
                                        className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                    >
                                        <option value="">Pilih barang</option>
                                        {inventoryItems.map((i) => (
                                            <option key={i.id} value={i.id}>{i.name} ({i.sku})</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                                        className="w-20 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                    />
                                    {data.items.length > 1 && (
                                        <button type="button" onClick={() => removeItem(index)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.items && <span className="text-sm text-red-500">{errors.items}</span>}
                    </div>

                    <div className="mt-2 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => { reset(); onClose(); }}>Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Buat Kiriman'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}