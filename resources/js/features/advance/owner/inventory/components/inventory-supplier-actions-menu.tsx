import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export interface Supplier {
    id: number;
    name: string;
    category: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    logo: string | null;
}

interface InventorySupplierActionsMenuProps {
    supplier: Supplier;
    position: { top: number; left: number };
    onClose: () => void;
    onEdit: (supplier: Supplier) => void;
    onDelete: (id: number) => void;
}

export function InventorySupplierActionsMenu({ supplier, position, onClose, onEdit, onDelete }: InventorySupplierActionsMenuProps) {
    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div
                className="fixed z-50 w-36 overflow-hidden rounded-xl shadow-lg"
                style={{ top: position.top, left: position.left }}
            >
                <button
                    onClick={() => onEdit(supplier)}
                    className="flex w-full items-center gap-2 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-500 hover:bg-orange-100"
                >
                    <Pencil className="h-4 w-4" />
                    Ubah
                </button>
                <button
                    onClick={() => onDelete(supplier.id)}
                    className="flex w-full items-center gap-2 bg-red-50 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-100"
                >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                </button>
            </div>
        </>
    );
}