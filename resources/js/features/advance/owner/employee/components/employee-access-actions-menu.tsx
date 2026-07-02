import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export interface EmployeeAccess {
    id: number;
    name: string;
    employees_count: number;
}

interface EmployeeAccessActionsMenuProps {
    access: EmployeeAccess;
    position: { top: number; left: number };
    onClose: () => void;
    onEdit: (access: EmployeeAccess) => void;
    onDelete: (id: number) => void;
}

export function EmployeeAccessActionsMenu({ access, position, onClose, onEdit, onDelete }: EmployeeAccessActionsMenuProps) {
    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />

            <div
                className="fixed z-50 w-36 overflow-hidden rounded-xl shadow-lg"
                style={{ top: position.top, left: position.left }}
            >
                <button
                    onClick={() => onEdit(access)}
                    className="flex w-full items-center gap-2 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-500 hover:bg-orange-100"
                >
                    <Pencil className="h-4 w-4" />
                    Ubah
                </button>

                <button
                    onClick={() => onDelete(access.id)}
                    className="flex w-full items-center gap-2 bg-red-50 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-100"
                >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                </button>
            </div>
        </>
    );
}