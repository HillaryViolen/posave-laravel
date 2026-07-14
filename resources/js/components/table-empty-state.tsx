import { Button, TableCell, TableRow } from '@/components';
import type { LucideIcon } from 'lucide-react';

interface TableEmptyStateAction {
    label: string;
    onClick: () => void;
}

interface TableEmptyStateProps {
    colSpan: number;
    message: string;
    description?: string;
    icon?: LucideIcon;
    action?: TableEmptyStateAction;
}

export function TableEmptyState({ colSpan, message, description, icon: Icon, action }: TableEmptyStateProps) {
    const isRich = Boolean(Icon || description || action);

    return (
        <TableRow>
            <TableCell colSpan={colSpan} className={isRich ? 'py-12 text-center' : 'py-10 text-center text-[var(--grey-text)]'}>
                {Icon && <Icon className="mx-auto mb-2 h-8 w-8 text-gray-300" />}
                <p className={isRich ? 'font-medium text-[var(--subheading)]' : ''}>{message}</p>
                {description && <p className="mb-4 text-sm text-[var(--grey-text)]">{description}</p>}
                {action && (
                    <Button onClick={action.onClick} variant="outline" className={description ? '' : 'mt-4'}>
                        {action.label}
                    </Button>
                )}
            </TableCell>
        </TableRow>
    );
}
