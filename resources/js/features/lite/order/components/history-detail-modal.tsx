import { X } from 'lucide-react';

type CartItem = { name: string; price: number; qty: number };
type TransactionStatus = 'completed' | 'refunded' | 'void';

interface HistoryDetailModalProps {
    transaction: {
        invoice: string;
        time: string;
        date: string;
        paymentMethod: string;
        total: number;
        status: TransactionStatus;
        items: CartItem[];
    };
    onClose: () => void;
}

const STATUS_LABEL: Record<TransactionStatus, string> = { completed: 'Selesai', refunded: 'Direfund', void: 'Dibatalkan' };

export function HistoryDetailModal({ transaction, onClose }: HistoryDetailModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
            <div className="w-full max-w-md rounded-t-3xl bg-[var(--neutral-white)] shadow-xl sm:rounded-3xl">
                <div className="flex items-center justify-between p-5">
                    <div>
                        <h3 className="text-lg font-bold text-[var(--subheading)]">{transaction.invoice}</h3>
                        <p className="text-sm text-[var(--grey-text)]">
                            {transaction.date}, {transaction.time}
                        </p>
                    </div>
                    <button aria-label="Tutup" onClick={onClose}>
                        <X className="h-6 w-6 text-[var(--grey-text)]" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto px-5">
                    <div className="mb-3 flex justify-between text-sm">
                        <span className="text-[var(--grey-text)]">Status</span>
                        <span className="font-semibold text-[var(--subheading)]">{STATUS_LABEL[transaction.status]}</span>
                    </div>
                    <div className="mb-3 flex justify-between text-sm">
                        <span className="text-[var(--grey-text)]">Metode Bayar</span>
                        <span className="font-semibold text-[var(--subheading)]">{transaction.paymentMethod.toUpperCase()}</span>
                    </div>
                    <div className="my-3 border-t border-[var(--border-strong)]" />
                    <div className="flex flex-col gap-2">
                        {transaction.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span className="text-[var(--subheading)]">
                                    {item.qty}x {item.name}
                                </span>
                                <span className="font-semibold text-[var(--subheading)]">Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-[var(--border-strong)] p-5">
                    <div className="flex justify-between text-lg font-extrabold text-[var(--subheading)]">
                        <span>Total</span>
                        <span>Rp {transaction.total.toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
