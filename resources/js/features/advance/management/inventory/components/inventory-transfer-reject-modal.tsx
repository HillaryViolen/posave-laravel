import { Button } from '@/components';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import React, { useState } from 'react';

interface TransferRejectModalProps {
    transferId: number;
    transferNumber: string;
    onClose: () => void;
}

export function TransferRejectModal({ transferId, transferNumber, onClose }: TransferRejectModalProps) {
    const [note, setNote] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!note.trim()) {
            setError('Alasan penolakan wajib diisi.');
            return;
        }
        setProcessing(true);
        router.patch(
            route('dashboard.inventory.transfers.reject', transferId),
            { note },
            {
                onSuccess: onClose,
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[var(--neutral-white)] p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--subheading)]">Tolak Kiriman {transferNumber}</h3>
                    <button onClick={onClose} aria-label="Tutup">
                        <X className="h-5 w-5 text-[var(--grey-text)] hover:text-[var(--subheading)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--subheading)]">Alasan Penolakan</label>
                        <textarea
                            aria-label="Alasan penolakan"
                            value={note}
                            onChange={(e) => {
                                setNote(e.target.value);
                                setError(null);
                            }}
                            rows={3}
                            placeholder="Contoh: Stok di cabang kami sudah cukup, tidak perlu kiriman ini."
                            className="border-input focus-visible:ring-ring w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none"
                        />
                        {error && <span className="text-sm text-red-500">{error}</span>}
                    </div>

                    <div className="mt-2 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-red-600 text-white hover:bg-red-700">
                            {processing ? 'Menolak...' : 'Tolak Kiriman'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
