import { Button } from '@/components/ui/button';
import { cancelAction, confirmAction } from '@/features/chatbot/api';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import type { PendingAction } from '../types';

interface ActionCardProps {
    action: PendingAction;
}

const TOOL_LABELS: Record<string, string> = {
    create_inventory_item: 'Tambah Barang Baru',
};

function formatValue(key: string, value: unknown): string {
    if (key === 'price' && typeof value === 'number') {
        return `Rp ${value.toLocaleString('id-ID')}`;
    }
    return String(value);
}

export function ActionCard({ action }: ActionCardProps) {
    const [status, setStatus] = useState(action.status);
    const [loading, setLoading] = useState<'confirm' | 'cancel' | null>(null);

    const handleConfirm = async () => {
        setLoading('confirm');
        try {
            await confirmAction(action.id);
            setStatus('confirmed');
        } catch {
            alert('Gagal menjalankan aksi, coba lagi.');
        } finally {
            setLoading(null);
        }
    };

    const handleCancel = async () => {
        setLoading('cancel');
        try {
            await cancelAction(action.id);
            setStatus('cancelled');
        } catch {
            alert('Gagal membatalkan, coba lagi.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="mt-2 w-full max-w-sm rounded-xl border border-blue-200 bg-blue-50 p-3">
            <p className="mb-2 text-xs font-semibold text-blue-700">{TOOL_LABELS[action.tool_name] ?? action.tool_name}</p>
            <dl className="mb-3 flex flex-col gap-1">
                {Object.entries(action.summary)
                    .filter(([key]) => !key.endsWith('_valid'))
                    .map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                            <dt className="text-slate-500">{key.replace(/_/g, ' ')}</dt>
                            <dd className="font-medium text-slate-800">{formatValue(key, value)}</dd>
                        </div>
                    ))}
            </dl>

            {status === 'pending' && (
                <div className="flex gap-2">
                    <Button size="sm" onClick={handleConfirm} disabled={loading !== null} className="flex-1 bg-blue-600 text-xs hover:bg-blue-700">
                        <Check className="mr-1 h-3.5 w-3.5" />
                        {loading === 'confirm' ? 'Menyimpan...' : 'Konfirmasi'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel} disabled={loading !== null} className="flex-1 text-xs">
                        <X className="mr-1 h-3.5 w-3.5" />
                        Batal
                    </Button>
                </div>
            )}

            {status === 'confirmed' && <p className="text-xs font-medium text-green-700">✓ Berhasil disimpan</p>}
            {status === 'cancelled' && <p className="text-xs font-medium text-slate-500">Dibatalkan</p>}
        </div>
    );
}
