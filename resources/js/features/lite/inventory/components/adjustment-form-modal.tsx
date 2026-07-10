import { Button } from '@/components/ui';
import { useForm } from '@inertiajs/react';
import { ClipboardEdit, Minus, Plus, X } from 'lucide-react';

interface AdjustmentFormModalProps {
    items: { id: number; name: string }[];
    onClose: () => void;
}

type Direction = 'in' | 'out';

const REASONS: Record<Direction, string[]> = {
    out: ['Barang rusak', 'Hilang', 'Kadaluarsa'],
    in: ['Ketemu lebih saat hitung ulang', 'Retur dari pelanggan'],
};

export function AdjustmentFormModal({ items, onClose }: AdjustmentFormModalProps) {
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        inventory_item_id: '',
        direction: 'out' as Direction,
        amount: '1',
        note: '',
    });

    const handleDirectionChange = (direction: Direction) => {
        setData((prev) => ({ ...prev, direction, note: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((formData) => {
            const amountNum = Number(formData.amount) || 0;
            const qty_change = formData.direction === 'out' ? -amountNum : amountNum;
            return {
                inventory_item_id: formData.inventory_item_id,
                qty_change,
                note: formData.note,
            };
        });

        post(route('lite.inventory.adjustments.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
            <div className="w-full max-w-md rounded-t-3xl bg-[var(--neutral-white)] shadow-xl sm:rounded-3xl">
                <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--second-accent)]">
                            <ClipboardEdit className="h-6 w-6 text-[var(--subheading)]" />
                        </span>
                        <h3 className="text-xl font-bold text-[var(--subheading)]">Catat Perubahan</h3>
                    </div>
                    <button aria-label="Tutup" onClick={onClose}>
                        <X className="h-6 w-6 text-[var(--grey-text)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 pb-5">
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-[var(--subheading)]">Barang</label>
                        <select
                            aria-label="Pilih barang"
                            value={data.inventory_item_id}
                            onChange={(e) => setData('inventory_item_id', e.target.value)}
                            className="h-12 w-full rounded-xl border border-[var(--border-strong)] bg-transparent px-3 text-base"
                        >
                            <option value="" disabled>
                                Pilih barang
                            </option>
                            {items.map((i) => (
                                <option key={i.id} value={i.id}>
                                    {i.name}
                                </option>
                            ))}
                        </select>
                        {errors.inventory_item_id && <p className="mt-1 text-sm text-[var(--danger)]">{errors.inventory_item_id}</p>}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[var(--subheading)]">Apa yang terjadi?</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                aria-label="Stok berkurang"
                                onClick={() => handleDirectionChange('out')}
                                className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 transition ${
                                    data.direction === 'out'
                                        ? 'border-[var(--danger)] bg-[var(--danger-background)] text-[var(--danger)]'
                                        : 'border-[var(--border-strong)] text-[var(--grey-text)]'
                                }`}
                            >
                                <Minus className="h-6 w-6" />
                                <span className="text-sm font-bold">Stok Berkurang</span>
                            </button>
                            <button
                                type="button"
                                aria-label="Stok bertambah"
                                onClick={() => handleDirectionChange('in')}
                                className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 transition ${
                                    data.direction === 'in'
                                        ? 'border-[var(--success)] bg-[var(--success-background)] text-[var(--success)]'
                                        : 'border-[var(--border-strong)] text-[var(--grey-text)]'
                                }`}
                            >
                                <Plus className="h-6 w-6" />
                                <span className="text-sm font-bold">Stok Bertambah</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-[var(--subheading)]">Jumlah</label>
                        <input
                            aria-label="Jumlah perubahan"
                            type="number"
                            min="1"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="h-12 w-full rounded-xl border border-[var(--border-strong)] bg-transparent px-3 text-base"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[var(--subheading)]">Alasan</label>
                        <div className="flex flex-wrap gap-2">
                            {REASONS[data.direction].map((reason) => (
                                <button
                                    key={reason}
                                    type="button"
                                    aria-label={`Alasan: ${reason}`}
                                    onClick={() => setData('note', reason)}
                                    className={`rounded-full border-2 px-3 py-1.5 text-sm font-medium transition ${
                                        data.note === reason
                                            ? 'border-[var(--surface-header)] bg-[var(--surface-header)] text-white'
                                            : 'border-[var(--border-strong)] text-[var(--grey-text)]'
                                    }`}
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>
                        <input
                            aria-label="Alasan lainnya"
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            placeholder="Atau tulis alasan lain..."
                            className="mt-2 h-12 w-full rounded-xl border border-[var(--border-strong)] bg-transparent px-3 text-base"
                        />
                        {errors.note && <p className="mt-1 text-sm text-[var(--danger)]">{errors.note}</p>}
                    </div>

                    <Button
                        aria-label="Simpan perubahan"
                        type="submit"
                        disabled={processing}
                        className="mt-2 h-12 rounded-xl bg-[var(--surface-header)] text-base font-bold hover:bg-[var(--surface-header-hover)]"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
