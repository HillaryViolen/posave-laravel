import type { LucideIcon } from 'lucide-react';

interface DropdownActionMenuItem {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: 'default' | 'danger' | 'success' | 'warning';
}

interface DropdownActionMenuProps {
    position: { top: number; left: number };
    onClose: () => void;
    items: DropdownActionMenuItem[];
    width?: string;
}

const VARIANT_STYLES: Record<string, string> = {
    default: 'bg-orange-50 text-orange-500 hover:bg-orange-100',
    danger: 'bg-red-50 text-red-500 hover:bg-red-100',
    success: 'bg-green-50 text-green-600 hover:bg-green-100',
    warning: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
};

export function DropdownActionMenu({ position, onClose, items, width = 'w-36' }: DropdownActionMenuProps) {
    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className={`fixed z-50 ${width} overflow-hidden rounded-xl shadow-lg`} style={{ top: position.top, left: position.left }}>
                {items.map((item, i) => (
                    <button
                        key={i}
                        onClick={item.onClick}
                        className={`flex w-full items-center gap-2 px-4 py-3 text-sm font-medium ${VARIANT_STYLES[item.variant ?? 'default']}`}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </button>
                ))}
            </div>
        </>
    );
}
