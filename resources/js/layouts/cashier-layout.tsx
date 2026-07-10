import { AppShell, AppSidebar } from '@/components';
import { cashierNavItems } from '@/data';
import { Chatbot } from '@/features/chatbot';
import type { ReactNode } from 'react';

interface CashierLayoutProps {
    children: ReactNode;
}

export function CashierLayout({ children }: CashierLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar items={cashierNavItems} />
            <main className="flex h-screen flex-1 overflow-hidden">{children}</main>
            <Chatbot />
        </AppShell>
    );
}
