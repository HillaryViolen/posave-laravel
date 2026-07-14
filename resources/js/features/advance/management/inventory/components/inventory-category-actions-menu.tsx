import { DropdownActionMenu } from '@/components';
import { Pencil, Trash2 } from 'lucide-react';

export interface InventoryCategory {
    id: number;
    name: string;
    color: string | null;
    items_count: number;
}

interface InventoryCategoryActionsMenuProps {
    category: InventoryCategory;
    position: { top: number; left: number };
    onClose: () => void;
    onEdit: (category: InventoryCategory) => void;
    onDelete: (id: number) => void;
}

export function InventoryCategoryActionsMenu({ category, position, onClose, onEdit, onDelete }: InventoryCategoryActionsMenuProps) {
    return (
        <DropdownActionMenu
            position={position}
            onClose={onClose}
            items={[
                { label: 'Ubah', icon: Pencil, onClick: () => onEdit(category) },
                { label: 'Hapus', icon: Trash2, onClick: () => onDelete(category.id), variant: 'danger' },
            ]}
        />
    );
}
