import { Button } from '@/components';
import { useForm } from '@inertiajs/react';
import { ArrowRight, ChevronDown, Plus, Trash2, X } from 'lucide-react';
import React from 'react';

interface BranchOption {
    id: number;
    name: string;
}
interface InventoryItemOption {
    id: number;
    name: string;
    sku: string;
}

interface InventoryTransferCreateModalProps {
    inventoryItems: InventoryItemOption[];
    branches: BranchOption[];
    myBranchId: number | null;
    isBranchManager: boolean;
    onClose: () => void;
}

export function InventoryTransferCreateModal({ inventoryItems, branches, myBranchId, isBranchManager, onClose }: InventoryTransferCreateModalProps) {
    // Branch manager: default arahnya "kirim dari cabang saya", tinggal pilih tujuan.
    // Owner: dua dropdown bebas, bisa orkestrasi transfer antar cabang manapun.
    const [direction, setDirection] = React.useState<'send' | 'receive'>('send');

    const { data, setData, post, processing, errors, reset } = useForm({
        sender_branch_id: isBranchManager && direction === 'send' ? String(myBranchId) : '',
        receiver_branch_id: isBranchManager && direction === 'receive' ? String(myBranchId) : '',
        date: new Date().toISOString().slice(0, 10),
        items: [{ inventory_item_id: '', quantity: 1 }] as { inventory_item_id: string; quantity: number }[],
    });

    const handleDirectionChange = (dir: 'send' | 'receive') => {
        setDirection(dir);
        if (dir === 'send') {
            setData((prev) => ({ ...prev, sender_branch_id: String(myBranchId), receiver_branch_id: '' }));
        } else {
            setData((prev) => ({ ...prev, sender_branch_id: '', receiver_branch_id: String(myBranchId) }));
        }
    };

    const addItem = () => setData('items', [...data.items, { inventory_item_id: '', quantity: 1 }]);
    const removeItem = (index: number) =>
        setData(
            'items',
            data.items.filter((_, i) => i !== index),
        );
    const updateItem = (index: number, field: 'inventory_item_id' | 'quantity', value: string | number) => {
        const items = [...data.items];
        items[index] = { ...items[index], [field]: value };
        setData('items', items);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.inventory.transfers.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const selectClass =
        'w-full appearance-none rounded-md border border-input bg-transparent pl-3 pr-10 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">Buat Kiriman Baru</h3>
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
                    {isBranchManager ? (
                        <>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleDirectionChange('send')}
                                    className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold transition ${
                                        direction === 'send'
                                            ? 'border-[var(--surface-header)] bg-[var(--second-accent)]'
                                            : 'border-[var(--border-strong)] text-[var(--grey-text)]'
                                    }`}
                                >
                                    Kirim ke cabang lain
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDirectionChange('receive')}
                                    className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold transition ${
                                        direction === 'receive'
                                            ? 'border-[var(--surface-header)] bg-[var(--second-accent)]'
                                            : 'border-[var(--border-strong)] text-[var(--grey-text)]'
                                    }`}
                                >
                                    Minta dari cabang lain
                                </button>
                            </div>

                            <div className="flex items-center gap-2 rounded-lg bg-[var(--second-accent)] px-3 py-2.5 text-sm">
                                <span className="font-semibold text-[var(--subheading)]">
                                    {branches.find((b) => b.id === myBranchId)?.name ?? 'Cabang saya'}
                                </span>
                                <ArrowRight className="h-4 w-4 text-[var(--grey-text)]" />
                                <div className="relative flex-1">
                                    <select
                                        aria-label="Pilih cabang tujuan/asal"
                                        value={direction === 'send' ? data.receiver_branch_id : data.sender_branch_id}
                                        onChange={(e) =>
                                            direction === 'send'
                                                ? setData('receiver_branch_id', e.target.value)
                                                : setData('sender_branch_id', e.target.value)
                                        }
                                        className="border-input focus-visible:ring-ring w-full appearance-none rounded-md border bg-white px-2 py-1.5 text-sm focus-visible:ring-1 focus-visible:outline-none"
                                    >
                                        <option value="" disabled>
                                            Pilih cabang
                                        </option>
                                        {branches
                                            .filter((b) => b.id !== myBranchId)
                                            .map((b) => (
                                                <option key={b.id} value={b.id}>
                                                    {b.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                            {(errors.sender_branch_id || errors.receiver_branch_id) && (
                                <span className="text-sm text-red-500">{errors.sender_branch_id ?? errors.receiver_branch_id}</span>
                            )}
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Cabang Pengirim</label>
                                <div className="relative">
                                    <select
                                        aria-label="Cabang pengirim"
                                        value={data.sender_branch_id}
                                        onChange={(e) => setData('sender_branch_id', e.target.value)}
                                        className={selectClass}
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
                                {errors.sender_branch_id && <span className="text-sm text-red-500">{errors.sender_branch_id}</span>}
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Cabang Penerima</label>
                                <div className="relative">
                                    <select
                                        aria-label="Cabang penerima"
                                        value={data.receiver_branch_id}
                                        onChange={(e) => setData('receiver_branch_id', e.target.value)}
                                        className={selectClass}
                                    >
                                        <option value="" disabled>
                                            Pilih cabang
                                        </option>
                                        {branches
                                            .filter((b) => String(b.id) !== data.sender_branch_id)
                                            .map((b) => (
                                                <option key={b.id} value={b.id}>
                                                    {b.name}
                                                </option>
                                            ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                                {errors.receiver_branch_id && <span className="text-sm text-red-500">{errors.receiver_branch_id}</span>}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Tanggal</label>
                        <input
                            aria-label="Tanggal kiriman"
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
                                            className={selectClass}
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
                            {processing ? 'Mengirim...' : 'Kirim Permintaan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
