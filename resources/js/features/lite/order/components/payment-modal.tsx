import { Button, Input } from '@/components/ui';
import axios from 'axios';
import { Banknote, QrCode, X } from 'lucide-react';
import { useState } from 'react';

interface CartItem {
    itemId: number;
    qty: number;
}

interface PaymentModalProps {
    cart: CartItem[];
    subtotal: number;
    onClose: () => void;
    onSuccess: (invoice: string, total: number) => void;
}

const QUICK_AMOUNTS = [20000, 50000, 100000, 150000];

export function PaymentModal({ cart, subtotal, onClose, onSuccess }: PaymentModalProps) {
    const [method, setMethod] = useState<'cash' | 'qris'>('cash');
    const [customerMoney, setCustomerMoney] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const kembalian = customerMoney > subtotal ? customerMoney - subtotal : 0;
    const canConfirm = method === 'qris' || customerMoney >= subtotal;

    const handleConfirm = async () => {
        setProcessing(true);
        setError(null);
        try {
            const res = await axios.post(route('lite.order.store'), {
                items: cart.map((c) => ({ item_id: c.itemId, qty: c.qty })),
                payment_method: method,
            });
            onSuccess(res.data.invoice_no, res.data.total);
        } catch (err: any) {
            setError(err?.response?.data?.message ?? 'Gagal memproses pembayaran. Coba lagi.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
            <div className="w-full max-w-md rounded-t-3xl bg-[var(--neutral-white)] shadow-xl sm:rounded-3xl">
                <div className="flex items-center justify-between p-5">
                    <h3 className="text-xl font-bold text-[var(--subheading)]">Pembayaran</h3>
                    <button aria-label="Tutup" onClick={onClose}>
                        <X className="h-6 w-6 text-[var(--grey-text)]" />
                    </button>
                </div>

                <div className="flex flex-col gap-4 px-5 pb-5">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            aria-label="Pilih pembayaran tunai"
                            onClick={() => setMethod('cash')}
                            className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 transition ${
                                method === 'cash'
                                    ? 'border-[var(--surface-header)] bg-[var(--second-accent)]'
                                    : 'border-[var(--border-strong)] text-[var(--grey-text)]'
                            }`}
                        >
                            <Banknote className="h-6 w-6" />
                            <span className="text-sm font-bold">Tunai</span>
                        </button>
                        <button
                            aria-label="Pilih pembayaran QRIS"
                            onClick={() => setMethod('qris')}
                            className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 transition ${
                                method === 'qris'
                                    ? 'border-[var(--surface-header)] bg-[var(--second-accent)]'
                                    : 'border-[var(--border-strong)] text-[var(--grey-text)]'
                            }`}
                        >
                            <QrCode className="h-6 w-6" />
                            <span className="text-sm font-bold">QRIS</span>
                        </button>
                    </div>

                    <div className="flex justify-between rounded-xl bg-[var(--second-accent)] px-4 py-3">
                        <span className="text-sm font-semibold text-[var(--subheading)]">Total Tagihan</span>
                        <span className="text-lg font-extrabold text-[var(--subheading)]">Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>

                    {method === 'cash' && (
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-2">
                                {QUICK_AMOUNTS.map((amt) => (
                                    <button
                                        aria-label={`Uang pas Rp ${amt}`}
                                        key={amt}
                                        onClick={() => setCustomerMoney(amt)}
                                        className={`h-11 rounded-xl border-2 text-sm font-bold transition ${
                                            customerMoney === amt
                                                ? 'border-[var(--surface-header)] bg-[var(--surface-header)] text-white'
                                                : 'border-[var(--border-strong)] text-[var(--subheading)]'
                                        }`}
                                    >
                                        Rp {amt.toLocaleString('id-ID')}
                                    </button>
                                ))}
                            </div>
                            <Input
                                aria-label="Uang dari pembeli"
                                type="number"
                                value={customerMoney || ''}
                                onChange={(e) => setCustomerMoney(Number(e.target.value))}
                                placeholder="Uang dari pembeli"
                                className="h-12 rounded-xl text-base"
                            />
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--grey-text)]">Kembalian</span>
                                <span className="font-bold text-[var(--subheading)]">Rp {kembalian.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    )}

                    {method === 'qris' && (
                        <div className="flex flex-col items-center gap-2 rounded-xl bg-[var(--second-accent)] py-6">
                            <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-[var(--border-strong)] bg-white text-xs font-bold text-[var(--grey-text)]">
                                QRIS CODE
                            </div>
                            <span className="text-xs text-[var(--grey-text)]">Tunjukkan ke pembeli</span>
                        </div>
                    )}

                    {error && <p className="text-center text-sm font-medium text-[var(--danger)]">{error}</p>}

                    <Button
                        aria-label="Konfirmasi pembayaran"
                        onClick={handleConfirm}
                        disabled={!canConfirm || processing}
                        className="h-12 rounded-xl bg-[var(--surface-header)] text-base font-bold hover:bg-[var(--surface-header-hover)] disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : 'Selesaikan Pembayaran'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
