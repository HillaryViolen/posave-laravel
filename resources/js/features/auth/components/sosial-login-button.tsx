import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface SocialLoginButtonProps extends React.ComponentProps<typeof Button> {
    provider: 'google' | 'facebook';
    icon: React.ReactNode;
}

export function SocialLoginButton({ provider, icon, className, children, ...props }: SocialLoginButtonProps) {
    return (
        <Button
            variant="outline"
            className={cn('flex w-full items-center justify-center gap-2 border-gray-300 font-medium text-slate-700 hover:bg-slate-50', className)}
            {...props}
        >
            {icon}
            {children}
        </Button>
    );
}
