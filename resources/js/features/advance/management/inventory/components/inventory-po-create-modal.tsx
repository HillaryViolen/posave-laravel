import { Button } from '@/components';
import { useForm } from '@inertiajs/react';
import { ChevronDown, Plus, Trash2, X } from 'lucide-react';
import React from 'react';

interface Supplier {
    id: number;
    name: string;
}
interface BranchOption {
    id: number;
    name: string;
}
interface InventoryItemOption {
    id: number;
    name: string;
    sku: string;
    price: number;
}

interface InventoryPurchaseOrderCreateModalProps {
    suppliers: Supplier[];
    inventoryItems: InventoryItemOption[];
    branches: BranchOption[];
    myBranchId: number | null;
    isBranchManager: boolean;
    onClose: () => void;
}

export function InventoryPurchaseOrderCreateModal({
    suppliers,
    inventoryItems,
    branches,
    myBranchId,
    isBranchManager,
    onClose,
}: InventoryPurchaseOrderCreateModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        branch_id: isBranchManager && myBranchId ? String(myBranchId) : '',
        supplier_id: '',
        date: new Date().toISOString().slice(0, 10),
        items: [{ inventory_item_id: '', quantity: 1, price: 0 }] as { inventory_item_id: string; quantity: number; price: number }[],
    });

    const addItem = () => {
        setData('items', [...data.items, { inventory_item_id: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (index: number) => {
        setData(
            'items',
            data.items.filter((_, i) => i !== index),
        );
    };

    const updateItem = (index: number, field: 'inventory_item_id' | 'quantity' | 'price', value: string | number) => {
        const items = [...data.items];
        items[index] = { ...items[index], [field]: value };

        if (field === 'inventory_item_id') {
            const selected = inventoryItems.find((i) => String(i.id) === String(value));
            if (selected) {
                items[index].price = selected.price;
            }
        }

        setData('items', items);
    };

    const totalPrice = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.purchase-orders.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const lockedBranchName = branches.find((b) => b.id === myBranchId)?.name ?? '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">Buat PO Baru</h3>
                    <button
                        type="button"
                        onClick={() => {
                            reset();
                            onClose();
                        }}
                        aria-label="Tutup"
                    >
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="-mx-1 flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-1">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Cabang</label>
                            {isBranchManager ? (
                                <div className="border-input flex w-full items-center rounded-md border bg-[var(--second-accent)] px-3 py-2 text-sm text-[var(--subheading)]">
                                    {lockedBranchName || '-'}
                                </div>
                            ) : (
                                <div className="relative">
                                    <select
                                        aria-label="Pilih cabang"
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
                            {errors.branch_id && <span className="text-sm text-red-500">{errors.branch_id}</span>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Pemasok</label>
                            <div className="relative">
                                <select
                                    aria-label="Pilih pemasok"
                                    value={data.supplier_id}
                                    onChange={(e) => setData('supplier_id', e.target.value)}
                                    className="border-input focus-visible:ring-ring w-full appearance-none rounded-md border bg-transparent py-2 pr-10 pl-3 text-sm focus-visible:ring-1 focus-visible:outline-none"
                                >
                                    <option value="" disabled>
                                        Pilih pemasok
                                    </option>
                                    {suppliers.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                            {errors.supplier_id && <span className="text-sm text-red-500">{errors.supplier_id}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Tanggal PO</label>
                        <input
                            aria-label="Tanggal PO"
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            className="border-input focus-visible:ring-ring w-full rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none"
                        />
                        {errors.date && <span className="text-sm text-red-500">{errors.date}</span>}
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-sm font-medium text-[var(--subheading)]">Barang</label>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
                            >
                                <Plus className="h-4 w-4" /> Tambah Barang
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {data.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <select
                                            aria-label="Pilih barang"
                                            value={item.inventory_item_id}
                                            onChange={(e) => updateItem(index, 'inventory_item_id', e.target.value)}
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
                                    <input
                                        aria-label="Jumlah"
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                                        className="border-input focus-visible:ring-ring w-20 rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none"
                                        placeholder="Qty"
                                    />
                                    <input
                                        aria-label="Harga"
                                        type="number"
                                        min={0}
                                        value={item.price}
                                        onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                                        className="border-input focus-visible:ring-ring w-28 rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none"
                                        placeholder="Harga"
                                    />
                                    {data.items.length > 1 && (
                                        <button
                                            type="button"
                                            aria-label="Hapus barang ini"
                                            onClick={() => removeItem(index)}
                                            className="rounded-md p-1 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-5 w-5 text-red-500" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.items && <span className="text-sm text-red-500">{errors.items}</span>}
                    </div>

                    <div className="mt-2 flex items-center justify-between rounded-lg bg-[var(--page-bg)] px-4 py-3">
                        <span className="text-sm font-medium text-[var(--subheading)]">Total Harga</span>
                        <span className="text-base font-bold text-[var(--subheading)]">Rp {totalPrice.toLocaleString('id-ID')}</span>
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
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Buat PO'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
