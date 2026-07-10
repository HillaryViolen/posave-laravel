import React from 'react';
import { Trash2 } from 'lucide-react';

export interface Adjustment {
    id: number;
    branch: string;
    date: string;
    note: string;
    qty_change: number;
    financial_change: number;
    item: { id: number; name: string; sku: string; price: number };
}

interface InventoryAdjustmentActionsMenuProps {
    adjustment: Adjustment;
    position: { top: number; left: number };
    onClose: () => void;
    onDelete: (id: number) => void;
}

export function InventoryAdjustmentActionsMenu({
    adjustment,
    position,
    onClose,
    onDelete,
}: InventoryAdjustmentActionsMenuProps) {
    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div
                className="fixed z-50 w-44 overflow-hidden rounded-xl bg-[var(--neutral-white)] shadow-lg border border-[var(--border)]"
                style={{ top: position.top, left: position.left }}
            >
                <button
                    onClick={() => onDelete(adjustment.id)}
                    className="flex w-full items-center gap-2 bg-red-50 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-100 transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                    Hapus Riwayat
                </button>
            </div>
        </>
    );
}