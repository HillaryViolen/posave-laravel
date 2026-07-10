export type TransactionStatus = 'completed' | 'refunded' | 'void';

export type CartItem = { name: string; price: number; qty: number; note: string | null };

export type Transaction = {
    id: number;
    invoice: string;
    time: string;
    date: string;
    dateLabel: string;
    paymentMethod: string;
    total: number;
    discount: number;
    status: TransactionStatus;
    items: CartItem[];
};

export const STATUS_LABEL: Record<TransactionStatus, string> = {
    completed: 'Selesai',
    refunded: 'Direfund',
    void: 'Dibatalkan',
};

export const STATUS_STYLES: Record<TransactionStatus, string> = {
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    refunded: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    void: 'bg-red-100 text-red-700 border-red-200',
};

export const STATUS_BADGE_STYLES: Record<TransactionStatus, string> = {
    completed: 'bg-emerald-600 text-white',
    refunded: 'bg-yellow-500 text-white',
    void: 'bg-red-600 text-white',
};