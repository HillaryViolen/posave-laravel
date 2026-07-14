import { DropdownActionMenu } from '@/components';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export interface Employee {
    id: number;
    name: string;
    role: string;
    branch_id: number | null;
    branch: { id: number; name: string } | null;
    active_date: string;
    slot_status: string;
    user?: { id: number; email: string };
}

interface EmployeeActionsMenuProps {
    employee: Employee;
    position: { top: number; left: number };
    onClose: () => void;
    onView: (employee: Employee) => void;
    onEdit: (employee: Employee) => void;
    onDelete: (id: number) => void;
}

export function EmployeeActionsMenu({ employee, position, onClose, onView, onEdit, onDelete }: EmployeeActionsMenuProps) {
    return (
        <DropdownActionMenu
            position={position}
            onClose={onClose}
            items={[
                { label: 'Lihat', icon: Eye, onClick: () => onView(employee) },
                { label: 'Ubah', icon: Pencil, onClick: () => onEdit(employee) },
                { label: 'Hapus', icon: Trash2, onClick: () => onDelete(employee.id), variant: 'danger' },
            ]}
        />
    );
}
