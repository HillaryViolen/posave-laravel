import React from 'react';
import { CheckCircle2, Trash2, XCircle } from 'lucide-react';

export interface Transfer {
    id: number;
    transfer_number: string;
    date: string;
    status: 'waiting' | 'success' | 'cancelled';
    items_count: number;
    sender_branch: string;
    receiver_branch: string;
}

interface InventoryTransferActionsMenuProps {
    transfer: Transfer;
    position: { top: number; left: number };
    onClose: () => void;
    onUpdateStatus: (id: number, status: 'success' | 'cancelled') => void;
    onDelete: (id: number) => void;
}

export function InventoryTransferActionsMenu({ transfer, position, onClose, onUpdateStatus, onDelete }: InventoryTransferActionsMenuProps) {
    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div
                className="fixed z-50 w-44 overflow-hidden rounded-xl shadow-lg"
                style={{ top: position.top, left: position.left }}
            >
                {transfer.status === 'waiting' && (
                    <>
                        <button
                            onClick={() => onUpdateStatus(transfer.id, 'success')}
                            className="flex w-full items-center gap-2 bg-green-50 px-4 py-3 text-sm font-medium text-green-600 hover:bg-green-100"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Tandai Sukses
                        </button>
                        <button
                            onClick={() => onUpdateStatus(transfer.id, 'cancelled')}
                            className="flex w-full items-center gap-2 bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-600 hover:bg-yellow-100"
                        >
                            <XCircle className="h-4 w-4" />
                            Batalkan
                        </button>
                    </>
                )}
                <button
                    onClick={() => onDelete(transfer.id)}
                    className="flex w-full items-center gap-2 bg-red-50 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-100"
                >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                </button>
            </div>
        </>
    );
}