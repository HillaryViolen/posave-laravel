import { ConfirmDialog } from '@/components';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface PendingConfirm {
    message: string;
    variant: 'danger' | 'default';
    onConfirm: () => void;
}

interface DeleteOptions {
    variant?: 'danger' | 'default';
    onSuccess?: () => void;
    onError?: () => void;
}

export function useConfirmAction() {
    const [pending, setPending] = useState<PendingConfirm | null>(null);

    const confirmAndDelete = (message: string, url: string, options: DeleteOptions = {}) => {
        setPending({
            message,
            variant: options.variant ?? 'danger',
            onConfirm: () => router.delete(url, { onSuccess: options.onSuccess, onError: options.onError }),
        });
    };

    const confirmAndRun = (message: string, action: () => void, variant: 'danger' | 'default' = 'danger') => {
        setPending({ message, variant, onConfirm: action });
    };

    const handleConfirm = () => {
        pending?.onConfirm();
        setPending(null);
    };

    const confirmDialog = pending ? (
        <ConfirmDialog message={pending.message} variant={pending.variant} onConfirm={handleConfirm} onCancel={() => setPending(null)} />
    ) : null;

    return { confirmAndDelete, confirmAndRun, confirmDialog };
}
